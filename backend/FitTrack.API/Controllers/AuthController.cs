// Controllers/AuthController.cs
// Handles: POST /api/auth/register and POST /api/auth/login
// Controllers are thin - they just receive requests and call services

using Microsoft.AspNetCore.Mvc;
using FitTrack.API.DTOs;
using FitTrack.API.Services;

namespace FitTrack.API.Controllers;

[ApiController]
[Route("api/auth")] // Base URL: /api/auth
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    // POST /api/auth/register
    // Body: { name, email, password }
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(dto.Name) ||
            string.IsNullOrWhiteSpace(dto.Email) ||
            string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { message = "Name, email, and password are required." });
        }

        if (dto.Password.Length < 6)
            return BadRequest(new { message = "Password must be at least 6 characters." });

        var (success, message, data) = await _authService.RegisterAsync(dto);

        if (!success)
            return BadRequest(new { message });

        return Ok(data); // Returns token + user info
    }

    // POST /api/auth/login
    // Body: { email, password }
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { message = "Email and password are required." });

        var (success, message, data) = await _authService.LoginAsync(dto);

        if (!success)
            return Unauthorized(new { message }); // 401 for wrong credentials

        return Ok(data);
    }
}
