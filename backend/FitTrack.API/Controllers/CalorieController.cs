// Controllers/CalorieController.cs
// Handles food logging endpoints

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FitTrack.API.Data;
using FitTrack.API.DTOs;
using FitTrack.API.Models;

namespace FitTrack.API.Controllers;

[ApiController]
[Route("api/calorie")]
[Authorize]
public class CalorieController : ControllerBase
{
    private readonly AppDbContext _db;
    public CalorieController(AppDbContext db) => _db = db;

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    // POST /api/calorie/add
    // Log a food item the user ate
    [HttpPost("add")]
    public async Task<IActionResult> AddFood([FromBody] FoodEntryDto dto)
    {
        var entry = new FoodEntry
        {
            UserId = GetUserId(),
            FoodName = dto.FoodName,
            Calories = dto.Calories,
            ProteinG = dto.ProteinG,
            CarbsG = dto.CarbsG,
            FatG = dto.FatG,
            Quantity = dto.Quantity
        };

        _db.FoodEntries.Add(entry);

        // Award 5 points for logging food
        var stats = await _db.GameStats.FirstOrDefaultAsync(g => g.UserId == GetUserId());
        if (stats != null) stats.TotalPoints += 5;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Food logged! +5 points", entry });
    }

    // GET /api/calorie/today
    // Get all food logged today with totals
    [HttpGet("today")]
    public async Task<IActionResult> GetTodayFood()
    {
        var userId = GetUserId();
        var today = DateTime.UtcNow.Date;

        var entries = await _db.FoodEntries
            .Where(f => f.UserId == userId && f.LoggedAt.Date == today)
            .OrderByDescending(f => f.LoggedAt)
            .ToListAsync();

        // Calculate totals
        var totals = new
        {
            calories = entries.Sum(e => e.Calories * e.Quantity),
            protein = entries.Sum(e => e.ProteinG * e.Quantity),
            carbs = entries.Sum(e => e.CarbsG * e.Quantity),
            fat = entries.Sum(e => e.FatG * e.Quantity),
            entries = entries
        };

        return Ok(totals);
    }

    // DELETE /api/calorie/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFood(int id)
    {
        var entry = await _db.FoodEntries
            .FirstOrDefaultAsync(f => f.Id == id && f.UserId == GetUserId());

        if (entry == null) return NotFound();

        _db.FoodEntries.Remove(entry);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Entry deleted" });
    }
}

// Controllers/WorkoutController.cs
// Handles workout logging endpoints
[ApiController]
[Route("api/workout")]
[Authorize]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _db;
    public WorkoutController(AppDbContext db) => _db = db;

    private int GetUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    // POST /api/workout/add
    [HttpPost("add")]
    public async Task<IActionResult> AddWorkout([FromBody] WorkoutEntryDto dto)
    {
        var entry = new WorkoutEntry
        {
            UserId = GetUserId(),
            WorkoutName = dto.WorkoutName,
            MuscleGroup = dto.MuscleGroup,
            DurationMinutes = dto.DurationMinutes,
            CaloriesBurned = dto.CaloriesBurned
        };

        _db.WorkoutEntries.Add(entry);

        // Award points based on workout duration
        var stats = await _db.GameStats.FirstOrDefaultAsync(g => g.UserId == GetUserId());
        if (stats != null)
        {
            int points = dto.DurationMinutes >= 60 ? 30 : dto.DurationMinutes >= 30 ? 20 : 10;
            stats.TotalPoints += points;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Workout logged!", entry });
    }

    // GET /api/workout/history
    // Last 30 workouts
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory()
    {
        var userId = GetUserId();
        var history = await _db.WorkoutEntries
            .Where(w => w.UserId == userId)
            .OrderByDescending(w => w.LoggedAt)
            .Take(30)
            .ToListAsync();

        return Ok(history);
    }
}
