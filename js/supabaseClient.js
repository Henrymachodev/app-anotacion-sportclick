/**
 * Sport Click Stats - Supabase Cloud Database Client
 * Hybrid Offline-First Sync Engine for Games, Checkpoints & Scorer Profiles
 */

const SUPABASE_STORAGE_KEYS = {
  URL: 'scs_supabase_url',
  ANON_KEY: 'scs_supabase_anon_key'
};

// Default preconfigured project credentials
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://tvdrmjndvevsfvtbtvtj.supabase.co',
  anonKey: 'sb_publishable_2pbr7J8Vuk0qXwXA2s9PmQ_e6lE7Hwt'
};

const SupabaseService = {
  client: null,

  getConfig() {
    return {
      url: localStorage.getItem(SUPABASE_STORAGE_KEYS.URL) || DEFAULT_SUPABASE_CONFIG.url,
      anonKey: localStorage.getItem(SUPABASE_STORAGE_KEYS.ANON_KEY) || DEFAULT_SUPABASE_CONFIG.anonKey
    };
  },

  saveConfig(url, anonKey) {
    localStorage.setItem(SUPABASE_STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(SUPABASE_STORAGE_KEYS.ANON_KEY, anonKey.trim());
    return this.init();
  },

  isConfigured() {
    const { url, anonKey } = this.getConfig();
    return !!(url && anonKey && url.startsWith('http'));
  },

  init() {
    const { url, anonKey } = this.getConfig();
    if (!url || !anonKey || typeof window.supabase === 'undefined') {
      this.client = null;
      return false;
    }

    try {
      this.client = window.supabase.createClient(url, anonKey);
      return true;
    } catch (e) {
      console.warn('No se pudo inicializar cliente de Supabase:', e);
      this.client = null;
      return false;
    }
  },

  /**
   * Test current connection
   */
  async testConnection() {
    if (!this.init() || !this.client) {
      return { success: false, message: 'Supabase no está configurado o el SDK no está disponible.' };
    }

    try {
      const { data, error } = await this.client
        .from('games')
        .select('id')
        .limit(1);

      if (error) {
        return { success: false, message: error.message || 'Error consultando la tabla games.' };
      }

      return { success: true, message: '¡Conexión exitosa con Supabase PostgreSQL!' };
    } catch (e) {
      return { success: false, message: e.message || 'Error de red conectando con Supabase.' };
    }
  },

  /**
   * Save / Sync active game and its checkpoints to Supabase
   */
  async syncGame(gameState) {
    if (!this.isConfigured() || !this.client) {
      return false;
    }

    try {
      const payload = {
        id: gameState.id,
        updated_at: new Date().toISOString(),
        league_name: gameState.leagueName || 'Liga Oficial',
        venue: gameState.venue || 'Estadio Central',
        game_date: gameState.date || 'Hoy',
        visitor_name: gameState.visitor.name,
        home_name: gameState.home.name,
        visitor_score: gameState.visitor.score || 0,
        home_score: gameState.home.score || 0,
        inning: gameState.inning || 1,
        is_top_inning: gameState.isTopInning,
        status: gameState.isFinished ? 'Finalizado' : 'En progreso',
        game_state: gameState
      };

      const { error } = await this.client
        .from('games')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        console.warn('Error sincronizando juego en Supabase:', error);
        return false;
      }

      // Sync checkpoints if any
      if (gameState.checkpoints && gameState.checkpoints.length > 0) {
        const cpPayload = gameState.checkpoints.map(cp => ({
          id: cp.id,
          game_id: gameState.id,
          timestamp: cp.timestamp,
          inning_label: cp.inningLabel,
          score_text: cp.scoreText,
          outs: cp.outs || 0,
          note: cp.note || '',
          state_snapshot: cp
        }));

        await this.client
          .from('checkpoints')
          .upsert(cpPayload, { onConflict: 'id' });
      }

      return true;
    } catch (e) {
      console.warn('Excepción sincronizando juego en Supabase:', e);
      return false;
    }
  },

  /**
   * Fetch all games stored in cloud
   */
  async fetchCloudGames() {
    if (!this.isConfigured() || !this.client) {
      return null;
    }

    try {
      const { data, error } = await this.client
        .from('games')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Error obteniendo juegos de Supabase:', error);
        return null;
      }

      return data.map(item => ({
        id: item.id,
        savedAt: item.updated_at,
        leagueName: item.league_name,
        visitor: {
          name: item.visitor_name,
          score: item.visitor_score
        },
        home: {
          name: item.home_name,
          score: item.home_score
        },
        inning: item.inning,
        isTopInning: item.is_top_inning,
        status: item.status,
        fullState: item.game_state
      }));
    } catch (e) {
      console.warn('Excepción obteniendo juegos de Supabase:', e);
      return null;
    }
  },

  /**
   * Delete game in cloud
   */
  async deleteCloudGame(gameId) {
    if (!this.isConfigured() || !this.client) return false;

    try {
      const { error } = await this.client
        .from('games')
        .delete()
        .eq('id', gameId);

      return !error;
    } catch (e) {
      console.warn('Error eliminando juego en Supabase:', e);
      return false;
    }
  },

  /**
   * Sync Scorer Profile & Metrics
   */
  async syncProfile(user, metrics) {
    if (!this.isConfigured() || !this.client) return false;

    try {
      const payload = {
        id: user.id || 'usr-official-01',
        name: user.name,
        email: user.email,
        license: user.license,
        role: user.role,
        games_scored: metrics.gamesScored || 0,
        innings_logged: metrics.inningsLogged || 0,
        plays_processed: metrics.playsProcessed || 0,
        updated_at: new Date().toISOString()
      };

      await this.client
        .from('scorer_profiles')
        .upsert(payload, { onConflict: 'id' });

      return true;
    } catch (e) {
      console.warn('Error sincronizando perfil en Supabase:', e);
      return false;
    }
  }
};

// Initialize on script load
document.addEventListener('DOMContentLoaded', () => {
  SupabaseService.init();
});
