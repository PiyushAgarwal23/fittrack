// Models/UserProfile.cs
// Stores personalization data collected during onboarding
namespace FitTrack.API.Models;

public class UserProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }       // Foreign key → User table

    // Physical stats
    public double HeightCm { get; set; }  // Height in centimeters
    public double WeightKg { get; set; }  // Weight in kilograms
    public int Age { get; set; }
    public string Gender { get; set; } = ""; // "male" or "female"

    // Fitness goals from onboarding
    // Options: "fat_loss", "muscle_gain", "maintenance"
    public string Goal { get; set; } = "";
    public string ActivityLevel { get; set; } = ""; // "sedentary", "light", "moderate", "active", "very_active"
    public int TimelineWeeks { get; set; } // How many weeks to reach goal

    // Calculated values (we compute these, not user input)
    public double DailyCalorieGoal { get; set; }
    public double BmiValue { get; set; }
    public string BmiCategory { get; set; } = ""; // "Underweight", "Normal", "Overweight", "Obese"

    public bool OnboardingComplete { get; set; } = false;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public User? User { get; set; }
}
