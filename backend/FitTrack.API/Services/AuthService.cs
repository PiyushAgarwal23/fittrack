// Services/AuthService.cs
// Contains the business logic for user registration and login
// Keeps controllers thin - controllers just call this service

using FitTrack.API.Data;
using FitTrack.API.DTOs;
using FitTrack.API.Models;
using Microsoft.EntityFrameworkCore;

namespace FitTrack.API.Services;

public class AuthService
{
    private readonly AppDbContext _db;
    private readonly TokenService _tokenService;

    public AuthService(AppDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    // Register a new user
    public async Task<(bool success, string message, AuthResponseDto? data)> RegisterAsync(RegisterDto dto)
    {
        // Check if email already taken
        var email = dto.Email.ToLower().Trim();

        var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (existingUser != null)
            return (false, "Email already registered.", null);

        // Create user with hashed password (NEVER store plain text passwords)
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email.ToLower().Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        // Create default GameStats for the new user
        //_db.GameStats.Add(new GameStats { UserId = user.Id });
        //await _db.SaveChangesAsync();
        _db.GameStats.Add(new GameStats
        {
            UserId = user.Id,
            CurrentStreak = 1,
            LongestStreak = 1,
            TotalPoints = 0,
            LastActiveDate = DateTime.UtcNow,
            UnlockedRewards = "" // ✅ ADD THIS
        });

        await _db.SaveChangesAsync();

        // Generate JWT token
        var token = _tokenService.CreateToken(user);

        return (true, "Registration successful!", new AuthResponseDto
        {
            Token = token,
            Name = user.Name,
            Email = user.Email,
            OnboardingComplete = false // New users haven't done onboarding yet
        });
    }

    // Login existing user
    public async Task<(bool success, string message, AuthResponseDto? data)> LoginAsync(LoginDto dto)
    {
        // Find user by email
        var user = await _db.Users
            .Include(u => u.Profile) // Load profile to check if onboarding is done
            .FirstOrDefaultAsync(u => u.Email == dto.Email.ToLower().Trim());

        if (user == null)
            return (false, "Invalid email or password.", null);

        // Verify password
        bool passwordCorrect = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!passwordCorrect)
            return (false, "Invalid email or password.", null);

        // Update streak
        await UpdateStreakAsync(user.Id);

        var token = _tokenService.CreateToken(user);

        return (true, "Login successful!", new AuthResponseDto
        {
            Token = token,
            Name = user.Name,
            Email = user.Email,
            OnboardingComplete = user.Profile?.OnboardingComplete ?? false
        });
    }

    // Updates the user's daily streak when they log in
    private async Task UpdateStreakAsync(int userId)
    {
        var stats = await _db.GameStats.FirstOrDefaultAsync(g => g.UserId == userId);
        if (stats == null) return;

        var today = DateTime.UtcNow.Date;
        var lastActive = stats.LastActiveDate?.Date;

        if (lastActive == today) return; // Already logged in today

        if (lastActive == today.AddDays(-1))
        {
            // Consecutive day → increase streak
            stats.CurrentStreak++;
            stats.TotalPoints += 10; // 10 points for daily check-in
        }
        else if (lastActive != today)
        {
            // Streak broken → reset
            stats.CurrentStreak = 1;
        }

        // Update longest streak
        if (stats.CurrentStreak > stats.LongestStreak)
            stats.LongestStreak = stats.CurrentStreak;

        stats.LastActiveDate = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
}
