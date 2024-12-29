using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using System.Linq;
using System.Threading.Tasks;
using RS1_2024_25.API.Data.Models;

namespace RS1_2024_25.API.Data.Models;
    public class Insurance
    {
        [Key]
        public int InsuranceId { get; set; }

        [ForeignKey("Reservation")]
        public int ReservationId { get; set; }
        public string InsuranceType { get; set; }
        public decimal Cost { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public string Provider { get; set; }

        public string PolicyNumber { get; set; }

        public string TermsAndConditions { get; set; }

        // Navigation property to Reservation (if needed)
        [JsonIgnore]
        public Reservation Reservation { get; set; }

    }

