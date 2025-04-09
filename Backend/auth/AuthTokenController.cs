using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace VolanGo.auth
{
    [ApiController]
    [Route("[controller]")]
    public class AuthTokenController : ControllerBase
    {
        [HttpPost("LoginUser")]
        public IActionResult AuthUserLogin(){
            return Ok("Poslan zahtjev je prihvacen");
        }

        [HttpPost("LoginAdmin")]
        public IActionResult AuthAdminLogin(){
            return Ok("Poslan zahtjev je prihvacen");
        }
    }
}