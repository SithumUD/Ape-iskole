using Microsoft.AspNetCore.Mvc;
using System;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PingController : ControllerBase
{
    [HttpGet]
    public IActionResult Ping()
    {
        return Ok(new { Message = "ApeIskole API is running", Timestamp = DateTime.UtcNow });
    }
}
