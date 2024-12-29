using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Cors;
using RS1_2024_25.API.Data.Models;
using Microsoft.EntityFrameworkCore;
using VolanGo.RequestBodies;
using VolanGo.Generate;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.regex_validator;
using Backend.DbConnection;
using Backend.RequestBodies;
using Backend.Entities;

namespace VolanGo.EndPoints
{

    [ApiController]
    [Route("register")]
    public class RegisterController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly CaptchaServices _captchaServices;

        public RegisterController(ApplicationDbContext context, CaptchaServices captchaServices)
        {
            _context = context;
            _captchaServices = captchaServices;
        }

        /// REGISTRACIJA ZA ADMINA
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterUser user)
        {
            var isCaptchaValid = await _captchaServices.VerifyCaptchaAsync(user.CaptchaToken);
            if(!isCaptchaValid){
                return BadRequest("Invalid CAPTCHA");
            }
            var unosniUser = new User();
            var novaRola = new UserRole();
        
            // Provjerite da li je korisničko ime validno i da li već postoji u bazi
            var userA = _context.Users.FirstOrDefault(u => u.Username == user.UserName);
            if (!regex_validator.ProvjeriUsername(user.UserName) || userA != null)
            {
                return BadRequest("Username nije validan ili vec postoji");
            }
        
            // Provjera emaila i lozinke
            if (regex_validator.ProvjeriEmail(user.Email) && regex_validator.ProvjeriLozinku(user.Password))
            {
                unosniUser.PasswordHash = regex_validator.GenerateHash(user.Password);
            }
            else
            {
                return BadRequest("Email ili password nisu dobro konfigurisani");
            }
        
            // Provjera da li korisnik sa tim emailom već postoji
            var UserA = _context.Users.FirstOrDefault(u => u.Email == user.Email);
            if (UserA != null)
            {
                return BadRequest("User sa ovim emailom vec postoji, logirajte se");
            }
        
            // Provjera formata broja telefona
            if (!regex_validator.ValidirajBroj(user.PhoneNumber))
            {
                return BadRequest("Format broja ne postoji");
            }
        
            // Provjera da li je izabran gender
            if (user.Gender == null)
            {
                return BadRequest("Nije izabran gender");
            }
        
            // Dodavanje korisnika
            unosniUser.Email = user.Email;
            unosniUser.Username = user.UserName;
            unosniUser.FirstName = user.FirstName;
            unosniUser.LastName = user.LastName;
            unosniUser.Gender = user.Gender;
            unosniUser.PhoneNumber = user.PhoneNumber;
            unosniUser.CreatedAt = DateTime.UtcNow;
        
            // Koristimo transakciju kako bismo osigurali da su oba unosa (korisnik i uloga) uspješna
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Dodajte korisnika u tabelu Users
                    _context.Users.Add(unosniUser);
                    await _context.SaveChangesAsync();
        
                    // Nakon što je korisnik dodan, postavite UserId
                    novaRola.UserId = unosniUser.UserId;
                    novaRola.RoleId = 1;  // Za sada samo kao korisnik (RoleId = 1)
        
                    // Dodajte ulogu korisniku u tabelu UserRoles
                    _context.UserRoles.Add(novaRola);
                    await _context.SaveChangesAsync();
        
                    // Commit transakcije
                    await transaction.CommitAsync();
        
                    return Ok(new { user = user });
                }
                catch (Exception ex)
                {
                    // Ako dođe do greške, vratite promjene
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"Greška pri registraciji korisnika: {ex.Message}");
                }
            }
        }
        
    }
  }
  
