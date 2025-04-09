using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;

namespace Backend.dtoEntities
{
    public class Vehicledto() 
    {
        public int VehicleId {get; set;}

        public string Name {get; set;}

        public string Description {get; set;}

        public double PricePerDay {get; set;}

        public string Image {get; set;}

    }
}