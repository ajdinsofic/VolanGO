using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class VehicleMaintenance
{
    [Key]
    public int MaintenanceId { get; set; }
    
    [ForeignKey(nameof(Vehicle))]
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    
    [ForeignKey(nameof(User))]
    public int UserID { get; set; }
    public User? Id { get; set; }
    
    public DateTime MaintenanceDate { get; set; }
    public string Description { get; set; }
    public decimal Cost { get; set; }
    public bool Status { get; set; }
    public DateTime CreatedAt { get; set; }
}