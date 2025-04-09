using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using VolanGo.Services;

namespace ChatBotBackend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly CohereServices _cohereServices;

        public ChatController(CohereServices cohereServices)
        {
            _cohereServices = cohereServices;
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequest request)
        {
            if (string.IsNullOrEmpty(request.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            try
            {
                var response = await _cohereServices.GetChatResponse(request.Message);
                return Ok(new { response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", details = ex.Message });
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; }
    }
}