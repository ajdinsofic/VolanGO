using Backend.DbConnection;
using Backend.regex_validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace VolanGo.Controllers
{
    [ApiController]
    [Route("api/userPicture")]

    public class UsersProfilePicture(ApplicationDbContext db) : ControllerBase{
          
        [HttpGet("profile-picture/{userId}")]
        public async Task<ActionResult> profilePicture(int userId, CancellationToken cancellationToken){

            if(userId == 0){ return NotFound();}
            var user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
            return Ok(Convert.ToBase64String(user.Image));
        }

       [HttpPost("upload-profile-picture/{userId}")]
public async Task<ActionResult> profilePicture(int userId, [FromBody] ImageUploadRequest requsetBody, CancellationToken cancellationToken)
{
    if (userId == 0)
    {
        return NotFound();
    }

    var user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);

    if (user == null)
    {
        return NotFound("User not found");
    }

    try
    {
        // Konvertiraj Base64 string u byte array
        byte[] imageBytes = Convert.FromBase64String(requsetBody.ImageData);

        // Dodijeli byte array svojstvu Image korisnika
        user.Image = imageBytes;

        // Spremi promjene u bazu podataka
        await db.SaveChangesAsync(cancellationToken);

        return Ok(new {message = "Profile picture updated"});
    }
    catch (FormatException ex)
    {
        // Uhvati FormatException ako imageData nije ispravan Base64 string
        return BadRequest("Invalid Base64 string: " + ex.Message);
    }
    catch (Exception ex)
    {
        // Uhvati ostale iznimke
        return StatusCode(500, "Internal server error: " + ex.Message);
    }
}


        [HttpGet("passwordCheck/{userId}")]
public async Task<ActionResult> passwordCheck(int userId, [FromQuery] string password, CancellationToken cancellationToken)
{
    try
    {
        if (userId == 0)
        {
            return NotFound(new { success = false, message = "User not found." });
        }

        var user = await db.Users.FirstOrDefaultAsync(u => u.UserId == userId, cancellationToken);
        if (user == null)
        {
            return NotFound(new { success = false, message = "User does not exist." });
        }

        if (regex_validator.ProvjeriLozinku(password))
        {
            if (regex_validator.CompareHashes(password, user.PasswordHash))
            {
                return Ok(new { success = true });
            }
            else
            {
                return Unauthorized(new { success = false, message = "Invalid password." });
            }
        }
        else
        {
            return BadRequest(new { success = false, message = "Password validation failed." });
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = "An error occurred.", error = ex.Message });
    }
}

    [HttpGet("passwordValidate")]
public async Task<ActionResult> passwordValidate([FromQuery] string password, CancellationToken cancellationToken)
{
    try
    {
        if (regex_validator.ProvjeriLozinku(password))
        {
            
            return Ok(new { success = true });
        }
        else
        {
            return BadRequest(new { success = false, message = "Password validation failed." });
        }
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { success = false, message = "An error occurred.", error = ex.Message });
    }
}

        public class ImageUploadRequest
        {
            public string ImageData { get; set; }
        }


    }
}