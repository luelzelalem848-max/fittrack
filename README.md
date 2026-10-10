# FitTrack

A simple workout tracker that runs fully in your browser. No account, no server, no database. Your data stays on your device.

**Live demo:** https://luelzelalem848-max.github.io/fittrack/

> Built with AI assistance. I (Luel) directed the project, tested it, and cleaned it up so I can explain every part. See [EXPLAIN.md](EXPLAIN.md).

## What it does

- Log a workout: activity, distance (km), duration (minutes) and optional notes
- 12 activities: running, cycling, swimming, walking, hiking, gym, yoga, basketball, football, rowing, dancing, boxing
- Calories are estimated from the activity, your weight and the time (MET formula)
- Dashboard: total workouts, total distance, total time, total calories
- Weekly goal bar: counts the distance from the last 7 days against your goal
- 2 charts: distance by activity, and your total distance over time
- Breakdown table with one row per activity
- History: search by activity, delete one workout, or clear all
- Export all workouts to a CSV file
- Profile (name, weight, weekly goal) and a BMI calculator
- Resources tab with a beginner guide link for each activity
- Dark and light mode (your choice is remembered)
- Everything is saved in your browser's `localStorage`

## Files

| File | What it is |
|------|------------|
| `index.html` | The one page: a short intro on top, the app below |
| `style.css` | All the styling (colors, layout, mobile) |
| `app.js` | All the logic (data, charts, buttons), with beginner comments |
| `EXPLAIN.md` | A walk-through of how the app works |
| `LICENSE` | MIT |

## Built with

- HTML, CSS and plain JavaScript (no framework, no build step)
- [Chart.js](https://www.chartjs.org/) for the charts (loaded from a CDN)

Because Chart.js loads from a CDN, you need an internet connection the first time you open it.

## Run it yourself

1. Download or clone this repo
2. Open `index.html` in your browser

That's it. There is nothing to install.

## Known limits

- Data lives only in one browser on one device. Clearing browser data deletes it.
- Calories are an estimate, and BMI is a rough screening number. Neither is medical advice.
- Calories are calculated when you log a workout, so changing your weight later does not change old workouts.
