using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class SelectedCarRequest
    {
        public string name {get; set;}

        public string image {get; set;}

        public int pricePerDay {get; set;}

        public string accessToken {get; set;}

        public DateOnly PickUpDate {get; set;}

        public DateOnly DropOffDate {get; set;}
    }
}