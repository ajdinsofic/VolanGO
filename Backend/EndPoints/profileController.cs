// using Microsoft.AspNetCore.Mvc;
// using RS1_2024_25.API.Data.Models; // Import User model
// using Microsoft.EntityFrameworkCore; // Assuming you're using EF Core
// using System.Threading.Tasks;
// using Backend.DbConnection;

// [ApiController]
// [Route("api/users")]
// public class UserController : ControllerBase
// {
//     private readonly ApplicationDbContext _context;

//     public UserController(ApplicationDbContext context)
//     {
//         _context = context;
//     }

// [HttpPost("upload-profile-picture/{userId}")]
// public async Task<IActionResult> UploadProfilePicture(int userId, [FromBody] ProfilePictureRequest request)
// {
//     if (request?.ImageData == null)
//     {
//         return BadRequest(new { message = "Image data is missing." });
//     }
//     public UserController(ApplicationDbContext context)
//     {
//         _context = context;
//     }
//     [HttpGet("all")]
//     public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
//     {
//         return await _context.Users.ToListAsync();
//     }
// [HttpPost("upload-profile-picture/{userId}")]
// public async Task<IActionResult> UploadProfilePicture(int userId, [FromBody] ProfilePictureRequest request)
// {
//     if (request?.ImageData == null)
//     {
//         return BadRequest(new { message = "Image data is missing." });
//     }

//     try
//     {
//         byte[] imageBytes = Convert.FromBase64String(request.ImageData);

//         // Simulate saving the profile picture to the database (replace this with actual DB logic)
//         var user = await _context.Users.FindAsync(userId);
//         if (user == null)
//             return NotFound(new { message = "User not found." });

//         user.ProfilePicture = imageBytes;
//         await _context.SaveChangesAsync();

//         return Ok(new { success = true, message = "Profile picture uploaded successfully." });

//     }
//     catch (Exception ex)
//     {
//         return StatusCode(500, new { message = "An error occurred while uploading the image.", error = ex.Message });
//     }
// }


// [HttpGet("profile-picture/{userId}")]
// public async Task<IActionResult> GetProfilePicture(int userId)
// {
//     var user = await _context.Users.FindAsync(userId);
//     if (user == null || userId == null)
//         return NotFound(new { message = "User or profile picture not found." });

//     return File(user, "image/png"); // Return the image as a file
// }
// }

// public class ProfilePictureRequest
// {
//     public string ImageData { get; set; }
// }
