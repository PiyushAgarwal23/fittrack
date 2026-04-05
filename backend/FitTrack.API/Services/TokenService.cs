// Services/TokenService.cs
// Responsible for creating JWT tokens
// A JWT token is like a signed ID card - it proves who the user is

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using FitTrack.API.Models;

namespace FitTrack.API.Services;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    // Creates a JWT token for a logged-in user
    public string CreateToken(User user)
    {
        var jwtSettings = _config.GetSection("JwtSettings");
        var secret = jwtSettings["Secret"]!;
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

        // Claims = data stored inside the token (readable by frontend)
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), // User's ID
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name)
        };

        // Sign the token with our secret key
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(int.Parse(jwtSettings["ExpiryDays"] ?? "7")),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token); // Returns the token string
    }
}
