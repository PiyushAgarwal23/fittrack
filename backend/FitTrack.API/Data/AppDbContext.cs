// Data/AppDbContext.cs
// This is EF Core's "window" into the database
// Each DbSet<T> maps to a table in PostgreSQL

using Microsoft.EntityFrameworkCore;
using FitTrack.API.Models;

namespace FitTrack.API.Data;

public class AppDbContext : DbContext
{
    // Constructor receives config from dependency injection
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Each property here = one table in the database
    public DbSet<User> Users { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<FoodEntry> FoodEntries { get; set; }
    public DbSet<WorkoutEntry> WorkoutEntries { get; set; }
    public DbSet<GameStats> GameStats { get; set; }

    // Configure table relationships and constraints
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User → UserProfile: One-to-One
        modelBuilder.Entity<User>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<UserProfile>(p => p.UserId)
            .OnDelete(DeleteBehavior.Cascade); // Delete profile when user deleted

        // User → GameStats: One-to-One
        modelBuilder.Entity<User>()
            .HasOne(u => u.GameStats)
            .WithOne(g => g.User)
            .HasForeignKey<GameStats>(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User → FoodEntries: One-to-Many
        modelBuilder.Entity<User>()
            .HasMany(u => u.FoodEntries)
            .WithOne(f => f.User)
            .HasForeignKey(f => f.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User → WorkoutEntries: One-to-Many
        modelBuilder.Entity<User>()
            .HasMany(u => u.WorkoutEntries)
            .WithOne(w => w.User)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Email must be unique (no duplicate accounts)
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
