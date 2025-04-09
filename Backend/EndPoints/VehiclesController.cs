using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RS1_2024_25.API.Data.Models;

namespace Backend.EndPoints
{
    [ApiController]
    [Route("Vehicles")]
    public class VehiclesController: ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public VehiclesController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAllVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }
    }
}