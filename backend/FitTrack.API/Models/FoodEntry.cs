// Models/FoodEntry.cs
// Records each food item a user logs
namespace FitTrack.API.Models;

public class FoodEntry
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string FoodName { get; set; } = "";
    public double Calories { get; set; }
    public double ProteinG { get; set; }   // grams of protein
    public double CarbsG { get; set; }     // grams of carbs
    public double FatG { get; set; }       // grams of fat
    public double Quantity { get; set; } = 1; // serving size multiplier
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}

// Models/WorkoutEntry.cs
// Records each workout session a user logs
public class WorkoutEntry
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public string WorkoutName { get; set; } = "";    // e.g., "Push Day", "Running"
    public string MuscleGroup { get; set; } = "";    // e.g., "chest", "legs"
    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }
    public DateTime LoggedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}

// Models/GameStats.cs
// Tracks gamification: streaks and reward points
public class GameStats
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public int TotalPoints { get; set; } = 0;       // Lifetime points earned
    public int CurrentStreak { get; set; } = 0;     // Consecutive days active
    public int LongestStreak { get; set; } = 0;     // Best streak ever
    public DateTime? LastActiveDate { get; set; }   // When user last logged in

    // Unlocked rewards (stored as comma-separated reward IDs, simple approach)
    public string UnlockedRewards { get; set; } = "";

    public User? User { get; set; }
}
