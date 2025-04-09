// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using Backend.DbConnection;
// using Microsoft.AspNetCore.Http.HttpResults;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Http;
// using Microsoft.EntityFrameworkCore;
// using RS1_2024_25.API.Data.Models.Auth;
// using Stripe.Terminal;
// using RS1_2024_25.API.Data;
// using RS1_2024_25.API.Data.Models;
// using Backend.RequestBodies;

// namespace VolanGo.EndPoints
// {
//     [ApiController]
//     public class ReservationsController : ControllerBase
//     {
//        private readonly ApplicationDbContext _context;

//        public ReservationsController (ApplicationDbContext context)
//        {
//             _context = context;
//        }
//        [HttpGet("all")]
//        public async Task<ActionResult<IEnumerable<Reservation>>> GetAllLocations()
//        {
//             return await _context.Reservations.ToListAsync();
//        }

//        [HttpGet("location-by-id")]
//        public async Task<ActionResult<Reservation>> GetLocationById(int id)
//        {
//             var reservation = await _context.Reservations.FindAsync(id);
//             if(reservation == null)
//             {
//                 return NotFound(new { message = "Location not found." });
//             }
//             return reservation;
//        }

//        [HttpPost("create")]
//        public async Task<IActionResult> CreateReservation([FromBody] Reservation reservation)
//        {
//            if (reservation == null)
//            {
//                return BadRequest(new { message = "Reservation data is required." });
//            }
       
//            try
//            {
//                // Check if ReservationId is provided, don't allow editing
//                reservation.ReservationDate = reservation.ReservationDate.ToUniversalTime();
//                reservation.PickupDate = reservation.PickupDate.ToUniversalTime();
//                reservation.DropoffDate = reservation.DropoffDate.ToUniversalTime();
       
//                _context.Reservations.Add(reservation);
//                await _context.SaveChangesAsync();
       
//                return CreatedAtAction(nameof(GetLocationById), new { id = reservation.ReservationId }, reservation);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "An error occurred while creating the reservation.", details = ex.Message });
//            }
//        }



//         [HttpPut("update-reservation/{id}")]
//         public async Task<IActionResult> UpdateReservation(int id, Reservation updatedReservation)
//         {
//             // Provjerite da li se ID u URL-u poklapa sa ID-jem u objektu
//             if (id != updatedReservation.ReservationId)
//             {
//                 return BadRequest(new { message = "ID mismatch between URL and object." });
//             }
        
//             // Pronađi postojeću rezervaciju u bazi
//             var existingReservation = await _context.Reservations.FindAsync(id);
//             if (existingReservation == null)
//             {
//                 return NotFound(new { message = "Reservation not found." });
//             }
        
//             // Ažuriraj podatke o rezervaciji
//             existingReservation.UserId = updatedReservation.UserId;
//             existingReservation.VehicleID = updatedReservation.VehicleID;
//             existingReservation.LocationId = updatedReservation.LocationId;
        
//             // Ensure all dates are in UTC
//             existingReservation.ReservationDate = updatedReservation.ReservationDate.ToUniversalTime();
//             existingReservation.PickupDate = updatedReservation.PickupDate.ToUniversalTime();
//             existingReservation.DropoffDate = updatedReservation.DropoffDate.ToUniversalTime();
        
//             try
//             {
//                 // Spremi promene u bazu
//                 await _context.SaveChangesAsync();
//             }
//             catch (DbUpdateConcurrencyException)
//             {
//                 return StatusCode(500, new { message = "An error occurred while updating the reservation." });
//             }
        
//             return NoContent();
//         }


//         [HttpDelete("delete-location/{id}")]
//         public async Task<IActionResult> DeleteLocation(int id)
//         {
//             var reservation = await _context.Reservations.FindAsync(id);
//             if(reservation == null)
//             {
//                 return NotFound(new {message = "Location not found!"});
//             }
//             _context.Reservations.Remove(reservation);
//             await _context.SaveChangesAsync();
//             return NoContent();
//         }

//         [HttpGet("getSortedData")]
//         public async Task<ActionResult<IEnumerable<Reservation>>> GetSortedReservations(string sortBy)
//         {
//             var query = _context.Reservations.AsQueryable();
        
//             // Sortiraj prema parametru sortBy
//             switch (sortBy.ToLower())
//             {
//                 case "reservationid":
//                     query = query.OrderBy(r => r.ReservationId);
//                     break;
//                 case "userid":
//                     query = query.OrderBy(r => r.UserId);
//                     break;
//                 case "vehicleid":
//                     query = query.OrderBy(r => r.VehicleID);
//                     break;
//                 case "locationid":
//                     query = query.OrderBy(r => r.LocationId);
//                     break;
//                 case "reservationdate":
//                     query = query.OrderBy(r => r.ReservationDate);
//                     break;
//                 case "pickupdate":
//                     query = query.OrderBy(r => r.PickupDate);
//                     break;
//                 case "dropoffdate":
//                     query = query.OrderBy(r => r.DropoffDate);
//                     break;
//                 default:
//                     query = query.OrderBy(r => r.ReservationId); // Default sort
//                     break;
//             }
        
//             return query.ToList();
//         }

//         [HttpPost("get/filteredReservations")]
//         public IActionResult GetFilteredReservations([FromBody] ReservationFilters filters)
//         {
//             try
//             {
//                 var filteredReservations = GetFilterReservations(filters); // Direktno pozivanje privatne metode
//                 return Ok(filteredReservations);
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, $"Internal server error: {ex.Message}");
//             }
//         }
    
//         private List<Reservation> GetFilterReservations(ReservationFilters filters)
//         {
//             var query = _context.Reservations.AsQueryable();
    
//             // Filtriranje prema UserId
//             if (!string.IsNullOrEmpty(filters.UserId))
//             {
//                 query = query.Where(r => r.UserId.ToString().Contains(filters.UserId));
//             }
    
//             // Filtriranje prema ReservationId
//             if (!string.IsNullOrEmpty(filters.ReservationId))
//             {
//                 query = query.Where(r => r.ReservationId.ToString().Contains(filters.ReservationId));
//             }
    
//             // Filtriranje prema VehicleId
//             if (!string.IsNullOrEmpty(filters.VehicleId))
//             {
//                 query = query.Where(r => r.VehicleID.ToString().Contains(filters.VehicleId));
//             }
    
//             if (!string.IsNullOrEmpty(filters.LocationId))
//             {
//                 query = query.Where(r => r.LocationId.ToString().Contains(filters.LocationId)); // Assuming LocationId is a string
//             }

//             // Filtriranje prema ReservationDate (ako je datum unesen)
//             if (!string.IsNullOrEmpty(filters.ReservationDate))
//             {
//                 DateTime reservationDate;
//                 if (DateTime.TryParse(filters.ReservationDate, out reservationDate))
//                 {
//                     // Ensure the DateTime is UTC
//                     if (reservationDate.Kind != DateTimeKind.Utc)
//                     {
//                         reservationDate = DateTime.SpecifyKind(reservationDate, DateTimeKind.Utc);
//                     }
                    
//                     // Apply the filter
//                     query = query.Where(r => r.ReservationDate.Date == reservationDate.Date);  // Filtrira po tačnom datumu
//                 }
//             }
    
//             // Vraćanje filtriranih podataka
//             return query.ToList();
//         }

//         [HttpGet("users/check/{userId}")]
//         public async Task<IActionResult> CheckUserId(string userId)
//         {
//             var userExists = await _context.Users
//                 .AnyAsync(u => u.UserId.ToString() == userId);

//             if (userExists)
//             {
//                 return Ok(true);  // Return 200 OK with 'true' if user exists
//             }
//             else
//             {
//                 return NotFound("User not found with this ID");  // Return 404 if user does not exist
//             }
//         }

//         // Check if Vehicle exists by vehicleId
//         [HttpGet("vehicles/check/{vehicleId}")]
//         public async Task<IActionResult> CheckVehicleId(string vehicleId)
//         {
//             var vehicleExists = await _context.Vehicles
//                 .AnyAsync(v => v.VehicleId.ToString() == vehicleId);

//             if (vehicleExists)
//             {
//                 return Ok(true);  // Return 200 OK with 'true' if vehicle exists
//             }
//             else
//             {
//                 return NotFound("Vehicle not found with this ID");  // Return 404 if vehicle does not exist
//             }
//         }

//         // Check if Location exists by locationId
//         [HttpGet("locations/check/{locationId}")]
//         public async Task<IActionResult> CheckLocationId(string locationId)
//         {
//             var locationExists = await _context.Locations
//                 .AnyAsync(l => l.LocationId.ToString() == locationId);

//             if (locationExists)
//             {
//                 return Ok(true);  // Return 200 OK with 'true' if location exists
//             }
//             else
//             {
//                 return NotFound("Location not found with this ID");  // Return 404 if location does not exist
//             }
//         }

//     }
// }