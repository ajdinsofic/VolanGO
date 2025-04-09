using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models.Auth;
using Stripe.Terminal;
using RS1_2024_25.API.Data;

namespace VolanGo.EndPoints
{
    [ApiController]
    [Route("LocationsController")]
    public class LocationsController : ControllerBase
    {
       private readonly ApplicationDbContext _context;

       public LocationsController(ApplicationDbContext context)
       {
            _context = context;
       }
       [HttpGet("all")]
       public async Task<ActionResult<IEnumerable<Locations>>> GetAllLocations()
       {
            return await _context.Locations.ToListAsync();
       }

       [HttpGet("location-by-id")]
       public async Task<ActionResult<Locations>> GetLocationById(int id)
       {
            var location = await _context.Locations.FindAsync(id);
            if(location == null)
            {
                return NotFound(new { message = "Location not found." });
            }
            return location;
       }
       [HttpGet("GetByName")]
       public async Task<int> getLocByName(string name, CancellationToken cancellationToken=default){
        var l = await _context.Locations.FirstOrDefaultAsync(l=>l.Address.ToLower() == name.ToLower(), cancellationToken);
        return l.LocationId;
       }

       [HttpPost("create")]
        public async Task<ActionResult<Locations>> CreateLocation(Locations location)
        {
            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocationById), new { id = location.LocationId }, location);
        }
        [HttpPut("update-database/{id}")]
        public async Task<IActionResult> UpdateLocation(int id, Locations updatedLocation)
        {
            if (id != updatedLocation.LocationId)
            {
                return BadRequest(new { message = "ID mismatch between URL and object." });
            }
            
            var existingLocation = await _context.Locations.FindAsync(id);
            if (existingLocation == null)
            {
                return NotFound(new { message = "Location not found." });
            }

            existingLocation.Address = updatedLocation.Address;
            existingLocation.City = updatedLocation.City;
            existingLocation.PostalCode = updatedLocation.PostalCode;
            existingLocation.Country = updatedLocation.Country;
            existingLocation.Latitude = updatedLocation.Latitude;
            existingLocation.Longitude = updatedLocation.Longitude;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { message = "An error occurred while updating the location." });
            }
            
            return NoContent();
        }
        [HttpDelete("delete-location/{id}")]
        public async Task<IActionResult> DeleteLocation(int id)
        {
            var location = await _context.Locations.FindAsync(id);
            if(location == null)
            {
                return NotFound(new {message = "Location not found!"});
            }
            _context.Locations.Remove(location);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}