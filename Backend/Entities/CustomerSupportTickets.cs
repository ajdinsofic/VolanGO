using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RS1_2024_25.API.Data.Models;

public class CustomerSupportTickets
{
    [Key]
    public int TickedId { get; set; }
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User? Id { get; set; }
    
    public string Subject { get; set; }
    public string Message { get; set; }
    public string Email { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
}