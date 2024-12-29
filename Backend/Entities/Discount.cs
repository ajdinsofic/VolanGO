using System.ComponentModel.DataAnnotations;

namespace RS1_2024_25.API.Data.Models;

public class Discount
{
    [Key]
    public int DiscountId { get; set; }
    
    public string DiscountCode { get; set; }
    public string Description { get; set; }
    public decimal DiscountPercentage { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidUntil { get; set; }
}