using SendGrid;
using SendGrid.Helpers.Mail;

namespace VolanGo.Services
{
    public class EmailService
    {
        private readonly string _apiKey;

        public EmailService(IConfiguration configuration)
        {
            _apiKey = configuration["SendGrid:ApiKey"];
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var client = new SendGridClient(_apiKey);
            var from = new EmailAddress("danialdan.cemalovic@edu.fit.ba", "no-reply-Volan-GO");
            var to = new EmailAddress(toEmail);
            var message = MailHelper.CreateSingleEmail(from, to, subject, body, body);

            var response = await client.SendEmailAsync(message);

            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Body.ReadAsStringAsync();
                Console.WriteLine($"Error sending email: {response.StatusCode} - {errorContent}");
                throw new Exception("Failed to send email.");
            }
        }
    }
}