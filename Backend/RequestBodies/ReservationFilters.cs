using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.RequestBodies
{
    public class ReservationFilters
    {
        public string UserId { get; set; }
        public string ReservationId { get; set; }
        public string VehicleId { get; set; }
        public string LocationId {get; set;}
        public string ReservationDate { get; set; }
    }

}