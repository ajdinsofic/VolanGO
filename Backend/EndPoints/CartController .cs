using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Backend.Entities;
using Backend.RequestBodies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace Backend.EndPoints
{
    [ApiController]
    public class CartController  : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CartController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpPost("post/cartOption")]
        [EnableRateLimiting("fixed")]
        public async Task<IActionResult> PostCartOption([FromBody] SelectedCarRequest selectedCar)
        {
            // Check if access token is provided
            if (string.IsNullOrEmpty(selectedCar.accessToken))
            {
                return BadRequest(new { Message = "Access token is missing." });
            }
        
            try
            {
                // Retrieve the user ID from the access token
                int userId = GetFromAccessToken(selectedCar.accessToken);
                if (userId == 0)
                {
                    // If the user ID is 0, something went wrong with extracting the token
                    return Unauthorized(new { Message = "Invalid access token." });
                }
        
                // Create a new cart option from the selected car
                var newCartOption = new saveToCart
                {
                    userid = userId, 
                    vehicleId = selectedCar.vehicleId, // Make sure this is mapped correctly
                    locationId = selectedCar.locationId,
                    name = selectedCar.name,  // Ensure 'Name' matches your model property
                    image = Convert.FromBase64String(selectedCar.image),  // Convert the image to bytes
                    priceperday = selectedCar.pricePerDay,
                    pickupdate = selectedCar.PickUpDate,
                    dropoffdate = selectedCar.DropOffDate,  // Ensure 'PricePerDay' matches your model property
                };
        
                // Save the cart option to the database
                _context.saveToCarts.Add(newCartOption);
                _context.SaveChanges();  // Use async/await for better performance
        
                // Return success message
                return Ok(new { Message = "Option successfully saved to the database." });
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging
                // You could log it to a file, or a logging service like Serilog, NLog, etc.
                // _logger.LogError(ex, "Error while saving to cart");
        
                return StatusCode(500, new { Message = "An error occurred while saving to the database.", Details = ex.Message });
            }
        }


        
        private int GetFromAccessToken(string accessToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accessToken) as JwtSecurityToken;
        
            if (jsonToken == null)
            {
                return 0;
            }
        
            var expiration = jsonToken?.ValidTo;
        
            // // Ako je token istekao
            // if (expiration <= DateTime.UtcNow)
            // {
            //     return 0;
            // }
        
           var Emailclaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.Value;

           var user = _context.Users.FirstOrDefault(u => u.Email == Emailclaim);
           return user.UserId;
        }

        [HttpDelete("delete/cartOption")]
        public async Task<IActionResult> DeleteFromDatabase([FromBody] SelectedCarRequest selectedCar)
        {
            if (selectedCar == null || string.IsNullOrEmpty(selectedCar.name) || string.IsNullOrEmpty(selectedCar.image) || selectedCar.pricePerDay <= 0)
            {
                return BadRequest("Invalid car request data. All fields are required and price must be greater than 0.");
            }
        
            // Fetch all records matching the provided fields (name, image, pricePerDay, accessToken)
            var carOption = await _context.saveToCarts
                .Where(c => c.name == selectedCar.name && c.priceperday == selectedCar.pricePerDay)
                .ToListAsync(); // Use ToListAsync for async DB query
        
            // If no matching records are found, return NotFound
            if (carOption == null || carOption.Count == 0)
            {
                return NotFound("No car options found with the provided details.");
            }
        
            // Remove all matching car options
            _context.saveToCarts.RemoveRange(carOption);
        
            // Commit the changes to the database
            await _context.SaveChangesAsync();
        
            // Return success response after deletion
            return Ok("Car options deleted successfully.");
        }

        [HttpGet("get/cartOption")]
        public async Task<IActionResult> GetFromDatabase([FromQuery] string accessToken)
        {
            if (string.IsNullOrEmpty(accessToken))
            {
                return BadRequest("Access token is required");
            }
    
            int userId = GetFromAccessToken(accessToken);  // Retrieve userId from the accessToken
            var carOption = _context.saveToCarts.Where(c => c.userid == userId);
            
            if (carOption == null || !carOption.Any())
            {
                return NotFound("No cart options found for the user.");
            }
    
            return Ok(new { Message = "Data pulled from database", carOption });
        }

    }
}