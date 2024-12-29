using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace VolanGo.Controllers
{
    [ApiController]
    [Route("api/twofactor")]
    public class TwoFactorAuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly string _twilioAccountSid;
        private readonly string _twilioAuthToken;
        private readonly string _twilioVerifyServiceSid;

        public TwoFactorAuthController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
            _twilioAccountSid = _configuration["Twilio:AccountSID"];
            _twilioAuthToken = _configuration["Twilio:AuthToken"];
            _twilioVerifyServiceSid = _configuration["Twilio:VerifyServiceSID"];

            TwilioClient.Init(_twilioAccountSid, _twilioAuthToken);
        }

        // Send Verification Code
        [HttpPost("send-code")]
        public async Task<IActionResult> SendVerificationCode([FromBody] string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                return BadRequest(new { message = "Phone number is required." });
            }

            try
            {
                // Use the Twilio Verify API to send the verification code
                var verification = await VerificationResource.CreateAsync(
                    to: phoneNumber,
                    channel: "sms", 
                    pathServiceSid: _twilioVerifyServiceSid
                );

                return Ok(new { message = "Verification code sent successfully.", status = verification.Status });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send verification code.", error = ex.Message });
            }
        }

        // Verify Code
        [HttpPost("verify-code")]
        public async Task<IActionResult> VerifyCode([FromBody] VerifySMSCodeRequest request)
        {
            try
            {
                var verificationCheck = VerificationCheckResource.Create(
                    to:request.PhoneNumber,
                    code: request.Code,
                    pathServiceSid: _twilioVerifyServiceSid
                );

                if (verificationCheck.Status == "approved")
                {
                    var tempPhoneNum = request.PhoneNumber.StartsWith("+387")? request.PhoneNumber = request.PhoneNumber.Substring(4): request.PhoneNumber;
                    var user = _context.Users.FirstOrDefault(u => u.PhoneNumber == tempPhoneNum);
                    if (user == null) { return NotFound(new { message = "No User found!" }); }
                    user.Is2FAVerified = true;
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Verification successful!" });
                }

                return BadRequest(new { message = "Invalid or expired verification code." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to verify code.", error = ex.Message });
            }
        }
    }

    // Model for Verify Code Request
    public class VerifySMSCodeRequest
    {
        public string PhoneNumber { get; set; }
        public string Code { get; set; }
    }
}