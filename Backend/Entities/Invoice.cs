using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RS1_2024_25.API.Data.Models;

    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        [ForeignKey("ReservationId")]
        [Range(1, int.MaxValue, ErrorMessage = "Reservation ID must be a valid number.")]
        public int ReservationId { get; set; }
        [JsonIgnore]
        public Reservation? Reservation { get; set; }

        [Required(ErrorMessage = "Invoice Date is required.")]
        public DateTime InvoiceDate { get; set; }

        [Required(ErrorMessage = "Amount is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than or equal to 0.")]
        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Payment Method is required.")]
        [MinLength(3, ErrorMessage = "Payment Method must be at least 3 characters long.")]
        public string PaymentMethod { get; set; }
        
        [Required(ErrorMessage = "Status is required.")]
        [MinLength(3, ErrorMessage = "Status must be at least 3 characters long.")]
        public string Status { get; set; }

    }

