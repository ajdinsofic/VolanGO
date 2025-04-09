using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models.Auth;

public class Locations
{
    [Key]
    public int LocationId { get; set; }
    
    public string Address { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}