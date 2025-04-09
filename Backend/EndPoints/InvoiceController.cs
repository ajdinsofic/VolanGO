using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using Backend.DbConnection;

namespace RS1_2024_25.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetInvoices()
        {
            return Ok( _context.Invoices.ToList());
        }

        [HttpGet("{id}")]
        public IActionResult GetInvoiceById(int id)
        {
            var invoice = _context.Invoices.Find(id);

            if (invoice == null) {
                return NotFound("Poruka");
            }
           
            return Ok(invoice);
        }

        [HttpPost]
        public IActionResult CreateInvoice([FromBody] Invoice invoice)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);  

                if (invoice == null)
                {
                    return BadRequest("Invoice data is null.");
                }

                var reservation = _context.Reservations.Find(invoice.ReservationId);
                if (reservation == null)
                {
                    return BadRequest("Invalid ReservationId. The specified reservation does not exist.");
                }

                _context.Invoices.Add(invoice);
                _context.SaveChanges();   

                return Ok(invoice);
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    
        [HttpPut("{id}")]
        public IActionResult UpdateInvoice(int id, [FromBody] Invoice invoice)
        {   
            try
                {
                    if (!ModelState.IsValid)
                        return BadRequest(ModelState);  
                        
                    var dbInvoice = _context.Invoices.Find(id);

                    if (dbInvoice == null)
                    {
                        return NotFound($"Invoice with ID {id} not found.");
                    }

                    if (invoice.Amount != 0) dbInvoice.Amount = invoice.Amount;
                    if (invoice.InvoiceDate != default(DateTime)) dbInvoice.InvoiceDate = invoice.InvoiceDate;
                    if (invoice.ReservationId != 0) dbInvoice.ReservationId = invoice.ReservationId;

                    _context.SaveChanges();

                    return Ok(dbInvoice);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteInvoice(int id)
        {
            var invoice =  _context.Invoices.Find(id);
            if (invoice == null)
            {
                return NotFound();
            }

            try {
                _context.Invoices.Remove(invoice);
                _context.SaveChanges();

                return Ok($"Invoice with {id} is deleted");
            } catch (Exception ex) {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
