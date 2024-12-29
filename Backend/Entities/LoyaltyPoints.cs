using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class LoyaltyPoints
{
    [Key]
    public int LoyaltyPointsId { get; set; }
    
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User? Id { get; set; }
    
    public int Points { get; set; }
    public DateTime LastUpdated { get; set; }
}