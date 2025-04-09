using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class filterRequest
    {
        public string year {get; set;}

        public string color {get; set;}

        public int price {get; set;}

        public string selectedCar {get; set;}

        public string PickUpDate {get; set;}

        public string PickUpTime {get; set;}

        public string DropOffDate {get; set;}

        public string DropOffTime {get; set;}

    }
}