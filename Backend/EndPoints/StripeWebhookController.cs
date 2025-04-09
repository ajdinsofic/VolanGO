using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DbConnection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;
using Stripe.BillingPortal;
using Stripe.V2;
using Twilio.Rest.Trunking.V1;
using RS1_2024_25.API.Data.Models;
using Backend.Entities;

namespace Backend.EndPoints
{
    [ApiController]
    [Route("api/stripe-webhook")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private const string apiKey = "whsec_a24167dc0ac3064b65b8836e88949cb1bd99f7f2cdfad113eef39efa1ad26b27";
        public StripeWebhookController(ApplicationDbContext db){
            _db = db;
        }
        [HttpPost("webhook")]
        public async Task<IActionResult> StripeWebhook(){
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json,Request.Headers["Stripe-Signature"],apiKey);
                if(stripeEvent.Type == "checkout.session.completed"){
                    var sessionObject = stripeEvent.Data.Object as Stripe.Checkout.Session;
                    if(sessionObject != null && !string.IsNullOrEmpty(sessionObject.Id)){
                        var sessionService = new Stripe.Checkout.SessionService();
                        var session = await sessionService.GetAsync(sessionObject.Id);
                        if(session.Metadata !=null){
                            var userId = int.Parse(session.Metadata["userId"]);
                            var vehicleId = int.Parse(session.Metadata["vehicleId"]);
                            var locationId = int.Parse(session.Metadata["locationId"]);
                            var pickupDate = DateTime.Parse(session.Metadata["pickupDate"]);
                            var dropoffDate = DateTime.Parse(session.Metadata["dropoffDate"]);

                            await SaveReservation(userId, vehicleId, locationId, pickupDate, dropoffDate);
                        }
                    }
                }
                return Ok();
            }
            catch (StripeException e)
            {
               return BadRequest(new {error = e.Message});
            }
        }

        private async Task SaveReservation(int userId, int vehicleId, int locationId, DateTime pickupDate, DateTime dropoffDate)
        {
            var reservation = new Reservation
            {
                user_id = userId,
                reservation_date = DateTime.UtcNow,
            };

            _db.Reservations.Add(reservation);

             var reseDetails = new ReservationDetails{
                reservation_id = reservation.RId,
                vehicle_id = vehicleId,
                location_id = locationId,
                pickup_date = pickupDate,
                dropoff_date = dropoffDate,
            };

            _db.reservationDetails.Add(reseDetails);
            _db.SaveChanges();
        }
    }
}