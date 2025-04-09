using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;

namespace Backend.CookieService
{
    public static class CookieService
    {
        public static void SetAuthCookies(HttpContext httpContext, string accessToken, string refreshToken, string username, UserRole role)
      {
        string cookiePath = (role.RoleId == 2) ? "/admin" : "/user";
        
          httpContext.Response.Cookies.Append("accessToken", accessToken, new CookieOptions
        {
            HttpOnly = true,   // Kolačić je dostupan samo serveru
            Secure = true,     // Samo za HTTPS
            SameSite = SameSiteMode.Strict, // Ograničava kolačiće na iste domene
            Path = cookiePath,
            Expires = DateTime.UtcNow.AddMinutes(30),  // Vreme isteka za access token
            // Ovaj parametar je specifičan za potpisivanje kolačića:
            IsEssential = true // Vrijedi do isteka access token-a
        });

        // Postavljanje refreshToken u cookie
        httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,   // Kolačić je dostupan samo serveru
            Secure = true,     // Samo za HTTPS
            SameSite = SameSiteMode.Strict, 
            Path = cookiePath,// Ograničava kolačiće na iste domene
            Expires = DateTime.UtcNow.AddDays(7), // Vreme isteka za refresh token
            // Ovaj parametar je specifičan za potpisivanje kolačića:
            IsEssential = true  
        });

      }
    }

}