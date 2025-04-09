using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.DbConnection;
using Backend.regex_validator;
using Backend.RequestBodies;
using Backend.TokenService;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;


namespace VolanGo.EndPoints
{
    [ApiController]
    [Route("search")]
    public class SearchController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SearchController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("isAdminOrUser")]
        public async Task<IActionResult> IsAdminOrUser([FromBody] TokenValidation accessToken)
        {
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(accessToken.Token) as JwtSecurityToken;
        
            if (jsonToken == null)
            {
                return BadRequest(new { message = "Nevalidan token", json = jsonToken });
            }
        
            var expiration = jsonToken?.ValidTo;
        
            // Ako je token istekao
            // if (expiration <= DateTime.UtcNow)
            // {
            //     return Unauthorized(new { message = "Token je istekao." });
            // }
        
            var roleClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
        
            if (roleClaim == null)
            {
                return BadRequest(new { message = "Nevalidan role", role = roleClaim });
            }
        
            // Vraćanje odgovora sa roleClaim
            if (roleClaim == "user")
            {
                return Ok(new { role = "user" });
            }
            else if (roleClaim == "admin")
            {
                return Ok(new { role = "admin" });
            }
            else
            {
                return BadRequest(new { message = "Nepoznata rola", role = roleClaim });
            }
        }

        [HttpGet("UserDetails")]

        public async Task<IActionResult> UserDetails([FromQuery] string email){

            // Provjera da li se radi o adminu
            var osoba = _context.Users.FirstOrDefault(u => u.Email == email);
            var rola = _context.UserRoles.FirstOrDefault(r => r.UserId == osoba.UserId);
            if(rola.RoleId == 2){
                return Ok(new { Message = "Radi se o adminu" });
            }

            // Dajemo sve podatke o osobi
            if(osoba.Image != null){
              return Ok(new {success = true, user = osoba, userPicture = Convert.ToBase64String(osoba.Image)});
            }
            return Ok(new {success = true, user = osoba});
            

        }

        [HttpPut("update/UserInfo")]
        public async Task<IActionResult> SaveChanges([FromBody] RequestUser userUpdate)
        {
            if (userUpdate == null)
            {
                return BadRequest("Invalid data.");
            }
        
            var user = _context.Users.FirstOrDefault(u => u.UserId == userUpdate.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }
        
            // Ažuriraj korisničke podatke
            user.Username = userUpdate.Username;
            user.FirstName = userUpdate.FirstName;
            user.LastName = userUpdate.LastName;
            user.PhoneNumber = userUpdate.PhoneNumber;  // Ispravljeno: uklonjena duplikacija
            user.Email = userUpdate.Email;
            user.DateOfBirth = userUpdate.DateOfBirth.ToUniversalTime();
            user.CreatedAt = DateTime.Now.ToUniversalTime();

            if(userUpdate.Password != ""){
                user.PasswordHash = regex_validator.GenerateHash(userUpdate.Password);
            }

            // Spasi promene u bazi
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Danas je suncan dan" });
            
        }

        

    //    [HttpPost("isLoggedIn")]
    //    public async Task<IActionResult> IsLoggedIn([FromBody] TokenValidation accessToken)
    //     {
    //     // Dekodiranje tokena
    //       var handler = new JwtSecurityTokenHandler();
    //       var jsonToken = handler.ReadToken(accessToken.token) as JwtSecurityToken;
  
    //       if (jsonToken == null)
    //       {
    //           return BadRequest(new {message = "Nevalidan token", json = jsonToken}); // Token nije validan
    //       }
  
    //       // Čitanje "role" claim-a
    //       var roleClaim = jsonToken?.Claims.FirstOrDefault(c => c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role")?.Value;
  
    //       if (roleClaim == null)
    //       {
    //           return BadRequest(new {message = "Nevalidan role", role = roleClaim});// Nema role claim u tokenu
    //       }
  
    //       // Provera da li je uloga "admin" ili "user"
    //           return Ok(new {roleClaim});
    //    }

        // [HttpPost("isAdminOrUser")]
        //  public async Task<IActionResult> GetValidationUserorAdmin([FromBody] LoginUser user)
        //  {
        //     // var User = _context.Users.FirstOrDefault(x => x.Email == user.email);
        //     // if(User.IsAdmin){
        //     //     return Ok(new {isAdmin = User.IsAdmin});
        //     // }
        //     // return Ok(new{isAdmin = User.IsAdmin});
        //  }

    }
}