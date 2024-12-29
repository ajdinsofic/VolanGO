using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RS1_2024_25.API.Data.Models;

namespace VolanGo.Entities;

public class VerificationCode
{
    [Key]
    public int VerificationCodeId { get; set; }
    [Required]
    public string Code { get; set; }
    [Required]
    public DateTime ExpirationTime { get; set; }
    [ForeignKey(nameof(User))]
    public int UserId { get; set; }
    public User? User { get; set; }
}