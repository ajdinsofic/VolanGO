using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class VehicleImages
{
    [Key]
    public int VehicleImageId { get; set; }
    
    [ForeignKey(nameof(Vehicle))]
    public int VehicleId { get; set; } 
    public Vehicle? Vehicle { get; set; }
    public byte[] Image {get; set;}
    public string Desciption { get; set; }
    public bool IsPrimary { get; set; } 
}