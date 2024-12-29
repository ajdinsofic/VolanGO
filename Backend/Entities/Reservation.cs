using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using RS1_2024_25.API.Data.Models.Auth;

namespace RS1_2024_25.API.Data.Models;

public class Reservation
{
    [Key]
    public int ReservationId { get; set; }
    
    [ForeignKey(nameof(User))]
    [Required]
    public int UserId { get; set; }
    //public User? Id { get; set; }
    
    [ForeignKey(nameof(Vehicle))]
    [Required]
    public int VehicleID { get; set; }
    //public Vehicle? Vehicle { get; set; }
    
    [ForeignKey(nameof(Locations))]
    [Required]
    public int LocationId { get; set; }
    //public Locations? Locations { get; set; }
    
    [Required]
    public DateTime ReservationDate { get; set; }   
    [Required]
    public DateTime PickupDate { get; set; }
    [Required]
    public DateTime DropoffDate { get; set; }
     // Navigation property for the Invoice
    public Invoice Invoice { get; set; }
}