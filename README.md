# 💪 FitTrack — Personal Fitness Tracker

A modern, fully-featured fitness tracking web app. Log workouts, track progress, visualize stats, and crush your fitness goals — all in your browser, no sign-up needed.

## Features

### 📊 Dashboard
- Live stat cards: total workouts, total distance, total time, total calories
- Weekly goal progress bar with visual indicator
- Interactive doughnut chart: distance by activity type
- Cumulative progress line chart over time
- Per-activity breakdown table with training guide links

### 📝 Log Workouts
- 12 activity types: running, cycling, swimming, walking, hiking, gym, yoga, basketball, football, rowing, dancing, boxing
- Automatic calorie calculation using MET values based on your weight
- Automatic pace calculation
- Add notes to each workout
- Instant workout summary with training guide link

### 📋 History
- Full workout history with search
- Each entry shows activity, date, distance, time, calories, and notes
- Resource link for every activity
- Delete individual workouts
- Export to CSV (Excel/Google Sheets compatible)
- Clear all history (with confirmation)

### 🔗 Resources
- Curated beginner training guides for every activity
- General fitness resources (Verywell Fit, Strava, MyFitnessPal)

### 👤 Profile
- Set your name, weight, and weekly distance goal
- Weight powers accurate calorie calculations
- Weekly goal powers the progress bar
- Profile saved automatically
- Built-in BMI calculator with CDC reference link

## Tech Stack
- HTML5, CSS3, vanilla JavaScript (no frameworks)
- Chart.js (CDN) for doughnut & line charts
- Poppins font (Google Fonts)
- localStorage for data persistence
- No backend, no databases, no sign-up

## How to Run
1. Clone the repo
2. Open `index.html` in any browser
3. Start tracking your workouts!

## Deploy to GitHub Pages
1. Push to GitHub
2. Go to **Settings → Pages**
3. Select **main** branch, `/ (root)` folder
4. Save — live in minutes!

## Project Structure
```
fittrack-web/
├── index.html       # Main structure (4 tabs + profile modal)
├── style.css        # Dark theme styling
├── app.js           # Full app logic (logging, charts, history, CSV, BMI)
└── README.md        # You are here
```

## License
MIT — free to use, modify, and share.

## Author
**Luel Zelalem** — [GitHub](https://github.com/luelzelalem848-max)
