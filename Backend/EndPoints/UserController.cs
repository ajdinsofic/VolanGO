using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.TokenService;
using Microsoft.AspNetCore.Mvc;

namespace Backend.EndPoints
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {
        [HttpGet("decode-token")]
        public IActionResult DecodeTokenFromCookie(){
            var token = Request.Cookies["accessToken"];

            if(string.IsNullOrEmpty(token))
                return Unauthorized("Access token not found in cookie");
            
            var userId = TokenDecoder.DecodeToken(token);

            if(string.IsNullOrEmpty(userId))
                return Unauthorized("Invalid or expired token!");

            return Ok(new {UserId = userId});
        }
    }
}