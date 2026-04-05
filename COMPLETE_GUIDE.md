# 🏋️ FitTrack - Complete Fitness App
### Full Stack: React + .NET Web API + PostgreSQL (Neon) + JWT Auth

---

## 📌 PROJECT OVERVIEW

FitTrack is a full-featured fitness web app with:
- JWT Authentication (Register/Login)
- Personalized onboarding flow
- Dashboard with BMI, calories, streaks
- AI-powered diet & workout planner (Claude API)
- Human anatomy muscle explorer
- Gym locator (OpenStreetMap + Leaflet - FREE)
- Mini e-commerce shop (mock data)
- Gamification (points + streaks)
- Light/Dark mode

---

## 📁 FOLDER STRUCTURE

```
fittrack/
├── backend/
│   └── FitTrack.API/
│       ├── Controllers/
│       │   ├── AuthController.cs
│       │   ├── DashboardController.cs
│       │   ├── CalorieController.cs
│       │   ├── WorkoutController.cs
│       │   └── AIController.cs
│       ├── Models/
│       │   ├── User.cs
│       │   ├── UserProfile.cs
│       │   ├── FoodEntry.cs
│       │   ├── WorkoutEntry.cs
│       │   └── GameStats.cs
│       ├── Data/
│       │   └── AppDbContext.cs
│       ├── Services/
│       │   ├── AuthService.cs
│       │   └── TokenService.cs
│       ├── DTOs/
│       │   ├── AuthDtos.cs
│       │   └── ProfileDtos.cs
│       ├── Program.cs
│       └── appsettings.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── StatCard.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Onboarding.jsx
    │   │   ├── CalorieCalculator.jsx
    │   │   ├── BMICalculator.jsx
    │   │   ├── AnatomyMap.jsx
    │   │   ├── GymLocator.jsx
    │   │   ├── Shop.jsx
    │   │   └── AIPlanner.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── hooks/
    │   │   └── useAuth.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛠️ STEP-BY-STEP SETUP (0 → LIVE)

### STEP 1: Install Required Tools

```bash
# Install Node.js (v18+) from: https://nodejs.org
node --version   # should show v18+

# Install .NET 8 SDK from: https://dotnet.microsoft.com/download
dotnet --version  # should show 8.x.x

# Install Git from: https://git.scm.com
git --version
```

---

### STEP 2: Setup Free PostgreSQL Database (Neon)

1. Go to **https://neon.tech** → Sign up (FREE)
2. Create a new project → Name it "fittrack"
3. Click "Connection Details" → Copy the connection string
4. It looks like:
   ```
   Host=ep-xxx.us-east-2.aws.neon.tech;Database=neondb;Username=xxx;Password=xxx;SSL Mode=Require;
   ```
5. Save this — you'll use it in `appsettings.json`

---

### STEP 3: Get Free API Keys

**Claude AI (for AI features):**
1. Go to **https://console.anthropic.com** → Sign up
2. Go to API Keys → Create new key
3. Save it as `CLAUDE_API_KEY`

---

### STEP 4: Setup Backend (.NET)

```bash
# Create the project
cd fittrack/backend
dotnet new webapi -n FitTrack.API
cd FitTrack.API

# Install required packages
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package BCrypt.Net-Next
dotnet add package System.IdentityModel.Tokens.Jwt

# Now copy all the backend files from this guide into correct folders
# Then run migrations:
dotnet ef migrations add InitialCreate
dotnet ef database update

# Run the backend:
dotnet run
# Backend runs at: http://localhost:5000
```

---

### STEP 5: Setup Frontend (React + Vite)

```bash
# Create React project
cd fittrack/frontend
npm create vite@latest . -- --template react
npm install

# Install dependencies
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npm install leaflet react-leaflet    # For maps (FREE)
npm install lucide-react              # Icons

# Setup Tailwind
npx tailwindcss init -p

# Copy all frontend files from this guide
# Then run:
npm run dev
# Frontend runs at: http://localhost:5173
```

---

### STEP 6: Test Locally

1. Start backend: `cd backend/FitTrack.API && dotnet run`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`
4. Register an account → Login → Complete onboarding

---

### STEP 7: Deploy for FREE

#### 7a. Deploy Backend → Render

1. Push code to GitHub
2. Go to **https://render.com** → Sign up
3. New → Web Service → Connect GitHub repo
4. Settings:
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `dotnet out/FitTrack.API.dll`
   - Add Environment Variables:
     - `ConnectionStrings__DefaultConnection` = your Neon connection string
     - `JwtSettings__Secret` = any long random string
     - `ClaudeApiKey` = your Claude API key
5. Deploy → You get a URL like: `https://fittrack-api.onrender.com`

#### 7b. Deploy Frontend → Netlify

1. Go to **https://netlify.com** → Sign up
2. New site → Import from GitHub
3. Build Settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy → You get a URL like: `https://fittrack.netlify.app`

---

## 🔑 ENVIRONMENT VARIABLES REFERENCE

### Backend (appsettings.json or Render env vars):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...neon.tech;Database=...;Username=...;Password=...;SSL Mode=Require;"
  },
  "JwtSettings": {
    "Secret": "your-super-secret-key-min-32-chars-long",
    "Issuer": "FitTrack",
    "Audience": "FitTrackUsers",
    "ExpiryDays": 7
  },
  "ClaudeApiKey": "sk-ant-..."
}
```

### Frontend (.env file):
```
VITE_API_URL=http://localhost:5000
```

---

## 📋 API ENDPOINTS REFERENCE

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/dashboard | Get dashboard data | Yes |
| POST | /api/calorie/add | Log food entry | Yes |
| GET | /api/calorie/today | Get today's calories | Yes |
| POST | /api/workout/add | Log workout | Yes |
| GET | /api/workout/history | Get workout history | Yes |
| POST | /api/ai/diet-plan | Get AI diet plan | Yes |
| POST | /api/ai/workout-plan | Get AI workout plan | Yes |
| POST | /api/profile/setup | Save onboarding data | Yes |
| GET | /api/profile | Get user profile | Yes |

---

## 💡 TIPS FOR BEGINNERS

1. **Run backend first** before starting frontend
2. **Check browser console** (F12) for errors
3. **Use Postman** to test API endpoints directly
4. **JWT token** is stored in localStorage - clear it if you get 401 errors
5. **Neon database** has a free tier of 512MB - more than enough
6. **Render free tier** sleeps after 15 mins - first request takes ~30s to wake up
