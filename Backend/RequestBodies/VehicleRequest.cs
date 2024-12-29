using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class VehicleRequest
    {
        public string selectedCar {get; set;}
        public DateOnly PickUpDate {get; set;}
        public DateOnly DropOffDate {get; set;}
        public string PickUp {get; set;}
        public string DropOff {get; set;}
        public string PickupTime {get; set;}
        public string  DropOffTime {get; set;}
        
    }
}