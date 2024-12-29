using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RS1_2024_25.API.Data.Models.Auth;

namespace RS1_2024_25.API.Data.Models;

public class Vehicle
{
    [Key]
    public int VehicleId { get; set; }
    
    [ForeignKey(nameof(Locations))]
    public int LocationId { get; set; }
    public Locations? Location { get; set; }
    
    [ForeignKey(nameof(VehicleTypes))]
    public int VehicleTypeId { get; set; }
    public VehicleTypes? VehicleType { get; set; }
    public string VIN { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public int Year { get; set; }
    public string RegistrationNumber { get; set; }
    public string Color { get; set; }
    public string Mileage { get; set; }
    public decimal DailyRentalRate { get; set; }
    [Column(TypeName = "text")]
    public string Description { get; set; }
    public bool Status { get; set; }
}