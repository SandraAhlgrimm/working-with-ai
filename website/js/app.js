import { questions, computeScore, getScoreLabel, getTimelineEstimate } from './questions.js';
import { occupations } from './occupations.js';
import { t } from './i18n.js';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  currentScreen: 'landing', // landing | question | result
  questionIndex: 0,
  answers: new Array(questions.length).fill(null),
  score: null,
  transitioning: false
};

// ─── DOM References ──────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const screens = {
  landing: $('#landing-screen'),
  question: $('#question-screen'),
  result: $('#result-screen')
};

// ─── Initialization ──────────────────────────────────────────────────────────
export function init() {
  // Restore saved progress
  loadProgress();

  // Theme toggle
  $('#theme-toggle').addEventListener('click', toggleTheme);

  // Landing CTA
  $('#start-btn').addEventListener('click', () => {
    showScreen('question');
  });

  // Navigation buttons
  $('#next-btn').addEventListener('click', goNext);
  $('#back-btn').addEventListener('click', goBack);

  // Restart button
  $('#restart-btn').addEventListener('click', restart);

  // Occupation search
  $('#occupation-search').addEventListener('input', (e) => {
    filterOccupations(e.target.value);
  });

  // Toggle occupation explorer
  $('#toggle-explorer').addEventListener('click', () => {
    const explorer = $('#occupation-explorer');
    const btn = $('#toggle-explorer');
    explorer.classList.toggle('open');
    btn.textContent = explorer.classList.contains('open')
      ? t.explorerClose
      : t.explorerOpen;
  });

  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);

  // Render initial state
  renderQuestion();
  populateOccupations();
}

// ─── Theme Toggle ────────────────────────────────────────────────────────────
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);

  // Update theme-color meta tag
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = next === 'light' ? '#f5f7fb' : '#0a0e1a';
}

// ─── Screen Transitions ─────────────────────────────────────────────────────
function showScreen(name) {
  if (state.transitioning) return;
  state.transitioning = true;

  const current = screens[state.currentScreen];
  const next = screens[name];

  current.classList.add('screen-exit');
  current.classList.remove('screen-active');

  setTimeout(() => {
    current.classList.remove('screen-exit');
    current.classList.add('screen-hidden');
    next.classList.remove('screen-hidden');
    next.classList.add('screen-enter');

    requestAnimationFrame(() => {
      next.classList.remove('screen-enter');
      next.classList.add('screen-active');
      state.currentScreen = name;
      state.transitioning = false;

      if (name === 'result') {
        animateResult();
      }
    });
  }, 400);
}

// ─── Question Rendering ─────────────────────────────────────────────────────
function renderQuestion() {
  const q = questions[state.questionIndex];

  // Update progress
  $('#progress-fill').style.width = `${((state.questionIndex) / questions.length) * 100}%`;
  $('#progress-text').textContent = `${state.questionIndex + 1} / ${questions.length}`;

  // Question content
  $('#question-number').textContent = `${t.questionLabel} ${state.questionIndex + 1}`;
  $('#question-text').textContent = q.text;
  $('#question-hint').textContent = q.hint;

  // Options
  const optionsContainer = $('#options-container');
  optionsContainer.innerHTML = '';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.value = i;
    if (state.answers[state.questionIndex] === i) {
      btn.classList.add('selected');
    }
    btn.innerHTML = `<span class="option-marker">${String.fromCharCode(65 + i)}</span><span class="option-text">${option}</span>`;
    btn.addEventListener('click', () => selectOption(i));
    optionsContainer.appendChild(btn);
  });

  // Navigation state
  $('#back-btn').style.visibility = state.questionIndex === 0 ? 'hidden' : 'visible';

  const isLast = state.questionIndex === questions.length - 1;
  const nextBtn = $('#next-btn');
  nextBtn.textContent = isLast ? t.seeResultsBtn : t.nextBtn;
  nextBtn.disabled = state.answers[state.questionIndex] === null;

  // Animate options in with stagger
  const options = optionsContainer.querySelectorAll('.option-btn');
  options.forEach((opt, i) => {
    opt.style.animationDelay = `${i * 0.06}s`;
    opt.classList.add('option-enter');
  });
}

function selectOption(value) {
  state.answers[state.questionIndex] = value;
  saveProgress();

  // Update UI
  $$('.option-btn').forEach(btn => {
    btn.classList.toggle('selected', parseInt(btn.dataset.value) === value);
  });

  $('#next-btn').disabled = false;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function goNext() {
  if (state.answers[state.questionIndex] === null) return;

  if (state.questionIndex < questions.length - 1) {
    state.questionIndex++;
    saveProgress();
    transitionQuestion('next');
  } else {
    // Compute score and show results
    state.score = computeScore(state.answers);
    showScreen('result');
  }
}

function goBack() {
  if (state.questionIndex > 0) {
    state.questionIndex--;
    saveProgress();
    transitionQuestion('back');
  }
}

function transitionQuestion(direction) {
  const content = $('#question-content');
  const exitClass = direction === 'next' ? 'slide-out-left' : 'slide-out-right';

  content.style.opacity = '0';
  content.style.transform = direction === 'next' ? 'translateX(-20px)' : 'translateX(20px)';

  setTimeout(() => {
    renderQuestion();
    content.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';

    requestAnimationFrame(() => {
      content.style.transition = 'all 0.3s ease';
      content.style.opacity = '1';
      content.style.transform = 'translateX(0)';

      setTimeout(() => {
        content.style.transition = '';
      }, 300);
    });
  }, 200);
}

// ─── Result Rendering ────────────────────────────────────────────────────────
function getScoreColor(pct) {
  if (pct >= 70) return 'var(--accent-cyan)';
  if (pct >= 50) return 'var(--accent-purple)';
  if (pct >= 30) return 'var(--accent-magenta)';
  return 'var(--accent-rose)';
}

function animateResult() {
  const score = state.score;
  const pct = Math.round(score * 200); // 0-0.50 → 0-100
  const scoreInfo = getScoreLabel(score);

  // Animate gauge
  const gauge = $('#score-gauge');
  const valueEl = $('#score-value');
  const targetAngle = (pct / 100) * 280; // 280deg is full arc

  gauge.classList.add('animating');

  let currentPct = 0;
  const duration = 1500;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);

    currentPct = Math.round(eased * pct);
    valueEl.textContent = currentPct;
    gauge.style.setProperty('--current-angle', `${eased * targetAngle}deg`);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      // Show label and description
      $('#score-label').textContent = scoreInfo.label;
      $('#score-label').classList.add('visible');
      $('#score-description').textContent = scoreInfo.description;
      $('#score-description').classList.add('visible');

      // Show timeline
      showTimeline(score);

      // Show similar occupations
      showSimilar(score);
    }
  }

  requestAnimationFrame(tick);
}

function showSimilar(score) {
  const container = $('#similar-occupations');
  container.innerHTML = '';

  // Find 5 closest occupations
  const sorted = [...occupations].sort((a, b) =>
    Math.abs(a.score - score) - Math.abs(b.score - score)
  ).slice(0, 5);

  sorted.forEach(occ => {
    const pct = Math.round(occ.score * 200);
    const card = document.createElement('div');
    card.className = 'occupation-card';
    card.innerHTML = `
      <div class="occ-info">
        <div class="occ-title">${occ.title}</div>
        <div class="occ-bar-track">
          <div class="occ-bar-fill" style="width: ${pct}%; background: ${getScoreColor(pct)}"></div>
        </div>
      </div>
      <span class="occ-pct">${pct}%</span>
    `;
    container.appendChild(card);
  });

  $('#similar-section').classList.add('visible');
}

function showTimeline(score) {
  const timeline = getTimelineEstimate(score);

  // Set year labels
  $('#timeline-early').textContent = timeline.earlyYear;
  $('#timeline-mid').textContent = timeline.midYear;
  $('#timeline-late').textContent = timeline.lateYear;
  $('#timeline-outlook').textContent = timeline.outlook;

  // Position the range and marker on the track
  // Map years to 0-100% on a fixed axis (2026-2062)
  const axisStart = 2026;
  const axisEnd = 2062;
  const axisSpan = axisEnd - axisStart;

  const earlyPct = Math.max(0, Math.min(100, ((timeline.earlyYear - axisStart) / axisSpan) * 100));
  const midPct = Math.max(0, Math.min(100, ((timeline.midYear - axisStart) / axisSpan) * 100));
  const latePct = Math.max(0, Math.min(100, ((timeline.lateYear - axisStart) / axisSpan) * 100));

  const rangeEl = $('#timeline-range');
  const markerEl = $('#timeline-marker');

  rangeEl.style.left = `${earlyPct}%`;
  rangeEl.style.width = `${latePct - earlyPct}%`;
  markerEl.style.left = `${midPct}%`;

  // Position year labels
  $('#timeline-early').style.left = `${earlyPct}%`;
  $('#timeline-mid').style.left = `${midPct}%`;
  $('#timeline-late').style.left = `${latePct}%`;

  // Reveal with animation
  $('#timeline-section').classList.add('visible');
}

// ─── Occupation Explorer ─────────────────────────────────────────────────────
function populateOccupations() {
  renderOccupationList(occupations);
}

function filterOccupations(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    renderOccupationList(occupations);
    return;
  }

  const filtered = occupations.filter(o =>
    o.title.toLowerCase().includes(q) || o.soc.includes(q)
  );
  renderOccupationList(filtered);
}

function renderOccupationList(list) {
  const container = $('#occupation-list');
  // Virtual-ish rendering: only show first 50, expand on scroll
  const toShow = list.slice(0, 100);

  container.innerHTML = toShow.map(occ => {
    const pct = Math.round(occ.score * 200);
    return `
      <div class="occ-row">
        <span class="occ-row-title">${occ.title}</span>
        <div class="occ-row-bar">
          <div class="occ-row-fill" style="width: ${pct}%; background: ${getScoreColor(pct)}"></div>
        </div>
        <span class="occ-row-pct">${pct}%</span>
      </div>
    `;
  }).join('');

  if (list.length > 100) {
    container.insertAdjacentHTML('beforeend',
      `<div class="occ-row occ-more">${t.showingOf(100, list.length)}</div>`
    );
  }
  if (list.length === 0) {
    container.innerHTML = `<div class="occ-row occ-empty">${t.noOccupations}</div>`;
  }
}

// ─── Keyboard Navigation ────────────────────────────────────────────────────
function handleKeyboard(e) {
  if (state.currentScreen !== 'question') return;

  // Number keys 1-5 to select options
  const num = parseInt(e.key);
  if (num >= 1 && num <= 5) {
    selectOption(num - 1);
    return;
  }

  // A-E keys to select options
  const letter = e.key.toUpperCase();
  const letterIndex = letter.charCodeAt(0) - 65;
  if (letterIndex >= 0 && letterIndex < 5 && letter.length === 1) {
    selectOption(letterIndex);
    return;
  }

  // Arrow keys / Enter
  if (e.key === 'ArrowRight' || e.key === 'Enter') {
    goNext();
  } else if (e.key === 'ArrowLeft') {
    goBack();
  }
}

// ─── Persistence ─────────────────────────────────────────────────────────────
function saveProgress() {
  try {
    localStorage.setItem('wai-answers', JSON.stringify(state.answers));
    localStorage.setItem('wai-index', state.questionIndex.toString());
  } catch (e) { /* ignore */ }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem('wai-answers');
    const idx = localStorage.getItem('wai-index');
    if (saved) {
      state.answers = JSON.parse(saved);
      state.questionIndex = parseInt(idx) || 0;
    }
  } catch (e) { /* ignore */ }
}

function restart() {
  state.answers = new Array(questions.length).fill(null);
  state.questionIndex = 0;
  state.score = null;
  try {
    localStorage.removeItem('wai-answers');
    localStorage.removeItem('wai-index');
  } catch (e) { /* ignore */ }

  // Reset UI
  $('#score-gauge').classList.remove('animating');
  $('#score-gauge').style.setProperty('--current-angle', '0deg');
  $('#score-label').classList.remove('visible');
  $('#score-description').classList.remove('visible');
  $('#timeline-section').classList.remove('visible');
  $('#similar-section').classList.remove('visible');
  $('#occupation-explorer').classList.remove('open');
  $('#toggle-explorer').textContent = t.explorerOpen;

  renderQuestion();
  showScreen('question');
}

// ─── Boot ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
