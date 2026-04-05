// Program.cs - The main entry point for our .NET Web API
// This file configures all services and middleware

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FitTrack.API.Data;
using FitTrack.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ─── ADD SERVICES ────────────────────────────────────────────────────────────

// Controllers handle incoming HTTP requests
builder.Services.AddControllers();

// Swagger - generates API documentation at /swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - connects to PostgreSQL via Entity Framework
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Our custom services (business logic)
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TokenService>();

// JWT Authentication setup
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["Secret"] ?? throw new Exception("JWT Secret not configured!");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwtSettings["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // No tolerance for expired tokens
        };
    });

// CORS - allows frontend (React) to call our API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",        // Local React dev server
                "https://*.netlify.app"         // Deployed Netlify frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ─── BUILD & CONFIGURE MIDDLEWARE ────────────────────────────────────────────

var app = builder.Build();

// Auto-run database migrations on startup (creates tables if they don't exist)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate(); // Applies pending migrations automatically
}

// Development tools
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");       // Must be before UseAuthorization
app.UseAuthentication();            // Reads JWT token from request
app.UseDeveloperExceptionPage();
app.UseAuthorization();             // Checks if user has access
app.MapControllers();               // Routes requests to controllers

app.Run();
