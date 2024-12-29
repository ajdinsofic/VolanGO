using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Backend.dtoEntities;
using Backend.RequestBodies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;

namespace Backend.EndPoints
{
    [ApiController]
    public class ImageController : ControllerBase
    {

        private readonly ApplicationDbContext _context;

        public ImageController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPut("/update/Images")]
        public async Task<IActionResult> UpdateImage(int vehicleImageId, IFormFile imageFile)
        {
            // Pronađi sliku sa datim ID-jem
            var vehicleImage = await _context.VehicleImages.FindAsync(vehicleImageId);
    
            if (vehicleImage == null)
            {
                return NotFound("Vehicle image not found.");
            }
    
            // Provera da li je fajl validan
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }
    
            // Pretvaranje nove slike u byte[]
            using (var memoryStream = new MemoryStream())
            {
                await imageFile.CopyToAsync(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();  // Nova slika u binarnom formatu (byte[])
    
                // Ažuriranje slike u bazi
                vehicleImage.Image = imageBytes;  // Zamenjujemo staru sliku novom
                _context.VehicleImages.Update(vehicleImage);
                await _context.SaveChangesAsync();  // Spremanje promena u bazi
            }
    
            return Ok(new { message = "Image updated successfully" });
        }

        [HttpGet("get/vehicles")]
        public async Task<IActionResult> GetVehicles([FromQuery] VehicleRequest vehicleReq, int page = 1, int pageSize = 10)
        {
            // Dohvatanje svih vozila sa odabranim markama
            var vehicles = _context.Vehicles
                                   .Where(v => v.Make == vehicleReq.selectedCar)
                                   .ToList();

             var totalPages = (int)Math.Ceiling((decimal)vehicles.Count() / pageSize);

            var vehiclesForPage = vehicles
                .OrderBy(v => v.VehicleId)  // Dodavanje OrderBy za predvidljive rezultate
                .Skip((page - 1) * pageSize)  // Preskakanje vozila sa prethodnih stranica
                .Take(pageSize)               // Uzimanje samo vozila za trenutnu stranicu
                .ToList();
        
            // Kreiranje DTO objekta sa svim potrebnim podacima (uključujući slike)
            var vehicledtoArray = vehiclesForPage.Select(vehicle => new Vehicledto
            {
                VehicleId = vehicle.VehicleId,
                Name = $"{vehicle.Make} {vehicle.Model}",
                PricePerDay = (double)vehicle.DailyRentalRate,
                Image = GetVehicleImage(vehicle.VehicleId)
            }).ToArray();
        
            return Ok(new { allCars = vehicledtoArray, totalPages });
        }

        [HttpGet("get/locations")]

        public async Task<IActionResult> GetLocations(){
            
            var locations = _context.Locations.ToArray();
            var ListaImena = new List<string>();
            foreach (var item in locations)
            {
                ListaImena.Add(item.Address);
            }
            return Ok(new {locations = ListaImena});
        }


        [HttpGet("get/filter")]
        [EnableRateLimiting("fixed")]
        
        public async Task<IActionResult> GetFilters([FromQuery] filterRequest filter, int page = 1, int pageSize = 3)
        {
            var query = _context.Vehicles.AsQueryable();
        
            // Filtriranje na osnovu parametara
            if (filter.price > 0)
                query = query.Where(v => v.DailyRentalRate <= filter.price);
        
            if (!string.IsNullOrEmpty(filter.color))
                query = query.Where(v => v.Color == filter.color);
        
            if (!string.IsNullOrEmpty(filter.year))
                query = query.Where(v => v.Year == int.Parse(filter.year));
        
            if (!string.IsNullOrEmpty(filter.selectedCar))
                query = query.Where(v => v.Make == filter.selectedCar);
        
            // Izračunavanje ukupnog broja vozila nakon filtriranja
            var totalVehicles = query.Count();
        
            // Izračunavanje ukupnog broja stranica
            var totalPages = (int)Math.Ceiling((decimal)totalVehicles / pageSize);
        
            // Paginacija - dohvat vozila za trenutnu stranicu
            var vehiclesForPage = query
                .OrderBy(v => v.VehicleId)  // Dodavanje OrderBy za predvidljive rezultate
                .Skip((page - 1) * pageSize)  // Preskakanje vozila sa prethodnih stranica
                .Take(pageSize)               // Uzimanje samo vozila za trenutnu stranicu
                .ToList();
        
            // Kreiranje DTO objekata
            var vehicleDtos = vehiclesForPage.Select(vehicle => new Vehicledto
            {
                VehicleId = vehicle.VehicleId,
                Name = $"{vehicle.Make} {vehicle.Model}",
                Description = " ", // Ovdje možete dodati opis vozila
                PricePerDay = (double)vehicle.DailyRentalRate,
                Image = GetVehicleImage(vehicle.VehicleId) // Pozivanje metode van query-a
            }).ToList();
        
            // Vraćanje paginiranog odgovora sa ukupnim brojem stranica
            return Ok(new
            {
                PaginatedResponse = vehicleDtos,  // Lista vozila za trenutnu stranicu
                TotalPages = totalPages           // Ukupan broj stranica
            });
        }

        
        private string GetVehicleImage(int vehicleId)
        {
            var image = _context.VehicleImages.FirstOrDefault(i => i.VehicleId == vehicleId);
            return image != null ? Convert.ToBase64String(image.Image) : string.Empty;
        }

        [HttpGet("get/vehiclesInfo")]
        public async Task<IActionResult> GetVehicleInfo([FromQuery] string name)
        {
            var vehicleInformation = _context.Vehicles
                .Where(v => (v.Make + " " + v.Model) == name)
                .FirstOrDefault(); // Assuming you want the first match
            
            if (vehicleInformation == null)
            {
                return NotFound();
            }
        
            return Ok(new { vehicleInfo = vehicleInformation });
        }

        [HttpGet("get/vehiclePage")]
        public async Task<IActionResult> GetPages([FromQuery] filterRequest filter, int page = 1, int pageSize = 3)
        {
            // Kreiranje upita za vozila
            var query = _context.Vehicles.AsQueryable();
        
            // Primena filtriranja na osnovu parametara
            if (filter.price > 0)
                query = query.Where(v => v.DailyRentalRate <= filter.price);
        
            if (!string.IsNullOrEmpty(filter.color))
                query = query.Where(v => v.Color == filter.color);
        
            if (!string.IsNullOrEmpty(filter.year))
                query = query.Where(v => v.Year == int.Parse(filter.year));
        
            if (!string.IsNullOrEmpty(filter.selectedCar))
                query = query.Where(v => v.Make == filter.selectedCar);
        
            // Izračunavanje ukupnog broja vozila u bazi
            var totalVehicles = query.ToList().Count();
        
            // Izračunavanje ukupnog broja stranica
            var totalPages = (int)Math.Ceiling((decimal)totalVehicles / pageSize);
        
            // Paginacija - uzimanje vozila za trenutnu stranicu
            var vehiclesForPage = await query
                .OrderBy(v => v.VehicleId)  // Dodavanje OrderBy za predvidljive rezultate
                .Skip((page - 1) * pageSize)  // Preskakanje vozila sa prethodnih stranica
                .Take(pageSize)               // Uzimanje vozila za trenutnu stranicu
                .ToListAsync();
        
            // Kreiranje DTO objekata sa relevantnim podacima
            var vehicleDtos = vehiclesForPage.Select(vehicle => new Vehicledto
            {
                VehicleId = vehicle.VehicleId,
                Name = $"{vehicle.Make} {vehicle.Model}",
                Description = " ", // Ovdje možete dodati stvarne opise ako su dostupni
                PricePerDay = (double)vehicle.DailyRentalRate,
                Image = GetVehicleImage(vehicle.VehicleId) // Pozivanje metode van LINQ upita
            }).ToList();
        
            // Vraćanje paginiranog odgovora sa ukupnim brojem stranica
            return Ok(new
            {
                PaginatedResponse = vehicleDtos,  // Lista vozila za trenutnu stranicu
                TotalPages = totalPages           // Ukupan broj stranica
            });
        }




        //dodao 
        [HttpGet("get/vehicleImages")]
        public async Task<IActionResult> GetVehicleImages([FromQuery] int vehicleId)
        {
            var images = _context.VehicleImages
                                            .Where(img => img.VehicleId == vehicleId)
                                            .Select(img => Convert.ToBase64String(img.Image))
                                            .ToList();

            if (images == null || !images.Any())
            {
                return NotFound("No images found for this vehicle.");
            }

            return Ok(new { images });
            }
        }
}