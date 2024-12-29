using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class DamageReports
{
    [Key]
    public int DamageReportId { get; set; }
    
    [ForeignKey(nameof(Reservation))]
    public int ReservationId { get; set; }
    public Reservation? Reservation { get; set; }
    
    [ForeignKey(nameof(Vehicle))]
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }
    
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User? Id { get; set; }
    
    public DateTime ReportDate { get; set; }
    public string Description { get; set; }
    public decimal EstimatedRepairCost { get; set; }
    public string Status { get; set; }
}