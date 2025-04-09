using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;

namespace VolanGo.EndPoints
{
    [ApiController]
    [Route("logout")]
    public class LogoutController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LogoutController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Brišemo accessToken kolačić
            Response.Cookies.Delete("accessToken", new CookieOptions
            {
                HttpOnly = true,  // Samo server može pristupiti kolačiću
                Secure = true,    // Kolačić će biti dostupan samo putem HTTPS-a
                SameSite = SameSiteMode.Strict, // Ograničava kolačiće na iste domene
                Path = "/"         // Putanja na kojoj je kolačić postavljen
            });
        
            // Brišemo refreshToken kolačić (ako postoji)
            Response.Cookies.Delete("refreshToken", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Path = "/"
            });
        
            return Ok(new { message = "User logged out successfully" });
        }

    }
}