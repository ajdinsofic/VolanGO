using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Entities;
using Microsoft.IdentityModel.Tokens;
using VolanGo.EndPoints;

namespace Backend.TokenService
{
    public static class TokenService
    {
        private const string SecretKey = "my-access-token-for-everything-that-can-be"; 

      public static string GenerateAccessToken(LoginUser user, UserRole role)
      {
        string roleValue = (role.RoleId == 2) ? "admin" : "user";
          var claims = new List<Claim>
          {
              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
              new Claim(ClaimTypes.Email, user.email),
              new Claim(ClaimTypes.Role, roleValue)
          };
        // Provjera je li korisnik admin ili obični korisnik
  
          var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
          var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
  
          var token = new JwtSecurityToken(
              issuer: "VolanGo",
              audience: "VolanGo.com",
              claims: claims,
              expires: DateTime.Now.AddMinutes(60), // Access token vrijedi sat
              signingCredentials: credentials
          );
  
          return new JwtSecurityTokenHandler().WriteToken(token);
      }
  
      // Generiraj Refresh Token
      public static string GenerateRefreshToken()
      {
          var randomBytes = new byte[32]; // 32 bajta za refresh token
          using (var rng = new System.Security.Cryptography.RNGCryptoServiceProvider())
          {
              rng.GetBytes(randomBytes);
          }
          return Convert.ToBase64String(randomBytes);
      }
    }
}