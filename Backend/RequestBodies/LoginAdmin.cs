using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VolanGo.RequestBodies
{
    public class LoginAdmin
    {
        public int AdminId {get; set;}
        public string Password {get; set;}
    }
}