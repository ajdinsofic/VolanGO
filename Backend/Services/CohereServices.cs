// using System.Net.Http;
// using System.Text;
// using System.Text.Json;
//
// namespace VolanGo.Services
// {
//     public class CohereServices
//     {
//         private readonly HttpClient _httpClient;
//         private readonly string _apiKey;
//         private readonly string _apiUrl = "https://api.cohere.ai/generate";
//
//         public CohereServices(HttpClient httpClient, IConfiguration configuration)
//         {
//             _httpClient = httpClient;
//             _apiKey = configuration["Cohere:ApiKey"];
//             if (string.IsNullOrEmpty(_apiKey))
//             {
//                 throw new InvalidOperationException("Cohere API key is missing from configuration.");
//             }
//         }
//
//         public async Task<string> GetChatResponse(string userMessage)
//         {
//             try
//             {
//                 // Prepare the request body
//                 var requestBody = new
//                 {
//                     model = "command-xlarge-nightly",
//                     prompt = $"User: {userMessage}\nAssistant:",
//                     max_tokens = 100,
//                     temperature = 0.7
//                 };
//
//                 // Serialize the request body
//                 var requestContent = new StringContent(
//                     JsonSerializer.Serialize(requestBody),
//                     Encoding.UTF8,
//                     "application/json"
//                 );
//
//                 // Prepare HTTP request
//                 var request = new HttpRequestMessage
//                 {
//                     Method = HttpMethod.Post,
//                     RequestUri = new Uri(_apiUrl),
//                     Content = requestContent,
//                 };
//
//                 request.Headers.Add("Authorization", $"Bearer {_apiKey}");
//
//                 // Debugging log
//                 Console.WriteLine($"Request URI: {_apiUrl}");
//                 Console.WriteLine($"Authorization: Bearer {_apiKey}");
//                 Console.WriteLine($"Request Body: {JsonSerializer.Serialize(requestBody)}");
//
//                 // Send HTTP request
//                 var response = await _httpClient.SendAsync(request);
//
//                 if (response.IsSuccessStatusCode)
//                 {
//                     var responseContent = await response.Content.ReadAsStringAsync();
//                     var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);
//
//                     // Extract response text
//                     return jsonResponse
//                         .GetProperty("generations")[0]
//                         .GetProperty("text")
//                         .GetString();
//                 }
//
//                 // Handle errors
//                 var errorContent = await response.Content.ReadAsStringAsync();
//                 Console.WriteLine($"Cohere API error: {response.StatusCode} - {errorContent}");
//                 throw new HttpRequestException($"Cohere API error: {response.StatusCode} - {errorContent}");
//             }
//             catch (Exception ex)
//             {
//                 Console.WriteLine($"Error: {ex.Message}");
//                 throw;
//             }
//         }
//     }
// }
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace VolanGo.Services
{
    public class CohereServices
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiUrl = "https://api.cohere.com/v2/chat";

        public CohereServices(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["Cohere:ApiKey"];
        }

        public async Task<string> GetChatResponse(string userMessage)
        {
            try
            {
                var requestBody = new
                {
                    model = "command-r-plus-08-2024",
                    messages = new[]
                    {
                        new { role = "user", content = userMessage }
                    }
                };

                var requestContent = new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                );

                var request = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri(_apiUrl),
                    Content = requestContent,
                };

                request.Headers.Add("Authorization", $"Bearer {_apiKey}");

                var response = await _httpClient.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var jsonResponse = JsonSerializer.Deserialize<JsonElement>(responseContent);

                    // Extract the assistant's text response
                    var assistantResponse = jsonResponse
                        .GetProperty("message")
                        .GetProperty("content")[0]
                        .GetProperty("text")
                        .GetString();

                    return assistantResponse;
                }

                var errorContent = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Cohere API error: {response.StatusCode} - {errorContent}");
                throw new HttpRequestException($"Cohere API error: {response.StatusCode} - {errorContent}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                throw;
            }
        }
    }
}