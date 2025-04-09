using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VolanGo.EndPoints
{
    public class LoginUser
    {
        public string email {get; set;}

        public string Password {get; set;}

        public string CaptchaToken {get; set;}
        public int Id { get; set; }
    }
}