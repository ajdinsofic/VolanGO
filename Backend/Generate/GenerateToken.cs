using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace VolanGo.Generate
{
    public class GenerateToken
    {
        // Tajni ključ za potpisivanje tokena
        public string GenerateJWToken(string userId, string role)
        {
        // Kreiranje informacija o korisniku (claims)
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),  // Sub (Subject) predstavlja korisnički ID
            new Claim(ClaimTypes.Role, role),  // Dodavanje korisničke uloge (ako je potrebno)
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),  // Jedinstveni identifikator tokena
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString())  // Datum izdavanja tokena
        };

        // Kreiranje sigurnosnog ključa za potpisivanje tokena
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWTokenInformation.SecretKey));

        // Definisanje parametara za potpisivanje i validaciju tokena
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        // Postavke za kreiranje JWT tokena
        var token = new JwtSecurityToken(
            issuer: JWTokenInformation.Issuer,
            audience:   JWTokenInformation.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),  // Vreme isteka tokena (npr. 1 sat)
            signingCredentials: creds
        );

        // Vraćanje generisanog JWT tokena kao string
        return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}