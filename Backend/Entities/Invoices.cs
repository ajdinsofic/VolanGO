using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Data.Models;

namespace Backend.Entities
{
    public class Invoices
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        [ForeignKey(nameof(Reservation))]
        public Reservation? Reservation{ get; set; }
        public DateTime InvoiceDate {get; set; }    
        public decimal Amount{ get; set; }
        public string PaymentMethod{get; set; }
        public string Status {get; set; }
    }
}