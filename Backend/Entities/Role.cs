using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Entities
{
    public class Role
    {
        [Key]
        public int id {get; set;}

        public string name {get; set;}

        public DateTime createdAt {get; set;}

        public DateTime updatedAt {get; set;}
    }
}