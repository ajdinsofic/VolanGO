using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VolanGo
{
    public class JWTokenInformation
    {
        public const string SecretKey = "moj-sigurni-256bit-kljuc-koji-osigurava-sve"; 
        public const string Issuer = "VolanGO.com";  
        public const string Audience = "Users";
    }
}