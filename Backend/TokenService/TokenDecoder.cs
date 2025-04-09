using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.RequestBodies;
using Microsoft.IdentityModel.Tokens;

namespace Backend.TokenService
{
    public class TokenDecoder
    {
        private const string SecretKey = "my-access-token-for-everything-that-can-be";
        public static string DecodeToken (string token){
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(SecretKey);
            
            try{
                var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }, out SecurityToken validatedToken);
                
                return principal.Claims.FirstOrDefault(c=>c.Type == ClaimTypes.NameIdentifier)?.Value;
            }
            catch (Exception e){
                Console.WriteLine($"token validation failed {e.Message}");
                return null;
            }
        }
    }
}