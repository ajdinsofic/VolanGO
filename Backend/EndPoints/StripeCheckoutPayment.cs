using Backend.DbConnection;
using Backend.Entities;
using Microsoft.AspNetCore.Mvc;
using RS1_2024_25.API.Data.Models;
using Stripe.Checkout;
using System.Collections.Generic;

namespace VolanGo.Controllers
{
    [ApiController]
    [Route("api/stripe")]
    public class StripeCheckoutController(ApplicationDbContext db) : ControllerBase
    {
        [HttpPost("create-checkout-session")]
        public ActionResult CreateCheckoutSession([FromBody] CheckoutRequestBody requestBody)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>{ "card" },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            UnitAmount = (long)(requestBody.PricePerDay *100),
                            Currency = "usd",
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = requestBody.CarName,
                            },
                        },
                        Quantity = requestBody.RentalDays,
                        
                    },
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/user/reservation",
                CancelUrl = requestBody.currentUrl,
                Metadata = new Dictionary<string, string>{
                    {"userId", requestBody.UserId.ToString()},
                    {"vehicleId", requestBody.VehicleId.ToString()},
                    {"locationId", requestBody.LocationId.ToString()},
                    {"pickupDate", requestBody.PickupDate.ToString("o")},
                    {"dropoffDate", requestBody.DropoffDate.ToString("o")},
                }
            };

            var service = new SessionService();
            var session = service.Create(options);

            Response.Headers.Append("Location", session.Url);

            SavePendingReservation(requestBody);

            return Ok(new {
                session.Url,
            });
        }

       [HttpPost("create-checkout-session-for-cart")]
        public ActionResult CreateCheckoutSessionForCart([FromBody] List<CartItem> requestBody)
        {
            // Ovdje ćemo pripremiti linije za Stripe Checkout
            var lineItems = new List<SessionLineItemOptions>();
            var countDays = 0;
            var finalCountDays = new List<int>();
            long unitAmount = 0;
        
            foreach (var item in requestBody)
            {
                countDays = item.Description.CountDays;
                finalCountDays.Add(countDays);
        
                // Računanje cene za ovu stavku
                unitAmount += (long)(item.PricePerDay * 100) * countDays; // Stripe očekuje cenu u centima

            }
        
                // Kreiramo stavku za Stripe Checkout
                var lineItem = new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = unitAmount,
                        Currency = "usd",  // Prilagodite valutu prema potrebi
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Package of cars", // Naziv proizvoda (automobila)
                        },
                    },
                    Quantity = 1, // U ovom primeru uzimamo samo jedan komad (možete prilagoditi)
                };
        
                lineItems.Add(lineItem);
        
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = lineItems,
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/user/reservation",  // URL koji se koristi nakon uspešnog plaćanja
                CancelUrl = "http://localhost:4200",  // Koristimo prvi stavak iz liste za cancel URL
                Metadata = new Dictionary<string, string>
                {
                    { "userId", requestBody.FirstOrDefault()?.Name },  // Primer, trebalo bi da koristite odgovarajuće identifikatore
                    // Dodajte dodatne informacije prema potrebama
                }
            };
        
            // Kreiramo sesiju sa Stripe-om
            var service = new SessionService();
            var session = service.Create(options);
        
            // Postavljamo Location header za preusmeravanje na Stripe Checkout
            Response.Headers.Append("Location", session.Url);
        
            // Čuvamo rezervaciju u bazi
            SavePendingReservationAll(requestBody, unitAmount / 100, finalCountDays);
        
            return Ok(new {
                session.Url,  // Vraćamo URL za Stripe Checkout
            });
        }
        private void SavePendingReservation(CheckoutRequestBody requestBody)
        {

            var reservation = new Reservation
            {
                user_id = requestBody.UserId,
                reservation_date = DateTime.UtcNow,
                total_price = requestBody.PricePerDay * requestBody.RentalDays,
            };

            db.Reservations.Add(reservation);
            db.SaveChanges();
            
            var reseDetails = new ReservationDetails{
                reservation_id = reservation.RId,
                vehicle_id = requestBody.VehicleId,
                location_id = requestBody.LocationId,
                pickup_date = requestBody.PickupDate,
                dropoff_date = requestBody.DropoffDate,
                number_of_days = requestBody.RentalDays,
                price = requestBody.PricePerDay,
            };

            db.reservationDetails.Add(reseDetails);
            db.SaveChanges();

        }

        private void SavePendingReservationAll(List<CartItem> requestBody, long totalPrice, List<int> fD)
        {
            var i = 0;

            var reservation = new Reservation
            {
                user_id = requestBody[0].UserId,
                reservation_date = DateTime.UtcNow,
                total_price = totalPrice,
            };

            db.Reservations.Add(reservation);
            db.SaveChanges();

           foreach (var item in requestBody)
           {
              var reseDetails = new ReservationDetails
            {
               reservation_id = reservation.RId,
               vehicle_id = item.VehicleId,
               location_id = item.LocationId,
               pickup_date = item.Description.PickUpDate.ToUniversalTime(),
               dropoff_date = item.Description.DropOffDate.ToUniversalTime(),
               number_of_days = fD[i],
               price = item.PricePerDay,
            };

               // Dodavanje u bazu podataka
               i++;
               db.reservationDetails.Add(reseDetails);
            }

            // Spremanje u bazu
            db.SaveChanges();

        }   
    }

    public class CheckoutRequestBody
    {
        public string CarName {get; set;}
        public decimal PricePerDay {get; set;}
        public int RentalDays {get; set;}
        public string currentUrl {get; set;}
        public int UserId {get; set;}
        public int VehicleId {get; set;}
        public int LocationId {get; set;}
        public DateTime PickupDate {get;set;}
        public DateTime DropoffDate{get;set;}
    }

    public class CartItem
{
    public string Name { get; set; }
    public string Image { get; set; }
    public decimal PricePerDay { get; set; }
    public int UserId {get; set;}
    public int VehicleId {get; set;}
    public int LocationId {get; set;}
    public CartItemDescription Description { get; set; }
}

public class CartItemDescription
{
    public DateTime PickUpDate { get; set; }
    public DateTime DropOffDate { get; set; }
    public int CountDays { get; set; }
}
}
