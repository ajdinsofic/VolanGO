using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using RS1_2024_25.API.Data.Models.Auth;

namespace RS1_2024_25.API.Data.Models;

public class Reservation
{
    [Key]
    public int RId { get; set; }

    [ForeignKey(nameof(user))]
    [Required]
    public int user_id { get; set; }
    public User? user { get; set; }

    [Required]
    public DateTime reservation_date { get; set; }

    // Dodavanje kolone za total_price
    [Required]
    [Column(TypeName = "decimal(10, 2)")] // Određivanje tačnosti za cenu
    public decimal total_price { get; set; }

    // Ako koristiš rezervacije koje sadrže više vozila, možeš koristiti povezane detalje u drugoj tabeli, 
    // pa ne moraš direktno čuvati VehicleId i LocationId ovde.

    // [ForeignKey(nameof(Vehicle))]
    // [Required]
    // public int VehicleID { get; set; }
    // public Vehicle? Vehicle { get; set; }

    // [ForeignKey(nameof(Locations))]
    // [Required]
    // public int LocationId { get; set; }
    // public Locations? Locations { get; set; }
}
