using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class RegisterUser
    {
        public string Email {get; set;}
        public string UserName {get; set;}
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender {get; set;}
        public string PhoneNumber { get; set; }
        public string Password {get; set;}
        public string DateOfBirth {get; set;}
        public string CaptchaToken {get; set;}
    }
}