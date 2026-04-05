// DTOs/AuthDtos.cs
// DTOs (Data Transfer Objects) define what data comes IN and goes OUT of our API
// They prevent us from accidentally exposing sensitive data like password hashes

namespace FitTrack.API.DTOs;

// What the client sends when registering
public class RegisterDto
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = ""; // Plain text - we'll hash it in the service
}

// What the client sends when logging in
public class LoginDto
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
}

// What we send back after successful login/register
public class AuthResponseDto
{
    public string Token { get; set; } = "";    // JWT token
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public bool OnboardingComplete { get; set; } = false;
}

// DTOs/ProfileDtos.cs
// Data for saving onboarding answers
public class ProfileSetupDto
{
    public double HeightCm { get; set; }
    public double WeightKg { get; set; }
    public int Age { get; set; }
    public string Gender { get; set; } = "";
    public string Goal { get; set; } = "";        // "fat_loss", "muscle_gain", "maintenance"
    public string ActivityLevel { get; set; } = ""; // "sedentary", "light", "moderate", "active", "very_active"
    public int TimelineWeeks { get; set; }
}

// Data for logging food
public class FoodEntryDto
{
    public string FoodName { get; set; } = "";
    public double Calories { get; set; }
    public double ProteinG { get; set; }
    public double CarbsG { get; set; }
    public double FatG { get; set; }
    public double Quantity { get; set; } = 1;
}

// Data for logging a workout
public class WorkoutEntryDto
{
    public string WorkoutName { get; set; } = "";
    public string MuscleGroup { get; set; } = "";
    public int DurationMinutes { get; set; }
    public int CaloriesBurned { get; set; }
}

// Dashboard summary sent to the frontend
public class DashboardDto
{
    public string UserName { get; set; } = "";
    public double TodayCalories { get; set; }
    public double CalorieGoal { get; set; }
    public int TodayWorkoutMinutes { get; set; }
    public double BmiValue { get; set; }
    public string BmiCategory { get; set; } = "";
    public int CurrentStreak { get; set; }
    public int TotalPoints { get; set; }
    public string Goal { get; set; } = "";
    public bool OnboardingComplete { get; set; }
}
