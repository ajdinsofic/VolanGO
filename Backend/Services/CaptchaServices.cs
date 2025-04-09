using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class CaptchaServices
{
    private readonly string _secretKey;

    public CaptchaServices(IConfiguration configuration)
    {
        // Load the secret key from appsettings.json
        _secretKey = configuration["Recaptcha:SecretKey"];
    }

    public async Task<bool> VerifyCaptchaAsync(string token)
    {
        if (string.IsNullOrEmpty(token))
        {
            return false;
        }

        using (var client = new HttpClient())
        {
            var response = await client.PostAsync(
                $"https://www.google.com/recaptcha/api/siteverify?secret={_secretKey}&response={token}",
                null
            );

            if (!response.IsSuccessStatusCode) { return false; }

            var json = await response.Content.ReadAsStringAsync();
            Console.WriteLine($"Google reCAPTCHA Response: {json}");

            var result = JsonSerializer.Deserialize<RecaptchaResponse>(json);
            return result?.success ?? false;
        }
    }
}

public class RecaptchaResponse
{
    public bool success { get; set; }
}