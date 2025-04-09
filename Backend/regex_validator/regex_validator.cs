using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Security.Cryptography;
using BCrypt.Net;

namespace Backend.regex_validator
{
    public static class regex_validator
    {
        public static bool ProvjeriEmail(string email)
        {
        // Regularni izraz za email
        string regex = @"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$";
        
        // Provjera da li email odgovara obrascu
        return Regex.IsMatch(email, regex);
        }

      public static bool ProvjeriLozinku(string lozinka)
      {
          // Minimalna dužina lozinke
          if (lozinka.Length < 7)
          {
              return false;
          }
  
          // Regularni izraz za provjeru lozinke
          string regex = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{7,}$";
  
          // Provjera da li lozinka odgovara obrascu
          return Regex.IsMatch(lozinka, regex);
      }
  
      public static bool ProvjeriUsername(string korisnickoIme)
      {
          // Regularni izraz za korisničko ime
          string regex = @"^(?=.*[a-z])(?=.*[0-9])[a-z0-9]{6,}$";
  
          // Provjera da li korisničko ime odgovara obrascu
          return Regex.IsMatch(korisnickoIme, regex);
      }

    public static bool ValidirajBroj(string broj)
    {
        // Regularni izraz sa svim uvjetima
        string pattern = @"^(060\d{7}|06\d{7}|3876\d{7}|38760\d{7})$";

        // Provjera da li broj odgovara pravilima
        return Regex.IsMatch(broj, pattern);
    }

    public static bool CompareHashes(string password, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, storedHash);
    }

    public static string GenerateHash(string password)
    {
        // Generišemo bcrypt hash sa default cost faktorom (npr. 12)
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

      
}   }