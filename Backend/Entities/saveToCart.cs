using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Data.Models;

namespace Backend.Entities
{
    public class saveToCart
    {
        [Key]
        public int cartid {get; set;}

        [ForeignKey(nameof(User))]
        public int userid {get; set;}

        public string name {get; set;}

        public byte[] image {get; set;}

        public int priceperday {get; set;}

        public DateOnly pickupdate {get; set;}

        public DateOnly dropoffdate {get; set;}
    }
}