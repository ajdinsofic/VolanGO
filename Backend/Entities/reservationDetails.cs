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
   public class ReservationDetails
{
    [Key]
    public int id { get; set; }

    [ForeignKey(nameof(reservation))]
    public int reservation_id { get; set; }
    public Reservation reservation { get; set; }

    [ForeignKey(nameof(vehicle))]
    public int vehicle_id { get; set; }
    public Vehicle vehicle { get; set; }

    [ForeignKey(nameof(location))]
    public int location_id { get; set; }
    public Locations location { get; set; }

    public int number_of_days {get; set;}
    public DateTime pickup_date { get; set; }
    public DateTime dropoff_date { get; set; }

    // Dodavanje decimalne vrednosti za cenu (pickup_price) sa preciznošću (10, 2)
    [Column(TypeName = "decimal(10, 2)")]
    public decimal price { get; set; }
}

}