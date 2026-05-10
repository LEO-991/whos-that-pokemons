# 🏆 Who's That Pokémon?

A fun and interactive Pokédex guessing game built with Angular 17 and Node.js. Test your Pokémon knowledge by identifying silhouetted Pokémon before time runs out!

![Angular](https://img.shields.io/badge/Angular-17-red)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-blue)

## 📖 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How to Play](#how-to-play)
- [API Endpoints](#api-endpoints)
- [Game Configuration](#game-configuration)
- [License](#license)

## ✨ Features

### 🎮 Core Gameplay
- **Silhouette Guessing**: Identify Pokémon from their shadow before the timer runs out
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes with varying time limits and hints
- **Generation Selection**: Choose from Gen 1 through Gen 5 Pokémon regions
- **Scoring System**: Earn points for correct answers with streak bonuses
- **10 Rounds Per Game**: Challenge yourself through 10 Pokémon per session

### 👤 User Features
- **User Authentication**: Secure register and login system
- **Score Tracking**: Personal best scores saved per difficulty
- **Game History**: Track your correct/incorrect guesses
- **Leaderboards**: Global rankings for each difficulty level

### 👑 Admin Features
- **User Management**: Create, edit, and delete users
- **Role-based Access**: Admin and user roles
- **Dashboard**: Admin-only dashboard for user management

## 🛠 Tech Stack

### Frontend
- **Framework**: Angular 17 (Standalone Components)
- **Language**: TypeScript
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Press Start 2P (Pixel font), Nunito

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
whos-that-pokemon/
├── server.js                 # Express server entry point
├── models/
│   ├── User.js              # User model (authentication)
│   ├── Score.js             # Score model (leaderboards)
│   └── History.js           # History model (game history)
├── src/
│   ├── index.html           # Main HTML entry
│   ├── main.ts              # Angular bootstrap
│   ├── styles.css           # Global styles
│   └── app/
│       ├── app.component.*  # Root component
│       ├── app.routes.ts     # Route definitions
│       ├── app.config.ts     # App configuration
│       ├── auth.service.ts   # Authentication service
│       ├── game.service.ts  # Game logic service
│       ├── pokemon.service.ts # PokéAPI integration
│       ├── user.service.ts  # User management service
│       ├── leaderboard.service.ts # Leaderboard service
│       ├── homepage/         # Home page component
│       ├── login/            # Login page component
│       ├── register/         # Register page component
│       ├── lobby/            # Game lobby (settings)
│       ├── game/             # Main game component
│       ├── leaderboard/      # Leaderboard component
│       ├── header/           # Navigation header
│       ├── user-menu/        # User menu dropdown
│       ├── admin-dashboard/  # Admin dashboard
│       └── not-found/        # 404 page
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   cd whos-that-pokemon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/whos-that-pokemon
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Open the game**
   
   Navigate to: `http://localhost:3000`

### Default Admin Account
After first startup, a default admin user is created:
- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Security Note**: Change the default admin password immediately in production!

## 🎯 How to Play

### The Game Logic
1. **Start a Game**: Select your generation and difficulty, then click "Start Game!"
2. **Guess the Pokémon**: A darkened silhouette appears on screen
3. **Use Hints**: If stuck, view type and region hints (based on difficulty)
4. **Select Your Answer**: Click one of the four choice buttons
5. **Score Points**: Correct answers earn points based on difficulty + time bonus
6. **Build Streaks**: Consecutive correct answers increase your multiplier
7. **Finish**: After 10 rounds, view your final score and rankings

### Difficulty Settings

| Difficulty | Timer | Hints Available |
|------------|-------|-----------------|
| Easy       | 30s   | Type + Region   |
| Medium     | 20s   | Type OR Region |
| Hard       | 10s   | None           |

### Scoring

| Difficulty | Base Points | Time Bonus |
|------------|-------------|------------|
| Easy       | 10 per answer | +2 per second remaining |
| Medium     | 20 per answer | +2 per second remaining |
| Hard       | 30 per answer | +2 per second remaining |

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login and get JWT |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me/username` | Update username |
| DELETE | `/api/users/me` | Delete account |

### Game
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/game/score` | Save game score |
| POST | `/api/game/history` | Save guess history |
| GET | `/api/game/history` | Get user history |
| GET | `/api/game/score` | Get user scores |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leaderboard/:difficulty` | Get top 10 scores |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| POST | `/api/admin/users` | Create new user |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |

## ⚙️ Game Configuration

### Generation Options
- Gen 1: Kanto Region (1-151)
- Gen 2: Johto Region (152-251)
- Gen 3: Hoenn Region (252-386)
- Gen 4: Sinnoh Region (387-493)
- Gen 5: Unova Region (494-649)

### Timer Mechanics
- Timer counts down from difficulty-specific seconds
- Running out of time = wrong answer
- Timer stops immediately after selection
- 2-second delay between rounds

### Hint System
- Hints are revealed progressively based on difficulty
- Easy: Both Type and Region hints
- Medium: One random hint
- Hard: No hints

## 📄 License

This project is for educational purposes. Pokémon is a trademark of Nintendo/Creatures Inc./GAME FREAK inc.

---

<p align="center">Made with ❤️ for Pokémon fans!</p>
