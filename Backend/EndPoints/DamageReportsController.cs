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
using RS1_2024_25.API.Data.Models;
using Microsoft.EntityFrameworkCore.Query;
namespace Backend.EndPoints
{
    [ApiController]
    [Route("DamageReports")]
    public class DamageReportsController:ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public DamageReportsController(ApplicationDbContext context)
        {
            _context=context;
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<DamageReports>>> GetAllDamageReports()
        {
            return await _context.DamageReports
                    .Include(dr => dr.Reservation)
                    .Include(dr => dr.Vehicle)
                    .Include(dr => dr.Id)
                    .ToListAsync();
        }
        [HttpGet("damage-report-by-id")]
        public async Task<ActionResult<DamageReports>> GetDamageReportById(int id)
        {
            var dmgRep = await _context.DamageReports.FindAsync(id);
            if(dmgRep == null)
            {
                return NotFound(new { message = "Damage report not found." });
            }
            return dmgRep;
        }
        [HttpPost("create")]
        public async Task<ActionResult<DamageReports>> CreateDamageReport(DamageReports dmgRep)
        {
            _context.DamageReports.Add(dmgRep);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDamageReportById), new { id = dmgRep.DamageReportId }, dmgRep);
        }
        [HttpPut("update-database/{id}")]
        public async Task<IActionResult> UpdateDamageReport(int id, DamageReports dmgRep)
        {
            if (id != dmgRep.DamageReportId)
            {
                return BadRequest(new { message = "ID mismatch between URL and object." });
            }
            
            var existingDamageReport = await _context.DamageReports.FindAsync(id);
            if (existingDamageReport == null)
            {
                return NotFound(new { message = "Damage report not found." });
            }

            existingDamageReport.ReservationId = dmgRep.ReservationId;
            existingDamageReport.VehicleId = dmgRep.VehicleId;
            existingDamageReport.UserId = dmgRep.UserId;
            existingDamageReport.ReportDate = dmgRep.ReportDate;
            existingDamageReport.Description = dmgRep.Description;
            existingDamageReport.EstimatedRepairCost = dmgRep.EstimatedRepairCost;
            existingDamageReport.Status = dmgRep.Status;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { message = "An error occurred while updating the damage report." });
            }
            
            return NoContent();
        }
        [HttpDelete("delete-damage-report/{id}")]
        public async Task<IActionResult> DeleteDamageReport(int id)
        {
            var dmgRep = await _context.DamageReports.FindAsync(id);
            if(dmgRep == null)
            {
                return NotFound(new {message = "Damage report not found!"});
            }
            _context.DamageReports.Remove(dmgRep);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}