using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models;

public class VehicleTypes
{
    [Key]
    public int VehicleTypeID { get; set; }
    
    public string VehicleTypeName { get; set; }
    public string Description { get; set; }
}