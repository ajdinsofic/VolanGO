using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class Payment
{
    [Key]
    public int PaymentId { get; set; }
    
    [ForeignKey(nameof(Reservation))]
    public int ReservationID { get; set; }
    public Reservation? Reservation { get; set; }
    
    [ForeignKey(nameof(Discount))]
    public int DiscountId { get; set; }
    public Discount? Discount { get; set; }

    public DateTime PaymentDate { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; }
    public string PaymentStatus { get; set; }
}