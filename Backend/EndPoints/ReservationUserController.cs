using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace VolanGO.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservationsUserController(ApplicationDbContext db) : ControllerBase
    {
        // GET api/reservations/user
        [HttpGet("getUserReservations/{userId}")]
        public async Task<IActionResult> GetUserReservations(int userId, CancellationToken cancellationToken)
        {
            if(userId == 0) { return NotFound();}
            var reservations = await db.Reservations.Where(r => r.user_id == userId).ToListAsync(cancellationToken);
            return Ok(reservations);

        }

        [HttpGet("getReservationDetails/{reservationId}")]
        public async Task<IActionResult> getReservationDetails(int reservationId, CancellationToken cancellationToken)
        {
            if (reservationId == 0) { return NotFound(); }

            // Učitavanje podataka iz baze
            var reservationD = await db.reservationDetails
                .Include(r => r.vehicle)  // Učitaj vozilo povezano sa rezervacijom
                .Where(r => r.reservation_id == reservationId)
                .ToListAsync(cancellationToken);

            // Provera da li postoji podatak o rezervaciji
            if (reservationD == null || reservationD.Count == 0)
            {
               return NotFound();
            }

            // Mapiranje podataka na DTO objekat
            var reservationDetails = reservationD.Select(r => new ReservationDetailsDTO
            {
               model =  r.vehicle.Make + " " + r.vehicle.Model,
               pickupLocation = r.pickup_date,  // Pretpostavljamo da je pickupLocation tip DateTime
               dropoffLocation = r.dropoff_date,  // Pretpostavljamo da je dropoffLocation tip DateTime
               numberOfDays = r.number_of_days,  // Broj dana između pickup i dropoff
               pricePerDay = (int)r.price,// Pretpostavljamo da postoji cena po danu
            }).ToList();

            return Ok(reservationDetails);
        }

        // POST api/reservations/cancel/{reservationId}
        [HttpDelete("deleteReservation/{reservationId}")]
        public async Task<IActionResult> deleteReservation(int reservationId, CancellationToken cancellationToken)
        {
            if(reservationId == 0) {return NotFound();}
           var reservation = await db.Reservations.FindAsync(reservationId);
           db.Reservations.Remove(reservation);
           await db.SaveChangesAsync(cancellationToken);
           return Ok();
        }
    }

    public class ReservationDetailsDTO{

        public string model {get; set;}
        public DateTime pickupLocation {get; set;}
        public DateTime dropoffLocation {get; set;}
        public int numberOfDays {get; set;}
        public int pricePerDay {get; set;}
    
    }
}
