using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FitTrack.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FoodEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FoodName = table.Column<string>(type: "text", nullable: false),
                    Calories = table.Column<double>(type: "double precision", nullable: false),
                    ProteinG = table.Column<double>(type: "double precision", nullable: false),
                    CarbsG = table.Column<double>(type: "double precision", nullable: false),
                    FatG = table.Column<double>(type: "double precision", nullable: false),
                    Quantity = table.Column<double>(type: "double precision", nullable: false),
                    LoggedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FoodEntries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GameStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    TotalPoints = table.Column<int>(type: "integer", nullable: false),
                    CurrentStreak = table.Column<int>(type: "integer", nullable: false),
                    LongestStreak = table.Column<int>(type: "integer", nullable: false),
                    LastActiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UnlockedRewards = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GameStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GameStats_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    HeightCm = table.Column<double>(type: "double precision", nullable: false),
                    WeightKg = table.Column<double>(type: "double precision", nullable: false),
                    Age = table.Column<int>(type: "integer", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: false),
                    Goal = table.Column<string>(type: "text", nullable: false),
                    ActivityLevel = table.Column<string>(type: "text", nullable: false),
                    TimelineWeeks = table.Column<int>(type: "integer", nullable: false),
                    DailyCalorieGoal = table.Column<double>(type: "double precision", nullable: false),
                    BmiValue = table.Column<double>(type: "double precision", nullable: false),
                    BmiCategory = table.Column<string>(type: "text", nullable: false),
                    OnboardingComplete = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkoutEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    WorkoutName = table.Column<string>(type: "text", nullable: false),
                    MuscleGroup = table.Column<string>(type: "text", nullable: false),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    CaloriesBurned = table.Column<int>(type: "integer", nullable: false),
                    LoggedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkoutEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WorkoutEntries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FoodEntries_UserId",
                table: "FoodEntries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_GameStats_UserId",
                table: "GameStats",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WorkoutEntries_UserId",
                table: "WorkoutEntries",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FoodEntries");

            migrationBuilder.DropTable(
                name: "GameStats");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "WorkoutEntries");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
