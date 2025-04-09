using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VolanGo.Entities;
using VolanGo.Services;

namespace VolanGo.Controllers
{
    [ApiController]
    [Route("api/verification")]
    public class VerificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

        public VerificationController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost("send-verification-email")]
        public async Task<IActionResult> SendVerificationEmail([FromBody] string email)
        {
            // Check if user exists
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Generate a 6-digit verification code
            var verificationCode = new Random().Next(100000, 999999).ToString();

            // Remove any existing code for this user
            var existingCode = await _context.VerificationCodes
                .Where(vc => vc.UserId == user.UserId)
                .ToListAsync();

            if (existingCode.Any())
            {
                _context.VerificationCodes.RemoveRange(existingCode);
            }

            // Save code to database with 10-minute expiration
            var codeEntry = new VerificationCode
            {
                Code = verificationCode,
                ExpirationTime = DateTime.UtcNow.AddMinutes(10),
                UserId = user.UserId
            };

            _context.VerificationCodes.Add(codeEntry);
            await _context.SaveChangesAsync();

            // Send email
            var subject = "Your Email Verification Code";
            var body = $"Your verification code is: {verificationCode}. It will expire in 10 minutes.";
            await _emailService.SendEmailAsync(email, subject, body);

            return Ok(new { Message = "Verification email sent successfully." });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyCodeRequest request)
        {
            // Find the verification code in the database
            var codeEntry = await _context.VerificationCodes
                .Include(vc => vc.User) // Include the User for easier access
                .FirstOrDefaultAsync(vc => vc.User.Email == request.Email && vc.Code == request.Code);

            if (codeEntry == null)
            {
                return BadRequest("Invalid verification code.");
            }

            if (DateTime.UtcNow > codeEntry.ExpirationTime)
            {
                _context.VerificationCodes.Remove(codeEntry); // Cleanup expired code
                await _context.SaveChangesAsync();
                return BadRequest("Verification code has expired.");
            }

            // Update the User's isVerified status
            codeEntry.User.IsVerified = true;

            // Remove the used verification code
            _context.VerificationCodes.Remove(codeEntry);

            await _context.SaveChangesAsync();

            return Ok(new {Message = "Email verified successfully, user is now verified!"});
        }
    }

    public class VerifyCodeRequest
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}