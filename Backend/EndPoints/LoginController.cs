using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.CookieService;
using Backend.DbConnection;
using Backend.regex_validator;
using Backend.TokenService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VolanGo.Generate;
using VolanGo.RequestBodies;

namespace VolanGo.EndPoints
{
    [ApiController]
    [Route("login")]
    public class LoginController : ControllerBase{

        private readonly ApplicationDbContext _context;
        private readonly CaptchaServices _captchaServices;
        public LoginController(ApplicationDbContext context, CaptchaServices captchaServices)
        {
            _context = context;
            _captchaServices = captchaServices;
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginUser user){
            var isCaptchaValid = await _captchaServices.VerifyCaptchaAsync(user.CaptchaToken);
            if(!isCaptchaValid){
                return BadRequest("Invalid CAPTCHA");
            }
            // Da li je dobar email i paswword -> Funkcija za provjeravanja emaila i za provjeravanje passworda
            if(!regex_validator.ProvjeriEmail(user.email) && !regex_validator.ProvjeriLozinku(user.Password)){
                return BadRequest("Username ili password nisu dobro konfigurisani");
            }
            var userA = _context.Users.FirstOrDefault(u => u.Email == user.email);
            if(userA == null || !regex_validator.CompareHashes(user.Password, userA.PasswordHash)){
                return BadRequest("Email ili sifra su netacni");
            }

            var role = _context.UserRoles.FirstOrDefault(r => r.UserId == userA.UserId);
            // Provjeri da li se nalazi u bazi
            // string salt = " ";
            // string PasswordHash = regex_validator.HashPassword(user.Password, out salt);
            // var userA = _context.Users.FirstOrDefault(u => u.Email == user.email && u.PasswordHash == PasswordHash);
            // if(userA == null){
            //     return BadRequest("User ne postoji, registrujte se");
            // }
            string accesToken = TokenService.GenerateAccessToken(user, role);
            string refreshToken = TokenService.GenerateRefreshToken();

            CookieService.SetAuthCookies(HttpContext, accesToken, refreshToken, user.email, role);

            var currentUrl = $"{Request.Scheme}://{Request.Host}{Request.Path}";
            return Ok(new { accessToken = accesToken, refreshToken = refreshToken, roleNumber = role.RoleId, userId = userA.UserId});
        }

    }
}

        

        

      