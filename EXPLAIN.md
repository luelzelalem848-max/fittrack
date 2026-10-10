# How FitTrack works

This file explains the app in plain words, so anyone (including me in an interview) can follow it.

## The big picture

There are 3 files that matter:

- `index.html` is the **skeleton**: the tabs, boxes, buttons and forms.
- `style.css` is the **look**: colors, spacing, dark/light mode.
- `app.js` is the **brain**: it keeps the list of workouts, saves them, and draws the numbers, charts and lists.

The app has no server. The list of workouts lives in a JavaScript array called `workouts`, and a copy is saved in the browser's `localStorage`.

## What happens when I log a workout

1. I open the **Log Workout** tab, pick an activity, type distance and minutes, and press **Log Workout**.
2. The form's `submit` listener in `app.js` runs. It reads the fields.
3. It calls `calcCalories()`: `MET x weight (kg) x hours`. For running 30 minutes at 70 kg, that is 9.8 x 70 x 0.5 = 343 kcal.
4. It builds an object like this and pushes it into the `workouts` array:

   ```js
   { id: "1791...", date: "2026-10-10T08:00:00.000Z", activity: "running",
     distance: 5, duration: 30, calories: 343, notes: "" }
   ```

5. `saveWorkouts()` turns the array into text with `JSON.stringify` and stores it in `localStorage` under `fittrack_workouts`.
6. A preview with calories and pace (minutes per km) is shown.

So the path is: **button → object in the array → localStorage → screen**.

## How the screen updates

The app only redraws a tab when I click it. The tab-click listener calls:

- `renderDashboard()` for the Dashboard tab
- `renderHistory()` for the History tab
- `renderResources()` for the Resources tab

`renderDashboard()` adds up distance, time and calories, fills the weekly goal bar, and calls `renderActivityChart()`, `renderProgressChart()` and `renderBreakdown()`.

## Weekly goal

The goal bar only counts workouts from the last 7 days: `Date.now() - 7 days`. The percentage is `weekDistance / weeklyGoal`, capped at 100%.

## What happens when I refresh the page

At the bottom of `app.js`, `loadProfile()` and `loadWorkouts()` read from `localStorage` and turn the text back into objects with `JSON.parse`. Then `renderDashboard()` draws everything. That is why the data is still there.

## History, search, delete, clear, CSV

- **Search:** each keystroke calls `renderHistory(text)`, which filters by activity name.
- **Delete:** `deleteWorkout(id)` filters that id out of the array, saves, and redraws.
- **Clear All:** asks for confirmation, then empties the array.
- **Export CSV:** builds a text with one line per workout, makes a `Blob`, and downloads it as `fittrack-export-DATE.csv`.

## Profile and BMI

The profile (name, weight, weekly goal) is saved under `fittrack_profile`. Weight is used for calories. The BMI calculator uses `weight / (height x height)` and shows a category.

## Dark and light mode

The Theme button calls `toggleTheme()`. It sets `data-theme="light"` or `"dark"` on the `<html>` tag. In `style.css`, the colors are CSS variables, and the `[data-theme="light"]` block swaps them. The choice is saved in `localStorage`.

## Questions I should be ready to answer

1. Why use `localStorage` and not a database? (No server needed; data stays private; trade-off: only on one browser.)
2. What does `JSON.stringify` / `JSON.parse` do, and why are they needed? (`localStorage` only stores text.)
3. What is a MET value? (A number for how hard an activity is. Higher MET means more calories per hour.)
4. What does `escapeHtml()` protect against? (Someone typing HTML or a script into the notes.)
5. Why is the calorie number only an estimate? (It uses a standard formula, not real body data.)
6. What would I add next? (Edit a workout, a weekly history chart, a date field when logging.)
7. Which parts did AI help with, and how did I check it? (AI helped write and clean the code; I tested every feature and can explain each function.)
