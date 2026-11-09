/**
 * Sport Click Stats - LocalStorage Persistent Engine
 * Handles user sessions, cumulative stats counters, and match history
 */

const STORAGE_KEYS = {
  USER_SESSION: 'scs_user_session',
  USERS_LIST: 'scs_users_database',
  ADMIN_SESSION: 'scs_admin_session',
  SCORER_METRICS: 'scs_scorer_metrics',
  GAMES_HISTORY: 'scs_games_history',
  CURRENT_GAME: 'scs_active_game',
  APP_THEME: 'scs_app_theme',
  SCORING_MODE: 'scs_scoring_mode'
};

const DEFAULT_USERS_DATABASE = [
  {
    id: 'usr-official-01',
    name: 'Lic. Carlos Mendoza',
    email: 'carlos.mendoza@wbsc.org',
    password: 'demo',
    license: 'WBSC Nivel II / Cert. FVB-2024-89',
    role: 'Anotador Oficial Internacional',
    status: 'Activo',
    createdAt: '2026-01-15T12:00:00.000Z',
    gamesScored: 24,
    inningsLogged: 208,
    playsProcessed: 1420
  },
  {
    id: 'usr-official-02',
    name: 'Roberto Alomar',
    email: 'anotador@sportclick.com',
    password: 'demo',
    license: 'Certificado Nacional LVBP #104',
    role: 'Anotador Titular',
    status: 'Activo',
    createdAt: '2026-02-01T12:00:00.000Z',
    gamesScored: 12,
    inningsLogged: 98,
    playsProcessed: 615
  }
];

const DEFAULT_USER = DEFAULT_USERS_DATABASE[0];

const DEFAULT_METRICS = {
  gamesScored: 24,
  inningsLogged: 208,
  playsProcessed: 1420
};

const StorageService = {
  // --- Registered Users Database (Managed by Admin) ---
  getUsersList() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(DEFAULT_USERS_DATABASE));
        return DEFAULT_USERS_DATABASE;
      }
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_USERS_DATABASE;
    }
  },

  saveUser(userObj) {
    try {
      const users = this.getUsersList();
      const existingIdx = users.findIndex(u => u.id === userObj.id || (u.email && u.email.toLowerCase() === userObj.email.toLowerCase()));
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...userObj };
      } else {
        users.unshift({
          id: userObj.id || 'usr_' + Date.now(),
          createdAt: new Date().toISOString(),
          status: 'Activo',
          gamesScored: 0,
          inningsLogged: 0,
          playsProcessed: 0,
          ...userObj
        });
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      
      // Sincronizar con Supabase si está conectado
      if (typeof SupabaseService !== 'undefined' && SupabaseService.isConfigured()) {
        const u = existingIdx >= 0 ? users[existingIdx] : users[0];
        SupabaseService.syncProfile(u, { gamesScored: u.gamesScored, inningsLogged: u.inningsLogged, playsProcessed: u.playsProcessed });
      }

      return true;
    } catch (e) {
      console.error('Error guardando usuario en base de datos:', e);
      return false;
    }
  },

  deleteUser(userId) {
    try {
      let users = this.getUsersList();
      users = users.filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
      return true;
    } catch (e) {
      return false;
    }
  },

  authenticateUser(emailOrUser, password) {
    const users = this.getUsersList();
    const cleanInput = (emailOrUser || '').trim().toLowerCase();
    const found = users.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === cleanInput;
      const nameMatch = u.name && u.name.toLowerCase() === cleanInput;
      const userPartMatch = u.email && u.email.split('@')[0].toLowerCase() === cleanInput;
      return (emailMatch || nameMatch || userPartMatch) &&
             u.password === password &&
             u.status !== 'Inactivo';
    });
    if (found) {
      this.setUser(found);
      return found;
    }
    return null;
  },

  // --- Super Admin Authentication ---
  authenticateAdmin(email, password) {
    const cleanEmail = (email || '').trim().toLowerCase();
    // Default admin credentials
    if ((cleanEmail === 'admin@sportclick.com' || cleanEmail === 'admin') && password === 'admin2026') {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify({
        email: 'admin@sportclick.com',
        role: 'Super Administrator',
        loggedInAt: new Date().toISOString()
      }));
      return true;
    }
    return false;
  },

  isAdminLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  // --- Active Scorer Session ---
  isUserLoggedIn() {
    return !!localStorage.getItem(STORAGE_KEYS.USER_SESSION);
  },

  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_SESSION);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
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
    const u = this.getUser();
    if (u) {
      return {
        gamesScored: u.gamesScored || 0,
        inningsLogged: u.inningsLogged || 0,
        playsProcessed: u.playsProcessed || 0
      };
    }
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

      const u = this.getUser();
      if (u) {
        u.gamesScored = current.gamesScored;
        u.inningsLogged = current.inningsLogged;
        u.playsProcessed = current.playsProcessed;
        this.setUser(u);
        this.saveUser(u);
      }
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
