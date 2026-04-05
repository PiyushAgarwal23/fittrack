// Models/User.cs
// This represents the 'users' table in our database
namespace FitTrack.API.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = ""; // Never store plain passwords!
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties (EF Core uses these to join tables)
    public UserProfile? Profile { get; set; }
    public GameStats? GameStats { get; set; }
    public List<FoodEntry> FoodEntries { get; set; } = new();
    public List<WorkoutEntry> WorkoutEntries { get; set; } = new();
}
