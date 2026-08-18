// ====== FitTrack — Web Fitness Tracker ======

const STORAGE_KEY = 'fittrack_workouts';
const PROFILE_KEY = 'fittrack_profile';

let workouts = [];
let profile = { name: 'Athlete', weight: 70, weeklyGoal: 20 };
let activityChart = null;
let progressChart = null;

// ---- MET values ----
const METS = {
  running: 9.8, cycling: 7.5, swimming: 8.0, walking: 3.5, hiking: 6.0,
  gym: 5.0, yoga: 3.0, basketball: 6.5, football: 7.0, rowing: 8.5,
  dancing: 4.5, boxing: 9.0
};

// ---- Activity icons ----
const activityIcons = {
  running: '🏃', cycling: '🚴', swimming: '🏊', walking: '🚶', hiking: '🥾',
  gym: '🏋️', yoga: '🧘', basketball: '🏀', football: '⚽', rowing: '🚣',
  dancing: '💃', boxing: '🥊'
};

// ---- Activity resource links ----
const activityLinks = {
  running: 'https://www.runnersworld.com/training/a20880848/beginner-running-tips/',
  cycling: 'https://www.bicycling.com/training/a20012883/cycling-tips-for-beginners/',
  swimming: 'https://www.swimming.org/masters/tips-for-beginners/',
  walking: 'https://www.healthline.com/health/fitness-exercise/walking-for-exercise',
  hiking: 'https://www.rei.com/learn/expert-advice/hiking-for-beginners.html',
  gym: 'https://www.muscleandfitness.com/workouts/workout-routines/beginner-gym-workout/',
  yoga: 'https://www.yogajournal.com/beginners/yoga-101-beginners-guide/',
  basketball: 'https://www.basketballforbeginners.com/',
  football: 'https://www.soccer.com/guide/beginner-soccer-guide',
  rowing: 'https://www.concept2.com/training/beginners',
  dancing: 'https://www.danceforbeginners.com/',
  boxing: 'https://www.titleboxing.com/beginners-boxing-guide'
};

// ---- Load from localStorage ----
function loadWorkouts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { try { workouts = JSON.parse(saved); } catch(e) { workouts = []; } }
}

function saveWorkouts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
}

function loadProfile() {
  const saved = localStorage.getItem(PROFILE_KEY);
  if (saved) { try { profile = JSON.parse(saved); } catch(e) {} }
  document.getElementById('profileName').value = profile.name;
  document.getElementById('profileWeight').value = profile.weight;
  document.getElementById('profileGoal').value = profile.weeklyGoal;
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ---- Calculate calories ----
function calcCalories(activity, duration) {
  const met = METS[activity] || 5.0;
  return Math.round(met * profile.weight * (duration / 60));
}

// ---- Format helpers ----
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDuration(mins) {
  if (mins < 60) return mins + 'm';
  return Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
}

// ---- Tab switching ----
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'dashboard') renderDashboard();
    if (tab.dataset.tab === 'history') renderHistory();
    if (tab.dataset.tab === 'resources') renderResources();
  });
});

// ---- Render Dashboard ----
function renderDashboard() {
  // Stats
  const total = workouts.reduce((s, w) => s + w.distance, 0);
  const totalDur = workouts.reduce((s, w) => s + w.duration, 0);
  const totalCal = workouts.reduce((s, w) => s + w.calories, 0);

  document.getElementById('totalWorkouts').textContent = workouts.length;
  document.getElementById('totalDistance').textContent = total.toFixed(1) + ' km';
  document.getElementById('totalTime').textContent = formatDuration(totalDur);
  document.getElementById('totalCalories').textContent = totalCal + ' kcal';

  // Goal bar
  const pct = Math.min((total / profile.weeklyGoal) * 100, 100);
  document.getElementById('goalBarFill').style.width = pct + '%';
  let goalMsg = total.toFixed(1) + ' / ' + profile.weeklyGoal + ' km';
  if (pct >= 100) goalMsg += ' — 🎉 Goal achieved!';
  else goalMsg += ' — ' + (profile.weeklyGoal - total).toFixed(1) + ' km to go!';
  document.getElementById('goalText').textContent = goalMsg;

  renderActivityChart();
  renderProgressChart();
  renderBreakdown();
}

// ---- Activity Doughnut Chart ----
function renderActivityChart() {
  const ctx = document.getElementById('activityChart').getContext('2d');
  const byActivity = {};
  workouts.forEach(w => { byActivity[w.activity] = (byActivity[w.activity] || 0) + w.distance; });
  const labels = Object.keys(byActivity);
  const data = Object.values(byActivity);
  const colors = ['#e84545','#4ade80','#fbbf24','#3b82f6','#a855f7','#ec4899','#06b6d4','#84cc16','#f97316','#8b5cf6','#14b8a6','#ef4444'];

  if (activityChart) activityChart.destroy();
  if (labels.length === 0) return;

  activityChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors.slice(0, labels.length), borderWidth: 0 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#8888aa', font: { size: 10 }, padding: 8 } } }
    }
  });
}

// ---- Progress Line Chart ----
function renderProgressChart() {
  const ctx = document.getElementById('progressChart').getContext('2d');
  const sorted = [...workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
  let cumulative = 0;
  const labels = sorted.map(w => formatDate(w.date).split(',')[0]);
  const data = sorted.map(w => { cumulative += w.distance; return cumulative.toFixed(1); });

  if (progressChart) progressChart.destroy();
  if (sorted.length === 0) return;

  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cumulative Distance (km)',
        data,
        borderColor: '#e84545',
        backgroundColor: 'rgba(232, 69, 69, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#e84545'
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8888aa', font: { size: 10 } } } },
      scales: {
        x: { ticks: { color: '#8888aa', font: { size: 9 } } },
        y: { ticks: { color: '#8888aa', font: { size: 9 } } }
      }
    }
  });
}

// ---- Breakdown Table ----
function renderBreakdown() {
  const tbody = document.getElementById('breakdownBody');
  const byActivity = {};

  workouts.forEach(w => {
    if (!byActivity[w.activity]) byActivity[w.activity] = { count: 0, dist: 0, dur: 0, cal: 0 };
    byActivity[w.activity].count++;
    byActivity[w.activity].dist += w.distance;
    byActivity[w.activity].dur += w.duration;
    byActivity[w.activity].cal += w.calories;
  });

  if (Object.keys(byActivity).length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#8888aa;padding:16px;">No workouts yet</td></tr>';
    return;
  }

  tbody.innerHTML = Object.entries(byActivity).map(([act, d]) => `
    <tr>
      <td>${activityIcons[act] || '📦'} ${act}</td>
      <td>${d.count}</td>
      <td>${d.dist.toFixed(1)} km</td>
      <td>${formatDuration(d.dur)}</td>
      <td>${d.cal} kcal</td>
      <td><a href="${activityLinks[act] || '#'}" target="_blank">Guide ↗</a></td>
    </tr>
  `).join('');
}

// ---- Log Workout ----
document.getElementById('workoutForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const activity = document.getElementById('activityType').value;
  const distance = parseFloat(document.getElementById('distanceInput').value);
  const duration = parseInt(document.getElementById('durationInput').value);
  const notes = document.getElementById('notesInput').value.trim();

  if (!activity || !distance || !duration) return;

  const workout = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
    activity, distance, duration,
    calories: calcCalories(activity, duration),
    notes
  };

  workouts.push(workout);
  saveWorkouts();

  // Show preview
  const pace = distance > 0 ? (duration / distance).toFixed(1) : 'N/A';
  document.getElementById('workoutPreview').style.display = 'block';
  document.getElementById('previewStats').innerHTML = `
    ✅ <strong>${activityIcons[activity]} ${activity}</strong> — ${distance.toFixed(1)} km in ${duration} mins<br>
    🔥 ${workout.calories} kcal burned | 🏃 Pace: ${pace} min/km<br>
    🔗 <a href="${activityLinks[activity]}" target="_blank" style="color:#ff6b6b;">Training guide for ${activity} ↗</a>
  `;

  // Reset form
  document.getElementById('activityType').value = '';
  document.getElementById('distanceInput').value = '';
  document.getElementById('durationInput').value = '';
  document.getElementById('notesInput').value = '';
});

// ---- Render History ----
function renderHistory(filter) {
  const list = document.getElementById('historyList');
  let filtered = workouts.slice().reverse();

  if (filter) {
    filtered = filtered.filter(w => w.activity.toLowerCase().includes(filter.toLowerCase()));
  }

  if (filtered.length === 0) {
    list.innerHTML = '<p class="empty-state">No workouts found. Go log one! 💪</p>';
    return;
  }

  list.innerHTML = filtered.map(w => `
    <div class="history-item">
      <span class="history-icon">${activityIcons[w.activity] || '📦'}</span>
      <div class="history-info">
        <span class="history-activity">${w.activity}</span>
        <span class="history-meta">${formatDate(w.date)} · ${w.duration}m · ${w.calories} kcal${w.notes ? ' · 📝 ' + w.notes : ''}</span>
      </div>
      <span class="history-amount">${w.distance.toFixed(1)} km</span>
      <a class="history-link" href="${activityLinks[w.activity] || '#'}" target="_blank">Guide ↗</a>
      <button class="btn-delete-item" onclick="deleteWorkout('${w.id}')">✕</button>
    </div>
  `).join('');
}

// ---- Search ----
document.getElementById('searchInput').addEventListener('input', function(e) {
  renderHistory(e.target.value);
});

// ---- Delete workout ----
function deleteWorkout(id) {
  workouts = workouts.filter(w => w.id !== id);
  saveWorkouts();
  renderHistory(document.getElementById('searchInput').value);
}

// ---- Export CSV ----
document.getElementById('exportBtn').addEventListener('click', function() {
  if (workouts.length === 0) { alert('No workouts to export!'); return; }

  let csv = 'Date,Activity,Distance(km),Duration(min),Calories,Notes,Resource Link\n';
  workouts.forEach(w => {
    const notes = (w.notes || '').replace(/"/g, "'");
    csv += `${formatDate(w.date)},${w.activity},${w.distance},${w.duration},${w.calories},"${notes}",${activityLinks[w.activity] || ''}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fittrack-export-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// ---- Clear All ----
document.getElementById('clearBtn').addEventListener('click', function() {
  if (workouts.length === 0) return;
  if (confirm('Delete ALL ' + workouts.length + ' workouts? This cannot be undone!')) {
    workouts = [];
    saveWorkouts();
    renderHistory();
  }
});

// ---- Resources ----
function renderResources() {
  const grid = document.getElementById('resourcesGrid');
  grid.innerHTML = Object.entries(activityLinks).map(([act, link]) => `
    <div class="resource-item">
      <span class="resource-emoji">${activityIcons[act]}</span>
      <div class="resource-name">${act.charAt(0).toUpperCase() + act.slice(1)}</div>
      <a class="resource-link" href="${link}" target="_blank">📖 Beginner's Guide ↗</a>
    </div>
  `).join('') + `
    <div class="resource-item">
      <span class="resource-emoji">🏅</span>
      <div class="resource-name">General Fitness</div>
      <a class="resource-link" href="https://www.verywellfit.com/" target="_blank">Verywell Fit ↗</a>
    </div>
    <div class="resource-item">
      <span class="resource-emoji">📈</span>
      <div class="resource-name">Strava</div>
      <a class="resource-link" href="https://www.strava.com/" target="_blank">Track & Share ↗</a>
    </div>
    <div class="resource-item">
      <span class="resource-emoji">🍎</span>
      <div class="resource-name">MyFitnessPal</div>
      <a class="resource-link" href="https://www.myfitnesspal.com/" target="_blank">Nutrition Tracker ↗</a>
    </div>
  `;
}

// ---- Profile Modal ----
document.getElementById('profileBtn').addEventListener('click', function() {
  document.getElementById('profileModal').style.display = 'flex';
});

document.getElementById('closeProfile').addEventListener('click', function() {
  document.getElementById('profileModal').style.display = 'none';
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
  e.preventDefault();
  profile.name = document.getElementById('profileName').value.trim() || 'Athlete';
  profile.weight = parseFloat(document.getElementById('profileWeight').value) || 70;
  profile.weeklyGoal = parseFloat(document.getElementById('profileGoal').value) || 20;
  saveProfile();
  document.getElementById('profileModal').style.display = 'none';
  renderDashboard();
});

// ---- BMI Calculator ----
document.getElementById('calcBmi').addEventListener('click', function() {
  const height = parseFloat(document.getElementById('bmiHeight').value);
  if (!height || height < 0.5) { document.getElementById('bmiResult').textContent = 'Please enter a valid height'; return; }

  const bmi = profile.weight / (height * height);
  let category = '';
  if (bmi < 18.5) category = '⚠️ Underweight';
  else if (bmi < 25) category = '✅ Normal';
  else if (bmi < 30) category = '⚠️ Overweight';
  else category = '⚠️ Obese';

  document.getElementById('bmiResult').innerHTML = `Your BMI: ${bmi.toFixed(1)} — ${category}<br><a href="https://www.cdc.gov/healthyweight/assessing/bmi/" target="_blank" style="color:#ff6b6b;">Learn more ↗</a>`;
});

// ---- Init ----
loadProfile();
loadWorkouts();
renderDashboard();
renderHistory();
