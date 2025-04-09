using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;
using RS1_2024_25.API.Data.Models.Auth;
using VolanGo.Entities;

namespace Backend.DbConnection
{
    public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    { }

    // Ovde možete definirati sve vaše DbSetove
        public DbSet<User> Users { get; set; }
        public DbSet<CustomerSupportTickets> CustomerSupportTickets { get; set; }
        public DbSet<Discount> Discount { get; set; }
        public DbSet<VerificationCode> VerificationCodes { get; set; }
        public DbSet<Locations> Locations { get; set; }
        public DbSet<LoyaltyPoints> LoyaltyPoints { get; set; }
        
        public DbSet<Payment> Payments { get; set; }
        public DbSet<VehicleTypes> VehicleTypes { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<VehicleImages> VehicleImages { get; set; }
        public DbSet<VehicleMaintenance> VehicleMaintenance { get; set; }
        public DbSet<DamageReports> DamageReports { get; set; }
        public DbSet<UserReviews> UserReviews { get; set; }
        public DbSet<Role> Roles {get; set;}
        public DbSet<UserRole> UserRoles {get; set;}
        public DbSet<saveToCart> saveToCarts {get; set;}

        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Invoice> Invoices {get; set;}
        public DbSet<Insurance> Insurances {get; set;}
        public DbSet<ReservationDetails> reservationDetails {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite primary key configuration
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });  // Composite key


        base.OnModelCreating(modelBuilder);

    }
    // Dodajte ostale entitete po potrebi
}
}