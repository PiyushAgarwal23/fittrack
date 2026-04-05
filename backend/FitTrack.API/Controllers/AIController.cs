// Controllers/AIController.cs
// Uses Claude AI to generate personalized diet and workout plans
// FREE tier: Claude gives you $5 credit to start

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using FitTrack.API.Data;

namespace FitTrack.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AIController(AppDbContext db, IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _db = db;
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    // POST /api/ai/diet-plan
    // Generates a personalized diet plan using Claude AI
    [HttpPost("diet-plan")]
    public async Task<IActionResult> GetDietPlan()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        // Get user's profile to personalize the AI prompt
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
            return BadRequest(new { message = "Please complete onboarding first." });

        // Build a detailed prompt using the user's actual data
        var prompt = $@"Create a personalized 7-day meal plan for a person with these stats:
- Weight: {profile.WeightKg}kg
- Height: {profile.HeightCm}cm
- Age: {profile.Age}
- Gender: {profile.Gender}
- Goal: {profile.Goal} (fat_loss = lose weight, muscle_gain = build muscle, maintenance = stay same)
- Activity level: {profile.ActivityLevel}
- Daily calorie target: {profile.DailyCalorieGoal} calories

Give 3 meals + 1 snack per day. Keep it realistic and practical.
Format as a clean list. Include rough calorie counts per meal.
Be encouraging and specific.";

        var aiResponse = await CallClaudeAsync(prompt);
        return Ok(new { plan = aiResponse });
    }

    // POST /api/ai/workout-plan
    // Generates a personalized workout plan
    [HttpPost("workout-plan")]
    public async Task<IActionResult> GetWorkoutPlan()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return BadRequest(new { message = "Please complete onboarding first." });

        var prompt = $@"Create a 5-day workout plan for:
- Goal: {profile.Goal}
- Activity level: {profile.ActivityLevel}
- Timeline: {profile.TimelineWeeks} weeks to reach goal

Include: exercise name, sets, reps, rest time.
Split by muscle group (Push/Pull/Legs style or similar).
Add warm-up and cool-down tips.
Make it beginner-friendly if activity level is sedentary or light.";

        var aiResponse = await CallClaudeAsync(prompt);
        return Ok(new { plan = aiResponse });
    }

    // POST /api/ai/chat
    // General fitness Q&A chatbot
    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Message))
            return BadRequest(new { message = "Message is required" });

        var prompt = $"You are a friendly fitness coach. Answer this question briefly and helpfully: {dto.Message}";
        var response = await CallClaudeAsync(prompt);
        return Ok(new { reply = response });
    }

    // ─── PRIVATE: Calls Claude API ───────────────────────────────────────────
    private async Task<string> CallClaudeAsync(string prompt)
    {
        var apiKey = _config["ClaudeApiKey"];
        if (string.IsNullOrEmpty(apiKey))
            return "AI features not configured. Please add your Claude API key.";

        // Build the API request body
        var requestBody = new
        {
            model = "claude-haiku-4-5-20251001", // Cheapest/fastest Claude model
            max_tokens = 1024,
            messages = new[]
            {
                new { role = "user", content = prompt }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");

        // Required headers for Claude API
        request.Headers.Add("x-api-key", apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        try
        {
            var response = await _httpClient.SendAsync(request);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return "AI service temporarily unavailable. Please try again later.";

            // Parse the response - Claude returns an array of content blocks
            using var doc = JsonDocument.Parse(responseJson);
            var content = doc.RootElement
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString();

            return content ?? "No response from AI";
        }
        catch (Exception ex)
        {
            return $"Error connecting to AI service: {ex.Message}";
        }
    }
}

public class ChatRequestDto
{
    public string Message { get; set; } = "";
}
