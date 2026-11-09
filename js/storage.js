/**
 * Sport Click Stats - LocalStorage Persistent Engine
 * Handles user sessions, cumulative stats counters, and match history
 */

const STORAGE_KEYS = {
  USER_SESSION: 'scs_user_session',
  SCORER_METRICS: 'scs_scorer_metrics',
  GAMES_HISTORY: 'scs_games_history',
  CURRENT_GAME: 'scs_active_game',
  APP_THEME: 'scs_app_theme',
  SCORING_MODE: 'scs_scoring_mode'
};

const DEFAULT_USER = {
  id: 'usr-official-01',
  name: 'Lic. Carlos Mendoza',
  email: 'carlos.mendoza@wbsc.org',
  license: 'WBSC Nivel II / Cert. FVB-2024-89',
  role: 'Anotador Oficial Internacional',
  avatarUrl: null
};

const DEFAULT_METRICS = {
  gamesScored: 24,
  inningsLogged: 208,
  playsProcessed: 1420
};

const StorageService = {
  // --- User Session ---
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch (e) {
      return DEFAULT_USER;
    }
  },

  setUser(userObj) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(userObj));
    } catch (e) {
      console.error('Error guardando usuario:', e);
    }
  },

  logoutUser() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (e) {
      console.error(e);
    }
  },

  // --- Scorer Lifetime Metrics ---
  getMetrics() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCORER_METRICS);
      return data ? JSON.parse(data) : DEFAULT_METRICS;
    } catch (e) {
      return DEFAULT_METRICS;
    }
  },

  incrementMetrics(games = 0, innings = 0, plays = 0) {
    try {
      const current = this.getMetrics();
      current.gamesScored += games;
      current.inningsLogged += innings;
      current.playsProcessed += plays;
      localStorage.setItem(STORAGE_KEYS.SCORER_METRICS, JSON.stringify(current));
      return current;
    } catch (e) {
      console.error(e);
      return DEFAULT_METRICS;
    }
  },

  // --- Games History & Persistence ---
  getGamesHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAMES_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveGameToHistory(gameState) {
    try {
      const list = this.getGamesHistory();
      const existingIdx = list.findIndex(g => g.id === gameState.id);
      
      const summary = {
        id: gameState.id,
        savedAt: new Date().toISOString(),
        leagueName: gameState.leagueName,
        visitor: {
          name: gameState.visitor.name,
          city: gameState.visitor.city,
          abbreviation: gameState.visitor.abbreviation,
          score: gameState.visitor.score,
          logoBadge: gameState.visitor.logoBadge
        },
        home: {
          name: gameState.home.name,
          city: gameState.home.city,
          abbreviation: gameState.home.abbreviation,
          score: gameState.home.score,
          logoBadge: gameState.home.logoBadge
        },
        inning: gameState.inning,
        isTopInning: gameState.isTopInning,
        status: gameState.isFinished ? 'Finalizado' : 'En progreso',
        fullState: gameState
      };

      if (existingIdx >= 0) {
        list[existingIdx] = summary;
      } else {
        list.unshift(summary);
      }

      localStorage.setItem(STORAGE_KEYS.GAMES_HISTORY, JSON.stringify(list));
      localStorage.setItem(STORAGE_KEYS.CURRENT_GAME, JSON.stringify(gameState));
      return true;
    } catch (e) {
      console.error('Error guardando partido:', e);
      return false;
    }
  },

  getGameById(id) {
    const list = this.getGamesHistory();
    const found = list.find(g => g.id === id);
    return found ? found.fullState : null;
  },

  deleteGame(id) {
    try {
      let list = this.getGamesHistory();
      list = list.filter(g => g.id !== id);
      localStorage.setItem(STORAGE_KEYS.GAMES_HISTORY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  // --- UI Preferences ---
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.APP_THEME) || 'dark';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.APP_THEME, theme);
  },

  getScoringMode() {
    return localStorage.getItem(STORAGE_KEYS.SCORING_MODE) || 'fast';
  },

  setScoringMode(mode) {
    localStorage.setItem(STORAGE_KEYS.SCORING_MODE, mode);
  }
};
