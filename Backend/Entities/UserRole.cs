using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Entities
{
    public class UserRole
    {

        public int UserId {get; set;}

        public int RoleId {get; set;}

        public DateTime createdat {get; set;}

        public DateTime updatedat {get; set;}
    }
}