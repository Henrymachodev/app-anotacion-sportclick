/**
 * Sport Click Stats - Main Application Controller
 * High-performance UI/UX interactive scoring application
 */

// Application State
let appState = null;
let currentTab = 'pitchers'; // pitchers | catchers | boxscore | playbyplay
let selectedPitchType = 'ball'; // For detailed mode
let editingLineupTeam = 'visitor'; // visitor | home

// DOM Elements cache
const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
  initDOMElements();
  initTheme();
  initUserSession();
  initGame();
  attachEventListeners();
  renderAll();
});

/**
 * Cache necessary DOM references
 */
function initDOMElements() {
  DOM.body = document.body;
  DOM.themeToggleBtn = document.getElementById('themeToggleBtn');
  DOM.themeIcon = document.getElementById('themeIcon');
  
  // Dual mode
  DOM.modeFastBtn = document.getElementById('modeFastBtn');
  DOM.modeDetailedBtn = document.getElementById('modeDetailedBtn');
  DOM.fastModeSection = document.getElementById('fastModeSection');
  DOM.detailedModeSection = document.getElementById('detailedModeSection');

  // User & Profile
  DOM.userBadgeBtn = document.getElementById('userBadgeBtn');
  DOM.userAvatarSm = document.getElementById('userAvatarSm');
  DOM.userNameSm = document.getElementById('userNameSm');
  DOM.profileModal = document.getElementById('profileModal');
  DOM.authModal = document.getElementById('authModal');
  DOM.quickDemoLoginBtn = document.getElementById('quickDemoLoginBtn');
  DOM.logoutBtn = document.getElementById('logoutBtn');

  // Scoreboard
  DOM.visitorCity = document.getElementById('visitorCity');
  DOM.visitorName = document.getElementById('visitorName');
  DOM.visitorLogo = document.getElementById('visitorLogo');
  DOM.visitorScore = document.getElementById('visitorScore');

  DOM.homeCity = document.getElementById('homeCity');
  DOM.homeName = document.getElementById('homeName');
  DOM.homeLogo = document.getElementById('homeLogo');
  DOM.homeScore = document.getElementById('homeScore');

  DOM.inningText = document.getElementById('inningText');
  DOM.inningArrow = document.getElementById('inningArrow');
  DOM.ballDots = document.getElementById('ballDots');
  DOM.strikeDots = document.getElementById('strikeDots');
  DOM.outDots = document.getElementById('outDots');

  DOM.currentBatterName = document.getElementById('currentBatterName');
  DOM.currentPitcherName = document.getElementById('currentPitcherName');
  DOM.currentPitchCount = document.getElementById('currentPitchCount');

  // Diamond & Runners
  DOM.base1 = document.getElementById('base-1');
  DOM.base2 = document.getElementById('base-2');
  DOM.base3 = document.getElementById('base-3');
  DOM.runnersList = document.getElementById('runnersList');

  // Strike zone (Detailed Mode)
  DOM.strikeZoneGrid = document.getElementById('strikeZoneGrid');
  DOM.pitchMarkersOverlay = document.getElementById('pitchMarkersOverlay');
  DOM.detailedPitchCount = document.getElementById('detailedPitchCount');

  // Play log & undo
  DOM.playLogList = document.getElementById('playLogList');
  DOM.undoPlayBtn = document.getElementById('undoPlayBtn');

  // Modals & Triggers
  DOM.newGameBtn = document.getElementById('newGameBtn');
  DOM.newGameModal = document.getElementById('newGameModal');
  DOM.newGameForm = document.getElementById('newGameForm');
  DOM.quickSampleGameBtn = document.getElementById('quickSampleGameBtn');

  DOM.editLineupBtn = document.getElementById('editLineupBtn');
  DOM.lineupModal = document.getElementById('lineupModal');
  DOM.lineupTabVis = document.getElementById('lineupTabVis');
  DOM.lineupTabHome = document.getElementById('lineupTabHome');
  DOM.lineupVisTeamLabel = document.getElementById('lineupVisTeamLabel');
  DOM.lineupHomeTeamLabel = document.getElementById('lineupHomeTeamLabel');
  DOM.lineupSpName = document.getElementById('lineupSpName');
  DOM.lineupSpNum = document.getElementById('lineupSpNum');
  DOM.lineupSpHand = document.getElementById('lineupSpHand');
  DOM.lineupCName = document.getElementById('lineupCName');
  DOM.lineupCNum = document.getElementById('lineupCNum');
  DOM.lineupRowsContainer = document.getElementById('lineupRowsContainer');
  DOM.fillSampleLineupBtn = document.getElementById('fillSampleLineupBtn');
  DOM.saveLineupBtn = document.getElementById('saveLineupBtn');

  // Bench and Substitutes Elements
  DOM.benchTeamLabel = document.getElementById('benchTeamLabel');
  DOM.benchPlayerName = document.getElementById('benchPlayerName');
  DOM.benchPlayerNum = document.getElementById('benchPlayerNum');
  DOM.benchPlayerRole = document.getElementById('benchPlayerRole');
  DOM.benchPlayerHand = document.getElementById('benchPlayerHand');
  DOM.addBenchPlayerBtn = document.getElementById('addBenchPlayerBtn');
  DOM.fillSampleBenchBtn = document.getElementById('fillSampleBenchBtn');
  DOM.benchRowsContainer = document.getElementById('benchRowsContainer');

  // Live Substitution Modal
  DOM.openSubModalBtn = document.getElementById('openSubModalBtn');
  DOM.substitutionModal = document.getElementById('substitutionModal');
  DOM.substitutionForm = document.getElementById('substitutionForm');
  DOM.subTeamSelect = document.getElementById('subTeamSelect');
  DOM.subTypeSelect = document.getElementById('subTypeSelect');
  DOM.subOutgoingLabel = document.getElementById('subOutgoingLabel');
  DOM.subOutgoingSelect = document.getElementById('subOutgoingSelect');
  DOM.subIncomingSelect = document.getElementById('subIncomingSelect');
  DOM.subManualName = document.getElementById('subManualName');
  DOM.subManualNum = document.getElementById('subManualNum');

  // Checkpoints
  DOM.quickCheckpointBtn = document.getElementById('quickCheckpointBtn');
  DOM.checkpointsListBtn = document.getElementById('checkpointsListBtn');
  DOM.checkpointsModal = document.getElementById('checkpointsModal');
  DOM.checkpointCustomNote = document.getElementById('checkpointCustomNote');
  DOM.modalSaveCheckpointBtn = document.getElementById('modalSaveCheckpointBtn');
  DOM.checkpointsListContainer = document.getElementById('checkpointsListContainer');

  // Supabase Cloud Elements
  DOM.supabaseConfigBtn = document.getElementById('supabaseConfigBtn');
  DOM.supabaseModal = document.getElementById('supabaseModal');
  DOM.supabaseConfigForm = document.getElementById('supabaseConfigForm');
  DOM.sbUrlInput = document.getElementById('sbUrlInput');
  DOM.sbKeyInput = document.getElementById('sbKeyInput');
  DOM.testSupabaseBtn = document.getElementById('testSupabaseBtn');
  DOM.sbTestStatus = document.getElementById('sbTestStatus');
  DOM.cloudStatusIcon = document.getElementById('cloudStatusIcon');

  DOM.importLeagueBtn = document.getElementById('importLeagueBtn');
  DOM.importModal = document.getElementById('importModal');
  DOM.historyBtn = document.getElementById('historyBtn');
  DOM.historyModal = document.getElementById('historyModal');
  DOM.saveGameBtn = document.getElementById('saveGameBtn');
  DOM.exportModalBtn = document.getElementById('exportModalBtn');
  DOM.exportModal = document.getElementById('exportModal');

  // Toast Container
  DOM.toastContainer = document.getElementById('toastContainer');
}

/**
 * Initialize theme (Dark / Light)
 */
function initTheme() {
  const savedTheme = StorageService.getTheme();
  if (savedTheme === 'light') {
    DOM.body.classList.add('light-theme');
    DOM.themeIcon.textContent = '☀️';
  } else {
    DOM.body.classList.remove('light-theme');
    DOM.themeIcon.textContent = '🌙';
  }
}

/**
 * Toggle Theme
 */
function toggleTheme() {
  const isLight = DOM.body.classList.toggle('light-theme');
  DOM.themeIcon.textContent = isLight ? '☀️' : '🌙';
  StorageService.setTheme(isLight ? 'light' : 'dark');
}

/**
 * Initialize User Session and Profile UI
 */
function initUserSession() {
  const gate = document.getElementById('loginGateScreen');
  if (!StorageService.isUserLoggedIn()) {
    if (gate) gate.style.display = 'flex';
    if (DOM.userNameSm) DOM.userNameSm.textContent = 'Ingresar';
    if (DOM.userAvatarSm) DOM.userAvatarSm.textContent = '🔒';
    return;
  }

  if (gate) gate.style.display = 'none';
  const user = StorageService.getUser();
  if (user && user.name) {
    const initials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('');
    if (DOM.userAvatarSm) DOM.userAvatarSm.textContent = initials;
    if (DOM.userNameSm) DOM.userNameSm.textContent = user.name;
  }
}

/**
 * Initialize or Resume Active Game
 */
function initGame() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_GAME);
    if (saved) {
      appState = JSON.parse(saved);
      showToast(`Partido en curso reanudado: ${appState.visitor.name} vs ${appState.home.name}`);
    } else {
      appState = BaseballEngine.createFreshGame('lvbp');
    }
  } catch (e) {
    appState = BaseballEngine.createFreshGame('lvbp');
  }

  // Restore scoring mode preference
  const mode = StorageService.getScoringMode();
  switchScoringMode(mode);
}

/**
 * Switch Scoring Mode (Fast vs Detailed)
 */
function switchScoringMode(mode) {
  StorageService.setScoringMode(mode);
  if (mode === 'detailed') {
    DOM.modeDetailedBtn.classList.add('active');
    DOM.modeFastBtn.classList.remove('active');
    DOM.fastModeSection.style.display = 'none';
    DOM.detailedModeSection.style.display = 'flex';
  } else {
    DOM.modeFastBtn.classList.add('active');
    DOM.modeDetailedBtn.classList.remove('active');
    DOM.fastModeSection.style.display = 'flex';
    DOM.detailedModeSection.style.display = 'none';
  }
}

/**
 * Event Listeners
 */
function attachEventListeners() {
  // Theme toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Scoring Mode Toggle
  DOM.modeFastBtn.addEventListener('click', () => switchScoringMode('fast'));
  DOM.modeDetailedBtn.addEventListener('click', () => switchScoringMode('detailed'));

  // User Profile & Auth
  DOM.userBadgeBtn.addEventListener('click', () => {
    if (!StorageService.isUserLoggedIn()) {
      const gate = document.getElementById('loginGateScreen');
      if (gate) gate.style.display = 'flex';
    } else {
      openProfileModal();
    }
  });

  DOM.quickDemoLoginBtn?.addEventListener('click', () => {
    StorageService.setUser(DEFAULT_USER);
    initUserSession();
    closeAllModals();
    showToast('¡Sesión iniciada con éxito como Anotador Oficial WBSC!');
  });

  DOM.logoutBtn?.addEventListener('click', () => {
    StorageService.logoutUser();
    closeAllModals();
    initUserSession();
    showToast('Sesión cerrada correctamente');
  });

  // Login Gate Interactions
  const gateLoginForm = document.getElementById('gateLoginForm');
  const gateUserField = document.getElementById('gateUserField');
  const gatePassField = document.getElementById('gatePassField');
  const gateErrorMsg = document.getElementById('gateErrorMsg');
  const gateQuickDemoBtn = document.getElementById('gateQuickDemoBtn');
  const gateTogglePassBtn = document.getElementById('gateTogglePassBtn');

  if (gateTogglePassBtn && gatePassField) {
    gateTogglePassBtn.addEventListener('click', () => {
      const isPass = gatePassField.type === 'password';
      gatePassField.type = isPass ? 'text' : 'password';
      gateTogglePassBtn.textContent = isPass ? '🔒' : '👁️';
    });
  }

  if (gateLoginForm) {
    gateLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userOrEmail = gateUserField.value.trim();
      const pass = gatePassField.value.trim();

      const authenticated = StorageService.authenticateUser(userOrEmail, pass);
      if (authenticated) {
        if (gateErrorMsg) gateErrorMsg.style.display = 'none';
        initUserSession();
        showToast(`¡Bienvenido(a), ${authenticated.name}!`);
      } else {
        if (gateErrorMsg) {
          gateErrorMsg.textContent = 'Usuario o contraseña incorrectos. Verifica tus datos o pide tu demo en el enlace inferior.';
          gateErrorMsg.style.display = 'block';
        }
      }
    });
  }

  if (gateQuickDemoBtn) {
    gateQuickDemoBtn.addEventListener('click', () => {
      const users = StorageService.getUsersList();
      const demoUser = users[0] || DEFAULT_USER;
      StorageService.setUser(demoUser);
      if (gateErrorMsg) gateErrorMsg.style.display = 'none';
      initUserSession();
      showToast(`¡Bienvenido(a), ${demoUser.name}!`);
    });
  }

  // Fast Mode Scoring Buttons
  document.querySelectorAll('[data-hit]').forEach(btn => {
    btn.addEventListener('click', () => handleHitAction(btn.dataset.hit));
  });

  document.querySelectorAll('[data-out]').forEach(btn => {
    btn.addEventListener('click', () => handleOutAction(btn.dataset.out));
  });

  document.querySelectorAll('[data-advance]').forEach(btn => {
    btn.addEventListener('click', () => handleAdvanceAction(btn.dataset.advance));
  });

  // Base Contextual Buttons
  document.querySelectorAll('[data-base-action]').forEach(btn => {
    btn.addEventListener('click', () => handleBaseAction(btn.dataset.baseAction));
  });

  // Detailed Mode Pitch Type Selectors
  document.querySelectorAll('[data-pitch-type]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-pitch-type]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPitchType = btn.dataset.pitchType;
    });
  });

  // Strike zone grid cell clicks
  document.querySelectorAll('.zone-cell, .outer-ball-zone').forEach(cell => {
    cell.addEventListener('click', () => {
      const quadName = cell.dataset.zone || cell.textContent.trim();
      handleStrikeZoneClick(quadName);
    });
  });

  // Undo button
  DOM.undoPlayBtn.addEventListener('click', handleUndoPlay);

  // Stats Navigation Tabs
  document.querySelectorAll('.stats-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.stats-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTab = btn.dataset.tab;
      renderStatsTab();
    });
  });

  // Battery Quick Buttons
  document.querySelectorAll('[data-battery-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.batteryAction;
      handleBaseAction(act);
    });
  });

  // Header Nav Modals
  DOM.newGameBtn?.addEventListener('click', openNewGameModal);
  DOM.newGameForm?.addEventListener('submit', handleNewGameSubmit);
  DOM.quickSampleGameBtn?.addEventListener('click', fillSampleGameForm);

  DOM.editLineupBtn?.addEventListener('click', () => openLineupModal('visitor'));
  DOM.lineupTabVis?.addEventListener('click', () => switchLineupTeamTab('visitor'));
  DOM.lineupTabHome?.addEventListener('click', () => switchLineupTeamTab('home'));
  DOM.fillSampleLineupBtn?.addEventListener('click', fillSampleLineup);
  DOM.saveLineupBtn?.addEventListener('click', saveCurrentLineup);

  // Bench events
  DOM.addBenchPlayerBtn?.addEventListener('click', addManualBenchPlayer);
  DOM.fillSampleBenchBtn?.addEventListener('click', fillSampleBench);

  // Live Substitution events
  DOM.openSubModalBtn?.addEventListener('click', openSubstitutionModal);
  DOM.subTeamSelect?.addEventListener('change', updateSubModalFields);
  DOM.subTypeSelect?.addEventListener('change', updateSubModalFields);
  DOM.substitutionForm?.addEventListener('submit', handleSubstitutionSubmit);

  // Checkpoint events
  DOM.quickCheckpointBtn?.addEventListener('click', () => saveCheckpoint());
  DOM.checkpointsListBtn?.addEventListener('click', openCheckpointsModal);
  DOM.modalSaveCheckpointBtn?.addEventListener('click', () => {
    const note = DOM.checkpointCustomNote?.value.trim();
    saveCheckpoint(note);
    if (DOM.checkpointCustomNote) DOM.checkpointCustomNote.value = '';
    renderCheckpointsList();
  });

  // Supabase Cloud events
  DOM.supabaseConfigBtn?.addEventListener('click', openSupabaseModal);
  DOM.testSupabaseBtn?.addEventListener('click', testSupabaseConnection);
  DOM.supabaseConfigForm?.addEventListener('submit', handleSaveSupabaseConfig);

  DOM.importLeagueBtn.addEventListener('click', openImportModal);
  DOM.historyBtn.addEventListener('click', openHistoryModal);
  DOM.saveGameBtn.addEventListener('click', saveCurrentGame);
  DOM.exportModalBtn.addEventListener('click', openExportModal);

  // Close modals on backdrop click or close buttons
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('btn-close-modal')) {
        closeAllModals();
      }
    });
  });

  // League Importer Preset buttons
  document.querySelectorAll('[data-preset-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.presetKey;
      document.getElementById('importUrlInput').value = `https://stats.wbsc.org/leagues/${key}/live-boxscore`;
    });
  });

  // Run scraper simulation
  document.getElementById('startScrapeBtn').addEventListener('click', runScraperSimulation);

  // Export options
  document.getElementById('exportJsonBtn').addEventListener('click', exportGameJSON);
  document.getElementById('exportPdfBtn').addEventListener('click', exportGamePDF);

  // Auth Form Submit
  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('authNameInput').value.trim() || 'Anotador Oficial';
    const license = document.getElementById('authLicenseInput').value.trim() || 'Licencia Registrada';
    const email = document.getElementById('authEmailInput').value.trim() || 'anotador@beisbol.com';
    StorageService.setUser({
      id: 'usr_' + Date.now(),
      name,
      license,
      email,
      role: 'Anotador Certificado'
    });
    initUserSession();
    closeAllModals();
    showToast(`Bienvenido(a), ${name}`);
  });
}

/**
 * Push current state to Undo Stack before any mutation
 */
function pushUndo() {
  if (!appState.undoStack) appState.undoStack = [];
  // Keep up to 20 undo steps
  const snapshot = JSON.stringify(appState);
  appState.undoStack.push(snapshot);
  if (appState.undoStack.length > 20) {
    appState.undoStack.shift();
  }
}

/**
 * Handle Hit Action
 */
function handleHitAction(hitType) {
  pushUndo();
  const result = BaseballEngine.processHit(appState, hitType);
  addPlayLog(result);
  StorageService.incrementMetrics(0, 0, 1);
  autosave();
  renderAll();
}

/**
 * Handle Out Action
 */
function handleOutAction(outType) {
  pushUndo();
  const result = BaseballEngine.processOut(appState, outType);
  addPlayLog(result);
  StorageService.incrementMetrics(0, result.inningSwitched ? 1 : 0, 1);
  autosave();
  renderAll();
}

/**
 * Handle Advance / Other
 */
function handleAdvanceAction(advType) {
  pushUndo();
  const result = BaseballEngine.processAdvance(appState, advType);
  addPlayLog(result);
  StorageService.incrementMetrics(0, 0, 1);
  autosave();
  renderAll();
}

/**
 * Handle Base Runner Events (SB, CS, PB, WP, Pickoff)
 */
function handleBaseAction(actionCode) {
  pushUndo();
  const result = BaseballEngine.processBaseEvent(appState, actionCode);
  addPlayLog(result);
  StorageService.incrementMetrics(0, 0, 1);
  autosave();
  renderAll();
}

/**
 * Handle Strike Zone click in Detailed Mode
 */
function handleStrikeZoneClick(quadrantName) {
  pushUndo();
  const result = BaseballEngine.recordDetailedPitch(appState, selectedPitchType, quadrantName);
  if (result) {
    addPlayLog(result);
    StorageService.incrementMetrics(0, 0, 1);
  }
  autosave();
  renderAll();
}

/**
 * Handle Undo
 */
function handleUndoPlay() {
  if (!appState.undoStack || appState.undoStack.length === 0) {
    showToast('No hay jugadas previas para deshacer');
    return;
  }
  const prevSnapshot = appState.undoStack.pop();
  try {
    const restored = JSON.parse(prevSnapshot);
    // Keep the remaining undoStack
    restored.undoStack = appState.undoStack;
    appState = restored;
    showToast('Última jugada deshecha exitosamente');
    autosave();
    renderAll();
  } catch (e) {
    console.error('Error restaurando estado:', e);
  }
}

/**
 * Add Play Log Item
 */
function addPlayLog(item) {
  const battingTeam = appState.isTopInning ? appState.visitor : appState.home;
  const inningLabel = `${appState.isTopInning ? '▲' : '▼'} ${appState.inning}ra`;

  const logEntry = {
    id: 'log-' + Date.now(),
    inning: inningLabel,
    type: item.type,
    title: item.title,
    desc: item.desc,
    badgeClass: item.badgeClass || 'badge-hit',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  };

  appState.playLog.unshift(logEntry);
  showToast(item.title);
}

/**
 * Autosave to LocalStorage and Cloud Supabase
 */
function autosave() {
  StorageService.saveGameToHistory(appState);
  if (typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured()) {
    SupabaseService.syncGame(appState);
  }
}

/**
 * Save game manual trigger
 */
function saveCurrentGame() {
  autosave();
  showToast('💾 Partido guardado correctamente en la base de datos local');
}

/**
 * Toast notifications
 */
function showToast(message) {
  if (!DOM.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>⚾</span> <span>${message}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/**
 * Main Render Pipeline
 */
function renderAll() {
  renderScoreboard();
  renderDiamond();
  renderCurrentMatchup();
  renderPlayLog();
  renderDetailedModePitchMarkers();
  renderStatsTab();
  updateCloudStatusIndicator();
}

/**
 * Render Hero Scoreboard Banner
 */
function renderScoreboard() {
  DOM.visitorCity.textContent = appState.visitor.city;
  DOM.visitorName.textContent = appState.visitor.name;
  DOM.visitorLogo.textContent = appState.visitor.logoBadge;
  DOM.visitorScore.textContent = appState.visitor.score;
  if (appState.visitor.primaryColor) {
    DOM.visitorLogo.style.background = appState.visitor.primaryColor;
  }

  DOM.homeCity.textContent = appState.home.city;
  DOM.homeName.textContent = appState.home.name;
  DOM.homeLogo.textContent = appState.home.logoBadge;
  DOM.homeScore.textContent = appState.home.score;
  if (appState.home.primaryColor) {
    DOM.homeLogo.style.background = appState.home.primaryColor;
  }

  DOM.inningText.textContent = `${appState.inning}ra`;
  DOM.inningArrow.textContent = appState.isTopInning ? '▲ Alta' : '▼ Baja';

  // Balls dots (0-3)
  let ballHtml = '';
  for (let i = 0; i < 3; i++) {
    ballHtml += `<div class="dot ${i < appState.balls ? 'active-ball' : ''}"></div>`;
  }
  DOM.ballDots.innerHTML = ballHtml;

  // Strike dots (0-2)
  let strikeHtml = '';
  for (let i = 0; i < 2; i++) {
    strikeHtml += `<div class="dot ${i < appState.strikes ? 'active-strike' : ''}"></div>`;
  }
  DOM.strikeDots.innerHTML = strikeHtml;

  // Out dots (0-2)
  let outHtml = '';
  for (let i = 0; i < 2; i++) {
    outHtml += `<div class="dot ${i < appState.outs ? 'active-out' : ''}"></div>`;
  }
  DOM.outDots.innerHTML = outHtml;
}

/**
 * Render Current Batter vs Pitcher Matchup
 */
function renderCurrentMatchup() {
  const battingTeam = appState.isTopInning ? appState.visitor : appState.home;
  const defendingTeam = appState.isTopInning ? appState.home : appState.visitor;

  const batter = battingTeam.lineup[battingTeam.currentBatterIdx];
  const pitcher = defendingTeam.startingPitcher;

  DOM.currentBatterName.textContent = `${batter.order}. #${batter.number} ${batter.name} (${batter.pos}) [${batter.h}-${batter.ab}, AVG ${batter.avg}]`;
  DOM.currentPitcherName.textContent = `#${pitcher.number} ${pitcher.name} (${pitcher.hand}) [ERA: ${pitcher.era}, WHIP: ${pitcher.whip}]`;
  
  const totalP = pitcher.pitches || 0;
  DOM.currentPitchCount.textContent = `${totalP} pitcheos`;
  if (DOM.detailedPitchCount) DOM.detailedPitchCount.textContent = `${totalP} lanzamientos`;

  // Update batter card in Column 3
  const batterSpotlight = document.getElementById('batterSpotlightInfo');
  if (batterSpotlight) {
    batterSpotlight.innerHTML = `
      <div class="batter-info-main">
        <div class="batter-jersey-badge">#${batter.number}</div>
        <div>
          <div style="font-weight:700; font-size:0.9rem;">${batter.name}</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${batter.pos} | Batea: ${batter.avg} | Hoy: ${batter.h}-${batter.ab}, ${batter.rbi} CI</div>
        </div>
      </div>
      <div style="text-align:right;">
        <span class="card-pill" style="border-color:var(--cyan); color:var(--cyan);">Al Bate</span>
      </div>
    `;
  }
}

/**
 * Render Diamond and Runner indicators
 */
function renderDiamond() {
  // Bases SVG cushions
  const b1Occupied = !!appState.bases.first;
  const b2Occupied = !!appState.bases.second;
  const b3Occupied = !!appState.bases.third;

  DOM.base1.classList.toggle('occupied', b1Occupied);
  DOM.base2.classList.toggle('occupied', b2Occupied);
  DOM.base3.classList.toggle('occupied', b3Occupied);

  // Runners list
  let html = '';
  const bases = [
    { name: '1B', runner: appState.bases.first },
    { name: '2B', runner: appState.bases.second },
    { name: '3B', runner: appState.bases.third }
  ];

  bases.forEach(b => {
    if (b.runner) {
      html += `
        <div class="runner-status-item active-base">
          <span class="runner-base-tag">${b.name}</span>
          <span class="runner-name-text">#${b.runner.number} ${b.runner.name}</span>
          <span style="font-size:0.7rem; color:var(--amber); font-weight:700;">EN BASE</span>
        </div>
      `;
    } else {
      html += `
        <div class="runner-status-item">
          <span class="runner-base-tag">${b.name}</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">Desocupada</span>
          <span>-</span>
        </div>
      `;
    }
  });

  DOM.runnersList.innerHTML = html;
}

/**
 * Render Detailed Mode Pitch Markers Overlay
 */
function renderDetailedModePitchMarkers() {
  if (!DOM.pitchMarkersOverlay) return;
  DOM.pitchMarkersOverlay.innerHTML = '';

  if (!appState.currentPitches || appState.currentPitches.length === 0) return;

  appState.currentPitches.forEach((p, idx) => {
    const dot = document.createElement('div');
    dot.className = `pitch-marker-dot type-${p.pitchType}`;
    dot.textContent = idx + 1;
    // Distribute randomly or based on quadrant inside strike zone
    let top = 50;
    let left = 50;
    if (p.quadrant === '1') { top = 20; left = 20; }
    else if (p.quadrant === '2') { top = 20; left = 50; }
    else if (p.quadrant === '3') { top = 20; left = 80; }
    else if (p.quadrant === '4') { top = 50; left = 20; }
    else if (p.quadrant === '5') { top = 50; left = 50; }
    else if (p.quadrant === '6') { top = 50; left = 80; }
    else if (p.quadrant === '7') { top = 80; left = 20; }
    else if (p.quadrant === '8') { top = 80; left = 50; }
    else if (p.quadrant === '9') { top = 80; left = 80; }
    else {
      top = Math.random() * 80 + 10;
      left = Math.random() * 80 + 10;
    }
    dot.style.top = `${top}%`;
    dot.style.left = `${left}%`;
    DOM.pitchMarkersOverlay.appendChild(dot);
  });
}

/**
 * Render Play-by-Play Narrative Feed
 */
function renderPlayLog() {
  if (!DOM.playLogList) return;
  DOM.playLogList.innerHTML = '';

  appState.playLog.slice(0, 15).forEach(item => {
    const row = document.createElement('div');
    row.className = 'play-log-item';
    row.innerHTML = `
      <span class="play-log-badge ${item.badgeClass}">${item.inning}</span>
      <div class="play-log-text">
        <div style="font-weight:700; color:var(--text-primary);">${item.title}</div>
        <div>${item.desc}</div>
      </div>
      <span class="play-log-time">${item.timestamp}</span>
    `;
    DOM.playLogList.appendChild(row);
  });
}

/**
 * Render Specialized Statistics Tabs (Pitchers, Catchers, Boxscore, PlayByPlay)
 */
function renderStatsTab() {
  const container = document.getElementById('statsTabContent');
  if (!container) return;

  if (currentTab === 'pitchers') {
    container.innerHTML = generatePitchersTableHTML();
  } else if (currentTab === 'catchers') {
    container.innerHTML = generateCatchersTableHTML();
  } else if (currentTab === 'boxscore') {
    container.innerHTML = generateBoxScoreHTML();
  } else if (currentTab === 'playbyplay') {
    container.innerHTML = generateFullPlayLogHTML();
  }
}

/**
 * Pitchers Table HTML
 */
function generatePitchersTableHTML() {
  const vP = appState.visitor.startingPitcher;
  const hP = appState.home.startingPitcher;

  return `
    <div class="table-responsive-wrapper">
      <table class="stats-data-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Lanzador</th>
            <th>IP</th>
            <th>H</th>
            <th>C</th>
            <th>CL</th>
            <th>BB</th>
            <th>K/SO</th>
            <th>HR</th>
            <th>PC</th>
            <th>ERA (En vivo)</th>
            <th>WHIP</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${appState.visitor.abbreviation}</strong></td>
            <td><strong>#${vP.number} ${vP.name}</strong> (${vP.hand})</td>
            <td>${vP.ip}</td>
            <td>${vP.h}</td>
            <td>${vP.r}</td>
            <td>${vP.er}</td>
            <td>${vP.bb}</td>
            <td>${vP.so}</td>
            <td>${vP.hr}</td>
            <td><strong>${vP.pitches}</strong></td>
            <td class="highlight-stat">${vP.era}</td>
            <td class="highlight-stat">${vP.whip}</td>
          </tr>
          <tr>
            <td><strong>${appState.home.abbreviation}</strong></td>
            <td><strong>#${hP.number} ${hP.name}</strong> (${hP.hand})</td>
            <td>${hP.ip}</td>
            <td>${hP.h}</td>
            <td>${hP.r}</td>
            <td>${hP.er}</td>
            <td>${hP.bb}</td>
            <td>${hP.so}</td>
            <td>${hP.hr}</td>
            <td><strong>${hP.pitches}</strong></td>
            <td class="highlight-stat">${hP.era}</td>
            <td class="highlight-stat">${hP.whip}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Catchers Table HTML
 */
function generateCatchersTableHTML() {
  const vC = appState.visitor.startingCatcher;
  const hC = appState.home.startingCatcher;

  return `
    <div class="battery-quick-bar">
      <span class="battery-label">Batería Rápida Receptores:</span>
      <button class="btn-battery" data-battery-action="CS">+CS (Out en intento de robo)</button>
      <button class="btn-battery" data-battery-action="SB">+SB (Robo concedido)</button>
      <button class="btn-battery" data-battery-action="PB">+PB (Pasbol)</button>
    </div>
    <div class="table-responsive-wrapper">
      <table class="stats-data-table">
        <thead>
          <tr>
            <th>Equipo</th>
            <th>Receptor (Catcher)</th>
            <th>Innings Detrás del Plato</th>
            <th>CS (Retirados)</th>
            <th>SB (Permitidas)</th>
            <th>CS% (Efectividad)</th>
            <th>PB (Pasbol)</th>
            <th>E (Errores)</th>
            <th>CERA (Efectividad con Pitchers)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${appState.visitor.abbreviation}</strong></td>
            <td><strong>#${vC.number} ${vC.name}</strong></td>
            <td>${vC.innings}</td>
            <td style="color:var(--emerald); font-weight:700;">${vC.cs || 0}</td>
            <td style="color:var(--crimson); font-weight:700;">${vC.sb || 0}</td>
            <td class="highlight-stat">${vC.csPct}</td>
            <td>${vC.pb || 0}</td>
            <td>${vC.e || 0}</td>
            <td class="highlight-stat">${vC.cera}</td>
          </tr>
          <tr>
            <td><strong>${appState.home.abbreviation}</strong></td>
            <td><strong>#${hC.number} ${hC.name}</strong></td>
            <td>${hC.innings}</td>
            <td style="color:var(--emerald); font-weight:700;">${hC.cs || 0}</td>
            <td style="color:var(--crimson); font-weight:700;">${hC.sb || 0}</td>
            <td class="highlight-stat">${hC.csPct}</td>
            <td>${hC.pb || 0}</td>
            <td>${hC.e || 0}</td>
            <td class="highlight-stat">${hC.cera}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Traditional Box Score Table HTML (Line Score & Batter Rosters)
 */
function generateBoxScoreHTML() {
  // Inning line scores
  let lineScoreHeaders = '';
  for (let i = 1; i <= 9; i++) lineScoreHeaders += `<th style="text-align:center;">${i}</th>`;

  let visitorLineCells = '';
  let homeLineCells = '';
  for (let i = 0; i < 9; i++) {
    visitorLineCells += `<td style="text-align:center;">${appState.visitor.lineScore[i] ?? '-'}</td>`;
    homeLineCells += `<td style="text-align:center;">${appState.home.lineScore[i] ?? '-'}</td>`;
  }

  // Batter rows helper
  const renderBatters = (team) => {
    return team.lineup.map(b => `
      <tr>
        <td>${b.order}</td>
        <td><strong>#${b.number} ${b.name}</strong></td>
        <td><span class="card-pill">${b.pos}</span></td>
        <td>${b.ab}</td>
        <td>${b.r}</td>
        <td style="font-weight:700; color:var(--emerald);">${b.h}</td>
        <td>${b['2b']}</td>
        <td>${b['3b']}</td>
        <td>${b.hr}</td>
        <td><strong>${b.rbi}</strong></td>
        <td>${b.bb}</td>
        <td>${b.so}</td>
        <td class="highlight-stat">${b.avg}</td>
        <td>${b.obp || '.000'}</td>
        <td>${b.slg || '.000'}</td>
      </tr>
    `).join('');
  };

  return `
    <div style="margin-bottom: 1.25rem;">
      <h4 style="font-size:0.85rem; font-weight:700; text-transform:uppercase; margin-bottom:0.4rem; color:var(--text-muted);">
        Anotación por Entradas (Line Score)
      </h4>
      <div class="table-responsive-wrapper">
        <table class="stats-data-table" style="text-align:center;">
          <thead>
            <tr>
              <th style="text-align:left;">Equipo</th>
              ${lineScoreHeaders}
              <th>C</th>
              <th>H</th>
              <th>E</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="text-align:left;"><strong>${appState.visitor.name}</strong></td>
              ${visitorLineCells}
              <td style="font-weight:800; color:var(--cyan);">${appState.visitor.score}</td>
              <td>${appState.visitor.hits}</td>
              <td>${appState.visitor.errors}</td>
            </tr>
            <tr>
              <td style="text-align:left;"><strong>${appState.home.name}</strong></td>
              ${homeLineCells}
              <td style="font-weight:800; color:var(--cyan);">${appState.home.score}</td>
              <td>${appState.home.hits}</td>
              <td>${appState.home.errors}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
      <div>
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--cyan); margin-bottom:0.4rem;">
          Alineación ${appState.visitor.name} (Visitante)
        </h4>
        <div class="table-responsive-wrapper">
          <table class="stats-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bateador</th>
                <th>Pos</th>
                <th>AB</th>
                <th>C</th>
                <th>H</th>
                <th>2B</th>
                <th>3B</th>
                <th>HR</th>
                <th>CI</th>
                <th>BB</th>
                <th>SO</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
              </tr>
            </thead>
            <tbody>${renderBatters(appState.visitor)}</tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 style="font-size:0.85rem; font-weight:700; color:var(--cyan); margin-bottom:0.4rem;">
          Alineación ${appState.home.name} (Home Club)
        </h4>
        <div class="table-responsive-wrapper">
          <table class="stats-data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Bateador</th>
                <th>Pos</th>
                <th>AB</th>
                <th>C</th>
                <th>H</th>
                <th>2B</th>
                <th>3B</th>
                <th>HR</th>
                <th>CI</th>
                <th>BB</th>
                <th>SO</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
              </tr>
            </thead>
            <tbody>${renderBatters(appState.home)}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/**
 * Full Chronological Play-by-Play HTML
 */
function generateFullPlayLogHTML() {
  return `
    <div class="play-log-container" style="max-height: 450px;">
      ${appState.playLog.map(item => `
        <div class="play-log-item">
          <span class="play-log-badge ${item.badgeClass}">${item.inning}</span>
          <div class="play-log-text">
            <div style="font-weight:700; color:var(--text-primary); font-size:0.85rem;">${item.title}</div>
            <div style="color:var(--text-secondary);">${item.desc}</div>
          </div>
          <span class="play-log-time">${item.timestamp}</span>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Profile Modal Open
 */
function openProfileModal() {
  const user = StorageService.getUser();
  const metrics = StorageService.getMetrics();

  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileLicense').textContent = user.license;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileRole').textContent = user.role;

  document.getElementById('metricGames').textContent = metrics.gamesScored;
  document.getElementById('metricInnings').textContent = metrics.inningsLogged;
  document.getElementById('metricPlays').textContent = metrics.playsProcessed;

  DOM.profileModal.classList.add('open');
}

/**
 * Auth Modal Open
 */
function openAuthModal() {
  DOM.authModal.classList.add('open');
}

/**
 * History Modal Open
 */
function openHistoryModal() {
  const historyList = StorageService.getGamesHistory();
  const container = document.getElementById('historyGamesContainer');
  if (!container) return;

  if (historyList.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 2rem; color:var(--text-muted);">
        No hay partidos guardados aún. Guarda el partido actual en cualquier momento.
      </div>
    `;
  } else {
    container.innerHTML = historyList.map(g => `
      <div class="history-game-card">
        <div>
          <div class="history-meta-title">
            ${g.visitor.logoBadge} ${g.visitor.name} (${g.visitor.score}) vs ${g.home.name} (${g.home.score}) ${g.home.logoBadge}
          </div>
          <div class="history-meta-subtitle">
            ${g.leagueName || 'Liga Oficial'} • Inning: ${g.inning} (${g.status}) • Guardado: ${new Date(g.savedAt).toLocaleDateString()}
          </div>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn-nav btn-primary" onclick="resumeGame('${g.id}')">Reanudar</button>
          <button class="btn-nav" style="border-color:var(--crimson); color:var(--crimson);" onclick="deleteGameEntry('${g.id}')">Eliminar</button>
        </div>
      </div>
    `).join('');
  }

  DOM.historyModal.classList.add('open');
}

/**
 * Resume Game
 */
window.resumeGame = function(gameId) {
  const loaded = StorageService.getGameById(gameId);
  if (loaded) {
    appState = loaded;
    closeAllModals();
    showToast(`Partido reanudado: ${appState.visitor.name} vs ${appState.home.name}`);
    renderAll();
  }
};

/**
 * Delete Game Entry
 */
window.deleteGameEntry = function(gameId) {
  if (confirm('¿Estás seguro de que deseas eliminar este partido del historial?')) {
    StorageService.deleteGame(gameId);
    openHistoryModal();
    showToast('Partido eliminado del historial');
  }
};

/**
 * Import Modal Open
 */
function openImportModal() {
  DOM.importModal.classList.add('open');
}

/**
 * Scraper Simulator
 */
function runScraperSimulation() {
  const progressCard = document.getElementById('scraperProgressCard');
  const bar = document.getElementById('scraperProgressBar');
  const log = document.getElementById('scraperLogList');
  const startBtn = document.getElementById('startScrapeBtn');

  const selectedUrl = document.getElementById('importUrlInput').value.trim();
  let presetKey = 'lvbp';
  if (selectedUrl.includes('mlb')) presetKey = 'mlb';
  else if (selectedUrl.includes('wbsc')) presetKey = 'wbsc';
  else if (selectedUrl.includes('lmb')) presetKey = 'lmb';

  progressCard.classList.add('active');
  startBtn.disabled = true;
  bar.style.width = '0%';
  log.innerHTML = '';

  const steps = [
    { p: 25, msg: '🛰️ [1/4] Conectando con servidor de torneo y validando URL...' },
    { p: 55, msg: '📦 [2/4] Extrayendo metadatos de equipos, colores y logos oficiales...' },
    { p: 85, msg: '👥 [3/4] Parseando rosters activos, dorsales y estadísticas de la serie...' },
    { p: 100, msg: '⚾ [4/4] Configurando alineación titular 1-9, abridor y receptor!' }
  ];

  let stepIdx = 0;
  const interval = setInterval(() => {
    if (stepIdx < steps.length) {
      const step = steps[stepIdx];
      bar.style.width = `${step.p}%`;
      const item = document.createElement('div');
      item.textContent = step.msg;
      log.appendChild(item);
      log.scrollTop = log.scrollHeight;
      stepIdx++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        appState = BaseballEngine.createFreshGame(presetKey);
        closeAllModals();
        startBtn.disabled = false;
        progressCard.classList.remove('active');
        showToast(`¡Liga importada con éxito! ${appState.leagueName}`);
        StorageService.incrementMetrics(1, 0, 0);
        autosave();
        renderAll();
      }, 700);
    }
  }, 650);
}

/**
 * Export Modal Open
 */
function openExportModal() {
  DOM.exportModal.classList.add('open');
}

/**
 * Export JSON Game Data
 */
function exportGameJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const dlAnchorElem = document.createElement('a');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", `SportClickStats_${appState.visitor.abbreviation}_vs_${appState.home.abbreviation}_${Date.now()}.json`);
  dlAnchorElem.click();
  showToast('Box Score exportado en JSON con éxito');
  closeAllModals();
}

/**
 * Export PDF / Printable View
 */
function exportGamePDF() {
  closeAllModals();
  // Switch to box score tab so the full stats appear in the printout
  currentTab = 'boxscore';
  renderStatsTab();
  setTimeout(() => {
    window.print();
  }, 300);
}

/**
 * Close all modal overlays
 */
function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
}

/**
 * Open New Game Modal
 */
function openNewGameModal() {
  const dateInput = document.getElementById('gameDateInput');
  if (dateInput) {
    dateInput.value = new Date().toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }
  DOM.newGameModal.classList.add('open');
}

/**
 * Pre-fill sample local teams
 */
function fillSampleGameForm() {
  document.getElementById('gameLeagueInput').value = 'Liga Venezolana (LVBP)';
  document.getElementById('gameVenueInput').value = 'Estadio Universitario de Caracas';
  document.getElementById('visCityInput').value = 'Tiburones de';
  document.getElementById('visNameInput').value = 'La Guaira';
  document.getElementById('visAbbrInput').value = 'LAG';
  document.getElementById('visColorInput').value = '#0284C7';
  document.getElementById('visLogoInput').value = '🦈';

  document.getElementById('homeCityInput').value = 'Bravos de';
  document.getElementById('homeNameInput').value = 'Margarita';
  document.getElementById('homeAbbrInput').value = 'BRA';
  document.getElementById('homeColorInput').value = '#059669';
  document.getElementById('homeLogoInput').value = '🏹';
  showToast('Plantilla de ejemplo cargada');
}

/**
 * Handle New Game Creation Form Submission
 */
function handleNewGameSubmit(e) {
  e.preventDefault();

  const league = document.getElementById('gameLeagueInput').value.trim() || 'Liga Oficial';
  const venue = document.getElementById('gameVenueInput').value.trim() || 'Estadio Central';
  const date = document.getElementById('gameDateInput').value.trim() || 'Hoy';
  const innings = document.getElementById('gameInningsInput').value;

  const visCity = document.getElementById('visCityInput').value.trim() || 'Equipo';
  const visName = document.getElementById('visNameInput').value.trim() || 'Visitante';
  const visAbbr = document.getElementById('visAbbrInput').value.trim() || 'VIS';
  const visColor = document.getElementById('visColorInput').value;
  const visLogo = document.getElementById('visLogoInput').value.trim() || '✈️';

  const homeCity = document.getElementById('homeCityInput').value.trim() || 'Equipo';
  const homeName = document.getElementById('homeNameInput').value.trim() || 'Home Club';
  const homeAbbr = document.getElementById('homeAbbrInput').value.trim() || 'HOM';
  const homeColor = document.getElementById('homeColorInput').value;
  const homeLogo = document.getElementById('homeLogoInput').value.trim() || '🏠';

  appState = BaseballEngine.createCustomGame({
    league,
    venue,
    date,
    innings,
    visCity, visName, visAbbr, visColor, visLogo,
    homeCity, homeName, homeAbbr, homeColor, homeLogo
  });

  closeAllModals();
  StorageService.incrementMetrics(1, 0, 0);
  autosave();
  renderAll();

  // Prompt user to immediately configure lineups & rosters
  openLineupModal('visitor');
  showToast(`¡Partido creado! Ahora personaliza el lineup de ${appState.visitor.name}`);
}

/**
 * Open Lineup & Rosters Modal
 */
function openLineupModal(team = 'visitor') {
  editingLineupTeam = team;
  switchLineupTeamTab(team);
  DOM.lineupModal.classList.add('open');
}

/**
 * Switch team tab inside Lineup Editor
 */
function switchLineupTeamTab(team) {
  editingLineupTeam = team;
  if (team === 'visitor') {
    DOM.lineupTabVis.classList.add('active');
    DOM.lineupTabHome.classList.remove('active');
  } else {
    DOM.lineupTabHome.classList.add('active');
    DOM.lineupTabVis.classList.remove('active');
  }

  DOM.lineupVisTeamLabel.textContent = appState.visitor.name;
  DOM.lineupHomeTeamLabel.textContent = appState.home.name;

  const currentTeamObj = team === 'visitor' ? appState.visitor : appState.home;
  const p = currentTeamObj.startingPitcher;
  const c = currentTeamObj.startingCatcher;

  DOM.lineupSpName.value = p ? p.name : '';
  DOM.lineupSpNum.value = p ? p.number : '';
  DOM.lineupSpHand.value = p ? (p.hand || 'R') : 'R';

  DOM.lineupCName.value = c ? c.name : '';
  DOM.lineupCNum.value = c ? c.number : '';

  if (DOM.benchTeamLabel) {
    DOM.benchTeamLabel.textContent = currentTeamObj.name;
  }

  renderLineupRows(currentTeamObj.lineup);
  renderBenchRows(currentTeamObj.bench || []);
}

/**
 * Render 9 lineup table rows with inputs
 */
function renderLineupRows(lineup) {
  const positions = ['CF', '2B', '3B', 'C', 'RF', '1B', 'SS', 'LF', 'DH', 'P'];
  let html = '';

  for (let i = 0; i < 9; i++) {
    const player = (lineup && lineup[i]) ? lineup[i] : {
      order: i + 1,
      name: `Bateador ${i + 1}`,
      number: (i + 1) * 7 % 99,
      pos: positions[i % positions.length]
    };

    const posOptions = positions.map(pos =>
      `<option value="${pos}" ${player.pos === pos ? 'selected' : ''}>${pos}</option>`
    ).join('');

    html += `
      <tr data-row-idx="${i}">
        <td style="text-align:center;">
          <div class="order-badge-cell">${i + 1}</div>
        </td>
        <td>
          <input type="text" class="lineup-input input-player-name" value="${player.name}" placeholder="Nombre del bateador" required>
        </td>
        <td>
          <input type="number" class="lineup-input input-player-number" min="0" max="99" value="${player.number || (i + 1)}" placeholder="#">
        </td>
        <td>
          <select class="lineup-select input-player-pos" style="width:100%;">
            ${posOptions}
          </select>
        </td>
      </tr>
    `;
  }

  DOM.lineupRowsContainer.innerHTML = html;
}

/**
 * Pre-fill sample roster names
 */
function fillSampleLineup() {
  const isVis = editingLineupTeam === 'visitor';
  const sampleNamesVis = [
    { name: "Ronald Acuña Jr.", num: 13, pos: "RF" },
    { name: "Maikel García", num: 17, pos: "3B" },
    { name: "Yasiel Puig", num: 66, pos: "LF" },
    { name: "Danry Vásquez", num: 9, pos: "DH" },
    { name: "Leonardo Reginatto", num: 34, pos: "1B" },
    { name: "Wilson García", num: 44, pos: "C" },
    { name: "Alcides Escobar", num: 2, pos: "2B" },
    { name: "Brayan Rocchio", num: 10, pos: "SS" },
    { name: "Lorenzo Cedrola", num: 7, pos: "CF" }
  ];

  const sampleNamesHome = [
    { name: "Breyvic Valera", num: 4, pos: "2B" },
    { name: "Ramón Flores", num: 12, pos: "CF" },
    { name: "David Rodríguez", num: 24, pos: "DH" },
    { name: "Carlos Pérez", num: 33, pos: "1B" },
    { name: "Moisés Gómez", num: 19, pos: "RF" },
    { name: "Wilson Ramos", num: 55, pos: "C" },
    { name: "Alberto González", num: 8, pos: "3B" },
    { name: "José Martínez", num: 15, pos: "LF" },
    { name: "Alí Castillo", num: 3, pos: "SS" }
  ];

  const list = isVis ? sampleNamesVis : sampleNamesHome;
  const rows = DOM.lineupRowsContainer.querySelectorAll('tr');

  rows.forEach((tr, idx) => {
    if (list[idx]) {
      tr.querySelector('.input-player-name').value = list[idx].name;
      tr.querySelector('.input-player-number').value = list[idx].num;
      tr.querySelector('.input-player-pos').value = list[idx].pos;
    }
  });

  if (isVis) {
    DOM.lineupSpName.value = "Ricardo Pinto";
    DOM.lineupSpNum.value = 51;
    DOM.lineupCName.value = "Wilson García";
    DOM.lineupCNum.value = 44;
  } else {
    DOM.lineupSpName.value = "Félix Doubront";
    DOM.lineupSpNum.value = 22;
    DOM.lineupCName.value = "Wilson Ramos";
    DOM.lineupCNum.value = 55;
  }

  showToast('Alineación completada con plantilla');
}

/**
 * Save Lineup & Rosters for Active Team
 */
function saveCurrentLineup() {
  const currentTeamObj = editingLineupTeam === 'visitor' ? appState.visitor : appState.home;

  // Pitcher
  const spName = DOM.lineupSpName.value.trim() || 'Abridor';
  const spNum = parseInt(DOM.lineupSpNum.value, 10) || 1;
  const spHand = DOM.lineupSpHand.value || 'R';

  currentTeamObj.startingPitcher.name = spName;
  currentTeamObj.startingPitcher.number = spNum;
  currentTeamObj.startingPitcher.hand = spHand;

  // Catcher
  const cName = DOM.lineupCName.value.trim() || 'Receptor';
  const cNum = parseInt(DOM.lineupCNum.value, 10) || 2;

  currentTeamObj.startingCatcher.name = cName;
  currentTeamObj.startingCatcher.number = cNum;

  // 9 Lineup rows
  const rows = DOM.lineupRowsContainer.querySelectorAll('tr');
  const newLineup = [];

  rows.forEach((tr, idx) => {
    const order = idx + 1;
    const name = tr.querySelector('.input-player-name').value.trim() || `Bateador ${order}`;
    const num = parseInt(tr.querySelector('.input-player-number').value, 10) || order;
    const pos = tr.querySelector('.input-player-pos').value || 'DH';

    // Preserve existing cumulative stats if player index matches
    const prev = currentTeamObj.lineup && currentTeamObj.lineup[idx];
    newLineup.push({
      id: `${editingLineupTeam}-${order}`,
      order,
      name,
      number: num,
      pos,
      ab: prev ? prev.ab : 0,
      r: prev ? prev.r : 0,
      h: prev ? prev.h : 0,
      '2b': prev ? prev['2b'] : 0,
      '3b': prev ? prev['3b'] : 0,
      hr: prev ? prev.hr : 0,
      rbi: prev ? prev.rbi : 0,
      bb: prev ? prev.bb : 0,
      so: prev ? prev.so : 0,
      avg: prev ? prev.avg : '.000',
      obp: prev ? prev.obp : '.000',
      slg: prev ? prev.slg : '.000'
    });
  });

  currentTeamObj.lineup = newLineup;

  autosave();
  renderAll();

  if (editingLineupTeam === 'visitor') {
    showToast(`✅ Alineación de ${currentTeamObj.name} guardada. Configura ahora Home Club.`);
    switchLineupTeamTab('home');
  } else {
    showToast(`✅ Alineación de ${currentTeamObj.name} guardada correctamente.`);
    closeAllModals();
  }
}

/**
 * Render Bench / Substitutes table rows
 */
function renderBenchRows(bench) {
  if (!DOM.benchRowsContainer) return;
  if (!bench || bench.length === 0) {
    DOM.benchRowsContainer.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:var(--text-muted); padding:1rem;">
          No hay sustitutos registrados en la banca. Puedes agregarlos arriba o cargar ejemplos.
        </td>
      </tr>
    `;
    return;
  }

  DOM.benchRowsContainer.innerHTML = bench.map((sub, idx) => `
    <tr>
      <td style="text-align:center; font-weight:700; color:var(--text-muted);">${idx + 1}</td>
      <td><strong>${sub.name}</strong></td>
      <td>#${sub.number}</td>
      <td><span class="substitute-badge-pill">${sub.role || sub.pos || 'Reserva'}</span></td>
      <td>${sub.hand || 'R'}</td>
      <td style="text-align:center;">
        <button type="button" class="btn-nav" style="padding:0.2rem 0.5rem; font-size:0.75rem; border-color:var(--crimson); color:var(--crimson);" onclick="window.deleteBenchPlayer(${idx})">
          ✕
        </button>
      </td>
    </tr>
  `).join('');
}

/**
 * Add Manual Bench Player
 */
function addManualBenchPlayer() {
  const currentTeamObj = editingLineupTeam === 'visitor' ? appState.visitor : appState.home;
  if (!currentTeamObj.bench) currentTeamObj.bench = [];

  const name = DOM.benchPlayerName.value.trim();
  const num = parseInt(DOM.benchPlayerNum.value, 10);
  const role = DOM.benchPlayerRole.value;
  const hand = DOM.benchPlayerHand.value;

  if (!name) {
    showToast('Ingresa el nombre del sustituto');
    return;
  }

  currentTeamObj.bench.push({
    id: 'sub_' + Date.now(),
    name,
    number: isNaN(num) ? (currentTeamObj.bench.length + 10) : num,
    role,
    pos: role,
    hand
  });

  DOM.benchPlayerName.value = '';
  DOM.benchPlayerNum.value = '';

  renderBenchRows(currentTeamObj.bench);
  autosave();
  showToast(`Sustituto ${name} agregado a la banca de ${currentTeamObj.name}`);
}

/**
 * Pre-fill Sample Bench
 */
function fillSampleBench() {
  const currentTeamObj = editingLineupTeam === 'visitor' ? appState.visitor : appState.home;
  const isVis = editingLineupTeam === 'visitor';

  const samples = isVis ? [
    { id: 'b-v1', name: 'Romer Cuadrado', number: 18, pos: 'OF', role: 'PH (Emergente)', hand: 'R' },
    { id: 'b-v2', name: 'José Gómez', number: 3, pos: 'INF', role: 'PR (Corredor)', hand: 'R' },
    { id: 'b-v3', name: 'Anthony Vizcaya', number: 38, pos: 'RP', role: 'RP (Relevista)', hand: 'R' },
    { id: 'b-v4', name: 'René Pinto', number: 50, pos: 'C', role: 'C (Receptor)', hand: 'R' }
  ] : [
    { id: 'b-h1', name: 'César Hernández', number: 16, pos: 'INF', role: 'PH (Emergente)', hand: 'S' },
    { id: 'b-h2', name: 'Carlos Tocci', number: 33, pos: 'OF', role: 'PR (Corredor)', hand: 'R' },
    { id: 'b-h3', name: 'Miguel Socolovich', number: 45, pos: 'RP', role: 'RP (Relevista)', hand: 'R' },
    { id: 'b-h4', name: 'Jhonny Pereda', number: 38, pos: 'C', role: 'C (Receptor)', hand: 'R' }
  ];

  currentTeamObj.bench = samples;
  renderBenchRows(currentTeamObj.bench);
  autosave();
  showToast(`Sustitutos de ejemplo cargados para ${currentTeamObj.name}`);
}

/**
 * Delete single bench player
 */
window.deleteBenchPlayer = function(idx) {
  const currentTeamObj = editingLineupTeam === 'visitor' ? appState.visitor : appState.home;
  if (currentTeamObj.bench && currentTeamObj.bench[idx]) {
    currentTeamObj.bench.splice(idx, 1);
    renderBenchRows(currentTeamObj.bench);
    autosave();
  }
};

/**
 * Open Live Substitution Modal
 */
function openSubstitutionModal() {
  if (!DOM.subTeamSelect) return;

  const visBatting = appState.isTopInning;
  DOM.subTeamSelect.innerHTML = `
    <option value="visitor">${appState.visitor.name} (${visBatting ? 'Al Bate' : 'A la Defensiva'})</option>
    <option value="home">${appState.home.name} (${!visBatting ? 'Al Bate' : 'A la Defensiva'})</option>
  `;

  updateSubModalFields();
  DOM.substitutionModal.classList.add('open');
}

/**
 * Update Substitution Modal Fields Dynamically
 */
function updateSubModalFields() {
  const teamKey = DOM.subTeamSelect.value;
  const subType = DOM.subTypeSelect.value;
  const currentTeamObj = teamKey === 'visitor' ? appState.visitor : appState.home;

  // 1. Populate outgoing player
  if (subType === 'PH') {
    DOM.subOutgoingLabel.textContent = 'Bateador que sale (o es reemplazado)';
    const batter = currentTeamObj.lineup[currentTeamObj.currentBatterIdx];
    DOM.subOutgoingSelect.innerHTML = currentTeamObj.lineup.map((b, idx) => `
      <option value="${idx}" ${idx === currentTeamObj.currentBatterIdx ? 'selected' : ''}>
        #${b.number} ${b.name} (${b.pos}) ${idx === currentTeamObj.currentBatterIdx ? '— [BATEADOR ACTUAL]' : ''}
      </option>
    `).join('');
  } else if (subType === 'PR') {
    DOM.subOutgoingLabel.textContent = 'Corredor en base a sustituir';
    const activeRunners = [];
    if (appState.bases.first) activeRunners.push({ base: 'first', baseName: '1ra Base', runner: appState.bases.first });
    if (appState.bases.second) activeRunners.push({ base: 'second', baseName: '2da Base', runner: appState.bases.second });
    if (appState.bases.third) activeRunners.push({ base: 'third', baseName: '3ra Base', runner: appState.bases.third });

    if (activeRunners.length === 0) {
      DOM.subOutgoingSelect.innerHTML = `<option value="">No hay corredores en base actualmente</option>`;
    } else {
      DOM.subOutgoingSelect.innerHTML = activeRunners.map(r => `
        <option value="${r.base}">
          ${r.baseName}: #${r.runner.number} ${r.runner.name}
        </option>
      `).join('');
    }
  } else if (subType === 'RP') {
    DOM.subOutgoingLabel.textContent = 'Lanzador saliente';
    const p = currentTeamObj.startingPitcher;
    DOM.subOutgoingSelect.innerHTML = `
      <option value="pitcher">#${p.number} ${p.name} (Lanzador Activo)</option>
    `;
  } else if (subType === 'DEF') {
    DOM.subOutgoingLabel.textContent = 'Jugador defensivo a sustituir';
    DOM.subOutgoingSelect.innerHTML = currentTeamObj.lineup.map((b, idx) => `
      <option value="${idx}">
        ${b.order}. #${b.number} ${b.name} (${b.pos})
      </option>
    `).join('');
  }

  // 2. Populate incoming player from bench
  const bench = currentTeamObj.bench || [];
  if (bench.length === 0) {
    DOM.subIncomingSelect.innerHTML = `<option value="">(Banca vacía - ingresa nombre abajo)</option>`;
  } else {
    DOM.subIncomingSelect.innerHTML = bench.map((b, idx) => `
      <option value="${idx}">
        #${b.number} ${b.name} [${b.role || b.pos || 'Reserva'}]
      </option>
    `).join('');
  }
}

/**
 * Handle Substitution Form Submission
 */
function handleSubstitutionSubmit(e) {
  e.preventDefault();
  pushUndo();

  const teamKey = DOM.subTeamSelect.value;
  const subType = DOM.subTypeSelect.value;
  const currentTeamObj = teamKey === 'visitor' ? appState.visitor : appState.home;

  const benchIdx = DOM.subIncomingSelect.value;
  let incomingPlayer = null;

  if (benchIdx !== "" && currentTeamObj.bench && currentTeamObj.bench[benchIdx]) {
    incomingPlayer = currentTeamObj.bench[benchIdx];
  }

  // Check manual input if provided
  const manualName = DOM.subManualName?.value.trim();
  const manualNum = parseInt(DOM.subManualNum?.value, 10);
  if (manualName) {
    incomingPlayer = {
      name: manualName,
      number: isNaN(manualNum) ? 99 : manualNum,
      pos: subType,
      role: subType
    };
  }

  if (!incomingPlayer) {
    showToast('Selecciona o ingresa el jugador sustituto');
    return;
  }

  let narrativeText = '';

  if (subType === 'PH') {
    const lineupIdx = parseInt(DOM.subOutgoingSelect.value, 10);
    const outgoing = currentTeamObj.lineup[lineupIdx];
    narrativeText = `🔄 Bateador Emergente: ${incomingPlayer.name} (#${incomingPlayer.number}) entra a batear en lugar de ${outgoing.name} (#${outgoing.number}).`;

    currentTeamObj.lineup[lineupIdx].name = `${incomingPlayer.name} (PH)`;
    currentTeamObj.lineup[lineupIdx].number = incomingPlayer.number;
  } else if (subType === 'PR') {
    const baseKey = DOM.subOutgoingSelect.value;
    if (!baseKey || !appState.bases[baseKey]) {
      showToast('No hay corredor válido en esa base');
      return;
    }
    const outgoing = appState.bases[baseKey];
    const baseNames = { first: '1ra Base', second: '2da Base', third: '3ra Base' };
    narrativeText = `🔄 Corredor Emergente: ${incomingPlayer.name} (#${incomingPlayer.number}) entra a correr en ${baseNames[baseKey]} por ${outgoing.name} (#${outgoing.number}).`;

    appState.bases[baseKey] = {
      id: 'sub_run_' + Date.now(),
      name: `${incomingPlayer.name} (PR)`,
      number: incomingPlayer.number
    };
  } else if (subType === 'RP') {
    const outgoing = currentTeamObj.startingPitcher;
    narrativeText = `🔄 Cambio de Lanzador: Entra a lanzar ${incomingPlayer.name} (#${incomingPlayer.number}) en relevo de ${outgoing.name} (#${outgoing.number}).`;

    currentTeamObj.startingPitcher.name = incomingPlayer.name;
    currentTeamObj.startingPitcher.number = incomingPlayer.number;
    currentTeamObj.startingPitcher.hand = incomingPlayer.hand || 'R';
  } else if (subType === 'DEF') {
    const lineupIdx = parseInt(DOM.subOutgoingSelect.value, 10);
    const outgoing = currentTeamObj.lineup[lineupIdx];
    narrativeText = `🔄 Sustitución Defensiva: Entra ${incomingPlayer.name} (#${incomingPlayer.number}) a la defensiva por ${outgoing.name} (#${outgoing.number}).`;

    currentTeamObj.lineup[lineupIdx].name = incomingPlayer.name;
    currentTeamObj.lineup[lineupIdx].number = incomingPlayer.number;
  }

  // Remove from bench if was from bench list
  if (benchIdx !== "" && currentTeamObj.bench && currentTeamObj.bench[benchIdx] && !manualName) {
    currentTeamObj.bench.splice(benchIdx, 1);
  }

  // Clear manual inputs
  if (DOM.subManualName) DOM.subManualName.value = '';
  if (DOM.subManualNum) DOM.subManualNum.value = '';

  // Log narrative
  const inningLabel = `${appState.isTopInning ? '▲' : '▼'} ${appState.inning}ra`;
  appState.playLog.unshift({
    id: 'log-' + Date.now(),
    inning: inningLabel,
    type: 'substitution',
    title: 'Sustitución Oficial',
    desc: narrativeText,
    badgeClass: 'badge-adv',
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  });

  closeAllModals();
  autosave();
  renderAll();
  showToast(narrativeText);
}

/**
 * Save Checkpoint of Current Game
 */
function saveCheckpoint(customNote = '') {
  if (!appState.checkpoints) appState.checkpoints = [];

  const inningLabel = `${appState.isTopInning ? '▲ Alta' : '▼ Baja'} ${appState.inning}ra`;
  const defaultNote = `Inning ${appState.inning} (${appState.visitor.abbreviation} ${appState.visitor.score} - ${appState.home.score} ${appState.home.abbreviation}), ${appState.outs} Out(s)`;

  const checkpoint = {
    id: 'cp_' + Date.now(),
    timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    date: new Date().toLocaleDateString('es-ES'),
    inningLabel,
    scoreText: `${appState.visitor.abbreviation} ${appState.visitor.score} - ${appState.home.score} ${appState.home.abbreviation}`,
    outs: appState.outs,
    note: customNote || defaultNote,
    stateSnapshot: JSON.stringify(appState)
  };

  appState.checkpoints.unshift(checkpoint);
  autosave();
  showToast(`📍 Checkpoint guardado: ${checkpoint.inningLabel} (${checkpoint.scoreText})`);
}

/**
 * Open Checkpoints Modal
 */
function openCheckpointsModal() {
  renderCheckpointsList();
  DOM.checkpointsModal.classList.add('open');
}

/**
 * Render Checkpoints List inside modal
 */
function renderCheckpointsList() {
  if (!DOM.checkpointsListContainer) return;
  const list = appState.checkpoints || [];

  if (list.length === 0) {
    DOM.checkpointsListContainer.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.85rem;">
        No hay checkpoints guardados aún en este partido. Puedes crear uno usando el botón superior.
      </div>
    `;
    return;
  }

  DOM.checkpointsListContainer.innerHTML = list.map((cp, idx) => `
    <div class="checkpoint-card-item">
      <div>
        <div style="font-weight:700; font-size:0.88rem; color:var(--cyan); display:flex; align-items:center; gap:0.5rem;">
          <span>📍</span>
          <span>${cp.inningLabel} [${cp.scoreText}]</span>
          <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(${cp.timestamp})</span>
        </div>
        <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">
          ${cp.note} • ${cp.outs} out(s)
        </div>
      </div>
      <div style="display:flex; gap:0.4rem;">
        <button type="button" class="btn-nav btn-primary" style="padding:0.35rem 0.65rem; font-size:0.75rem;" onclick="window.restoreCheckpoint('${cp.id}')">
          🔄 Restaurar
        </button>
        <button type="button" class="btn-nav" style="padding:0.35rem 0.5rem; font-size:0.75rem; border-color:var(--crimson); color:var(--crimson);" onclick="window.deleteCheckpoint('${cp.id}')">
          🗑️
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Restore game state to selected checkpoint
 */
window.restoreCheckpoint = function(cpId) {
  const list = appState.checkpoints || [];
  const cp = list.find(c => c.id === cpId);
  if (!cp) return;

  if (confirm(`¿Deseas restaurar el juego al Checkpoint del inning ${cp.inningLabel} (${cp.scoreText})?`)) {
    try {
      const restored = JSON.parse(cp.stateSnapshot);
      // Keep existing checkpoints list
      restored.checkpoints = appState.checkpoints;
      appState = restored;
      autosave();
      renderAll();
      closeAllModals();
      showToast(`🔄 Juego restaurado al Checkpoint: ${cp.inningLabel}`);
    } catch (e) {
      console.error('Error restaurando checkpoint:', e);
    }
  }
};

/**
 * Delete checkpoint entry
 */
window.deleteCheckpoint = function(cpId) {
  if (appState.checkpoints) {
    appState.checkpoints = appState.checkpoints.filter(c => c.id !== cpId);
    autosave();
    renderCheckpointsList();
    showToast('Checkpoint eliminado');
  }
};

/**
 * Open Supabase Modal
 */
function openSupabaseModal() {
  if (typeof SupabaseService !== 'undefined') {
    const config = SupabaseService.getConfig();
    if (DOM.sbUrlInput) DOM.sbUrlInput.value = config.url;
    if (DOM.sbKeyInput) DOM.sbKeyInput.value = config.anonKey;
  }
  if (DOM.sbTestStatus) DOM.sbTestStatus.style.display = 'none';
  DOM.supabaseModal.classList.add('open');
}

/**
 * Test Supabase Connection
 */
async function testSupabaseConnection() {
  const url = DOM.sbUrlInput.value.trim();
  const key = DOM.sbKeyInput.value.trim();

  if (!url || !key) {
    showToast('Ingresa la URL y la Key de Supabase para probar');
    return;
  }

  DOM.sbTestStatus.style.display = 'block';
  DOM.sbTestStatus.style.background = 'var(--bg-surface-elevated)';
  DOM.sbTestStatus.style.color = 'var(--text-primary)';
  DOM.sbTestStatus.textContent = '⏳ Probando conexión con Supabase...';

  SupabaseService.saveConfig(url, key);
  const result = await SupabaseService.testConnection();

  if (result.success) {
    DOM.sbTestStatus.style.background = 'var(--emerald-dark)';
    DOM.sbTestStatus.style.color = 'var(--emerald)';
    DOM.sbTestStatus.textContent = '✅ ' + result.message;
    updateCloudStatusIndicator();
  } else {
    DOM.sbTestStatus.style.background = 'var(--crimson-dark)';
    DOM.sbTestStatus.style.color = 'var(--crimson)';
    DOM.sbTestStatus.textContent = '❌ ' + result.message;
  }
}

/**
 * Save Supabase Configuration Form
 */
async function handleSaveSupabaseConfig(e) {
  e.preventDefault();

  const url = DOM.sbUrlInput.value.trim();
  const key = DOM.sbKeyInput.value.trim();

  SupabaseService.saveConfig(url, key);
  const result = await SupabaseService.testConnection();

  if (result.success) {
    // Sync current active game immediately
    SupabaseService.syncGame(appState);
    closeAllModals();
    updateCloudStatusIndicator();
    showToast('☁️ ¡Conectado y sincronizado con Supabase Cloud exitosamente!');
  } else {
    DOM.sbTestStatus.style.display = 'block';
    DOM.sbTestStatus.style.background = 'var(--crimson-dark)';
    DOM.sbTestStatus.style.color = 'var(--crimson)';
    DOM.sbTestStatus.textContent = '❌ Error: ' + result.message;
  }
}

/**
 * Update Cloud Status indicator in navbar
 */
function updateCloudStatusIndicator() {
  if (!DOM.cloudStatusIcon) return;
  const isConn = typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured();
  if (isConn) {
    DOM.cloudStatusIcon.textContent = '🟢';
    DOM.supabaseConfigBtn?.setAttribute('title', 'Supabase Cloud Conectado (Sincronización activa)');
  } else {
    DOM.cloudStatusIcon.textContent = '☁️';
    DOM.supabaseConfigBtn?.setAttribute('title', 'Conectar base de datos en nube (Supabase)');
  }
}



