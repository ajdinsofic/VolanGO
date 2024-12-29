using Microsoft.AspNetCore.Mvc;
using Stripe.Checkout;
using System.Collections.Generic;

namespace VolanGo.Controllers
{
    [ApiController]
    [Route("api/stripe")]
    public class StripeCheckoutController : ControllerBase
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
                SuccessUrl = "http://localhost:4200/user/dashboard",
                CancelUrl = requestBody.currentUrl
            };

            var service = new SessionService();
            var session = service.Create(options);

            Response.Headers.Append("Location", session.Url);
            return Ok(new {
                session.Url,
            });
        }
    }

    public class CheckoutRequestBody
    {
        public string CarName {get; set;}
        public decimal PricePerDay {get; set;}
        public int RentalDays {get; set;}
        public string currentUrl {get; set;}
    }
}
