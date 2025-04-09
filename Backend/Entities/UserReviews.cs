using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class UserReviews
{
    [Key]
    public int ReviewId { get; set; }
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User? Id { get; set; }
    [ForeignKey(nameof(Vehicle))]
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    
    public DateTime ReviewDate { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}