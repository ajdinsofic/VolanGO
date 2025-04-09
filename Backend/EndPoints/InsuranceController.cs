using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using Backend.DbConnection;

namespace RS1_2024_25.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InsurancesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InsurancesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetInsurances()
        {
            return Ok(_context.Insurances.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetInsuranceById(int id)
        {
            var insurance = _context.Insurances.Find(id);
            if (insurance == null) return NotFound("Insurance not found.");
            return Ok(insurance);
        }

        [HttpPost]
        public IActionResult CreateInsurance([FromBody] Insurance insurance)
        {
            if (insurance == null) return BadRequest("Insurance data is null.");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);  // Return validation errors if model is invalid

            var reservation = _context.Reservations.Find(insurance.ReservationId);
            if (reservation == null) return BadRequest("Invalid ReservationId.");

            _context.Insurances.Add(insurance);
            _context.SaveChanges();
            return Ok(insurance);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateInsurance(int id, [FromBody] Insurance insurance)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);  // Return validation errors if model is invalid


            var dbInsurance = _context.Insurances.Find(id);
            if (dbInsurance == null) return NotFound("Insurance not found.");

            
            dbInsurance.InsuranceType = insurance.InsuranceType ?? dbInsurance.InsuranceType;
            dbInsurance.Cost = insurance.Cost != 0 ? insurance.Cost : dbInsurance.Cost;
            dbInsurance.StartDate = insurance.StartDate != default ? insurance.StartDate : dbInsurance.StartDate;
            dbInsurance.EndDate = insurance.EndDate != default ? insurance.EndDate : dbInsurance.EndDate;
            dbInsurance.Provider = insurance.Provider ?? dbInsurance.Provider;
            dbInsurance.PolicyNumber = insurance.PolicyNumber ?? dbInsurance.PolicyNumber;
            dbInsurance.TermsAndConditions = insurance.TermsAndConditions ?? dbInsurance.TermsAndConditions;

            _context.SaveChanges();
            return Ok(dbInsurance);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteInsurance(int id)
        {
            var insurance = _context.Insurances.Find(id);
            if (insurance == null) return NotFound("Insurance not found.");

            _context.Insurances.Remove(insurance);
            _context.SaveChanges();
            return Ok($"Insurance with ID {id} deleted.");
        }
    }
}
