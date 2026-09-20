/* LUXURY LOGIN GATE logic — fittrack */
(function () {
  var KEY = 'fittrack_profile';
  function enter(gate) {
    var input = gate.querySelector('.fx-gate-input');
    var err = gate.querySelector('.fx-gate-error');
    var card = gate.querySelector('.fx-gate-card');
    var name = (input.value || '').trim();
    if (!name) {
      err.classList.add('fx-show');
      card.classList.remove('fx-shake');
      void card.offsetWidth;
      card.classList.add('fx-shake');
      input.focus();
      return;
    }
    localStorage.setItem(KEY, name);
    try { sessionStorage.setItem('fx_just_logged_in', '1'); } catch (e) {}

      try {
        var p = JSON.parse(localStorage.getItem('fittrack_profile') || '{}');
        p.name = name;
        localStorage.setItem('fittrack_profile', JSON.stringify(p));
      } catch (e) {
        localStorage.setItem('fittrack_profile', JSON.stringify({ name: name }));
      }
      var pn = document.getElementById('profileName');
      if (pn) pn.value = name;
    gate.classList.add('fx-closing');
    setTimeout(function () {
      gate.classList.remove('fx-open');
      gate.remove();
    }, 420);
  }
  document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem(KEY)) return;
    var gate = document.createElement('div');
    gate.className = 'fx-gate';
    gate.innerHTML = `<div class="fx-gate-card">
  <div class="fx-gate-logo">💪</div>
  <h2 class="fx-gate-title">FitTrack</h2>
  <p class="fx-gate-tag">Every rep counts. Every session logged.</p>
  <label class="fx-gate-label" for="fxName">What do we call you, athlete?</label>
  <input id="fxName" class="fx-gate-input fx-glow-input" type="text" placeholder="Your name..." maxlength="40" autocomplete="off" />
  <button class="fx-gate-cta" type="button">Start Training →</button>
  <p class="fx-gate-error">%%ERROR%%</p>
</div>`;
    document.body.appendChild(gate);
    requestAnimationFrame(function () { gate.classList.add('fx-open'); });
    var input = gate.querySelector('.fx-gate-input');
    var cta = gate.querySelector('.fx-gate-cta');
    input.focus();
    cta.addEventListener('click', function () { enter(gate); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') enter(gate);
    });
  });
})();
