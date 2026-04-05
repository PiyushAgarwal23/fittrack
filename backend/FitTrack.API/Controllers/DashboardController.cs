// Controllers/DashboardController.cs
// Handles: GET /api/dashboard and profile setup POST /api/profile/setup

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FitTrack.API.Data;
using FitTrack.API.DTOs;
using FitTrack.API.Models;

namespace FitTrack.API.Controllers;

[ApiController]
[Route("api")]
[Authorize] // Every endpoint here requires a valid JWT token
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db)
    {
        _db = db;
    }

    // Helper: gets the logged-in user's ID from their JWT token
    private int GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(claim ?? "0");
    }

    // GET /api/dashboard
    // Returns all data needed for the main dashboard screen
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;

        // Load user with all related data in one query
        var user = await _db.Users
            .Include(u => u.Profile)
            .Include(u => u.GameStats)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        // Sum up today's calories from food logs
        var todayCalories = await _db.FoodEntries
            .Where(f => f.UserId == userId && f.LoggedAt.Date == today)
            .SumAsync(f => f.Calories * f.Quantity);

        // Sum up today's workout time
        var todayWorkoutMins = await _db.WorkoutEntries
            .Where(w => w.UserId == userId && w.LoggedAt.Date == today)
            .SumAsync(w => w.DurationMinutes);

        return Ok(new DashboardDto
        {
            UserName = user.Name,
            TodayCalories = Math.Round(todayCalories, 0),
            CalorieGoal = user.Profile?.DailyCalorieGoal ?? 2000,
            TodayWorkoutMinutes = todayWorkoutMins,
            BmiValue = user.Profile?.BmiValue ?? 0,
            BmiCategory = user.Profile?.BmiCategory ?? "N/A",
            CurrentStreak = user.GameStats?.CurrentStreak ?? 0,
            TotalPoints = user.GameStats?.TotalPoints ?? 0,
            Goal = user.Profile?.Goal ?? "",
            OnboardingComplete = user.Profile?.OnboardingComplete ?? false
        });
    }

    // POST /api/profile/setup
    // Saves onboarding answers and calculates BMI + calorie goal
    [HttpPost("profile/setup")]
    public async Task<IActionResult> SetupProfile([FromBody] ProfileSetupDto dto)
    {
        var userId = GetUserId();

        // Find existing profile or create new one
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId)
                      ?? new UserProfile { UserId = userId };

        // Save user's answers
        profile.HeightCm = dto.HeightCm;
        profile.WeightKg = dto.WeightKg;
        profile.Age = dto.Age;
        profile.Gender = dto.Gender;
        profile.Goal = dto.Goal;
        profile.ActivityLevel = dto.ActivityLevel;
        profile.TimelineWeeks = dto.TimelineWeeks;

        // Calculate BMI: weight(kg) / height(m)²
        var heightM = dto.HeightCm / 100.0;
        profile.BmiValue = Math.Round(dto.WeightKg / (heightM * heightM), 1);
        profile.BmiCategory = GetBmiCategory(profile.BmiValue);

        // Calculate daily calorie goal using Harris-Benedict formula
        profile.DailyCalorieGoal = CalculateCalorieGoal(dto);
        profile.OnboardingComplete = true;
        profile.UpdatedAt = DateTime.UtcNow;

        // If new profile, add it to DB
        if (profile.Id == 0)
            _db.UserProfiles.Add(profile);

        await _db.SaveChangesAsync();

        return Ok(new { message = "Profile saved!", bmi = profile.BmiValue, calorieGoal = profile.DailyCalorieGoal });
    }

    // GET /api/profile
    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetUserId();
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return NotFound();
        return Ok(profile);
    }

    // ─── HELPER METHODS ──────────────────────────────────────────────────────

    // Harris-Benedict equation for Basal Metabolic Rate (BMR)
    private double CalculateCalorieGoal(ProfileSetupDto dto)
    {
        double bmr;

        if (dto.Gender.ToLower() == "male")
            bmr = 88.362 + (13.397 * dto.WeightKg) + (4.799 * dto.HeightCm) - (5.677 * dto.Age);
        else
            bmr = 447.593 + (9.247 * dto.WeightKg) + (3.098 * dto.HeightCm) - (4.330 * dto.Age);

        // Multiply by activity level factor
        double tdee = dto.ActivityLevel switch
        {
            "sedentary"   => bmr * 1.2,
            "light"       => bmr * 1.375,
            "moderate"    => bmr * 1.55,
            "active"      => bmr * 1.725,
            "very_active" => bmr * 1.9,
            _             => bmr * 1.2
        };

        // Adjust for goal
        return dto.Goal switch
        {
            "fat_loss"    => Math.Round(tdee - 500),  // 500 cal deficit
            "muscle_gain" => Math.Round(tdee + 300),  // 300 cal surplus
            _             => Math.Round(tdee)           // maintenance
        };
    }

    private string GetBmiCategory(double bmi) => bmi switch
    {
        < 18.5 => "Underweight",
        < 25.0 => "Normal",
        < 30.0 => "Overweight",
        _      => "Obese"
    };
}
