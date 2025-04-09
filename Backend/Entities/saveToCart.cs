using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;

namespace Backend.Entities
{
    public class saveToCart
    {
        [Key]
        public int cartid {get; set;}

        [ForeignKey(nameof(User))]
        public int userid {get; set;}

        [ForeignKey(nameof(Vehicle))]
        public int vehicleId {get; set;}

        [ForeignKey(nameof(Locations))]
        public int locationId {get; set;}

        public string name {get; set;}

        public byte[] image {get; set;}

        public int priceperday {get; set;}

        public DateOnly pickupdate {get; set;}

        public DateOnly dropoffdate {get; set;}
    }
}