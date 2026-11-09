/**
 * Sport Click Stats - Baseball Rules & Statistical Engine
 * WBSC / MLB compliant scoring calculations, runner advancements, and stats
 */

const BaseballEngine = {
  /**
   * Helper to format Inning Pitched (.1, .2, .0)
   */
  formatIP(outs) {
    const fullInnings = Math.floor(outs / 3);
    const remainder = outs % 3;
    return `${fullInnings}.${remainder}`;
  },

  /**
   * Decimal representation of IP for ERA and WHIP formulas
   */
  getDecimalIP(outs) {
    if (!outs || outs <= 0) return 0.00001; // Avoid divide by zero
    const full = Math.floor(outs / 3);
    const frac = (outs % 3) / 3;
    return full + frac;
  },

  /**
   * Calculate Earned Run Average (ERA = 9 * ER / IP)
   */
  calculateERA(earnedRuns, totalOuts) {
    const decIP = this.getDecimalIP(totalOuts);
    if (totalOuts <= 0) return earnedRuns > 0 ? "99.99" : "0.00";
    const val = (9 * earnedRuns) / decIP;
    return val.toFixed(2);
  },

  /**
   * Calculate WHIP = (BB + H) / IP
   */
  calculateWHIP(walks, hits, totalOuts) {
    const decIP = this.getDecimalIP(totalOuts);
    if (totalOuts <= 0) return "0.00";
    const val = (walks + hits) / decIP;
    return val.toFixed(2);
  },

  /**
   * Calculate Caught Stealing Percentage = CS / (CS + SB) * 100%
   */
  calculateCSPct(cs, sb) {
    const total = cs + sb;
    if (total === 0) return "0.0%";
    const pct = (cs / total) * 100;
    return `${pct.toFixed(1)}%`;
  },

  /**
   * Calculate Catcher's ERA (CERA = 9 * TeamER_during_catcher / CatcherIP)
   */
  calculateCERA(teamEarnedRuns, catcherOuts) {
    const decIP = this.getDecimalIP(catcherOuts);
    if (catcherOuts <= 0) return "0.00";
    const val = (9 * teamEarnedRuns) / decIP;
    return val.toFixed(2);
  },

  /**
   * Calculate Batting Average (H / AB)
   */
  calculateAVG(h, ab) {
    if (!ab || ab === 0) return ".000";
    const val = h / ab;
    return val.toFixed(3).replace(/^0/, '');
  },

  /**
   * Calculate OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
   */
  calculateOBP(h, bb, ab) {
    const denom = ab + bb;
    if (denom === 0) return ".000";
    return ((h + bb) / denom).toFixed(3).replace(/^0/, '');
  },

  /**
   * Calculate SLG = (1B + 2*2B + 3*3B + 4*HR) / AB
   */
  calculateSLG(h, d, t, hr, ab) {
    if (!ab || ab === 0) return ".000";
    const singles = h - (d + t + hr);
    const tb = singles + 2 * d + 3 * t + 4 * hr;
    return (tb / ab).toFixed(3).replace(/^0/, '');
  },

  /**
   * Creates an initial fresh game structure
   */
  createFreshGame(presetKey = 'lvbp') {
    const preset = MOCK_LEAGUES[presetKey] || MOCK_LEAGUES.lvbp;
    const gameId = 'game_' + Date.now();

    return {
      id: gameId,
      leagueKey: presetKey,
      leagueName: preset.name,
      tournament: preset.tournament,
      venue: preset.venue,
      date: new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      
      // Inning & Count Status
      inning: 1,
      isTopInning: true, // Top = Visitor batting; Bottom = Home batting
      outs: 0,
      balls: 0,
      strikes: 0,
      isFinished: false,

      // Base Runners: objects { id, name, number } or null
      bases: {
        first: null,
        second: null,
        third: null
      },

      // Teams
      visitor: {
        ...JSON.parse(JSON.stringify(preset.visitor)),
        score: 0,
        hits: 0,
        errors: 0,
        lineScore: [0, 0, 0, 0, 0, 0, 0, 0, 0], // Innings 1-9
        currentBatterIdx: 0,
        totalPitcherOuts: 0
      },
      home: {
        ...JSON.parse(JSON.stringify(preset.home)),
        score: 0,
        hits: 0,
        errors: 0,
        lineScore: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        currentBatterIdx: 0,
        totalPitcherOuts: 0
      },

      // Pitch Tracker (for detailed mode)
      currentPitches: [], // List of { type, quadrant, x, y, speed, pitchNum }
      
      // Play-by-Play Log
      playLog: [
        {
          id: 'log-0',
          inning: '▲ 1ra',
          type: 'info',
          title: 'Inicio del Encuentro',
          desc: `Inicio oficial del partido entre ${preset.visitor.name} y ${preset.home.name} en ${preset.venue}.`,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ],

      // State History Stack for UNDO
      undoStack: [],
      checkpoints: []
    };
  },

  /**
   * Creates a custom game configured by the user
   */
  createCustomGame(options) {
    const gameId = 'game_' + Date.now();
    const inningsCount = parseInt(options.innings || 9, 10);
    const lineScore = new Array(inningsCount).fill(0);

    const makeLineup = (prefix) => [
      { id: `${prefix}-1`, order: 1, name: "Bateador 1", number: 10, pos: "CF", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-2`, order: 2, name: "Bateador 2", number: 12, pos: "2B", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-3`, order: 3, name: "Bateador 3", number: 24, pos: "3B", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-4`, order: 4, name: "Bateador 4", number: 44, pos: "1B", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-5`, order: 5, name: "Bateador 5", number: 33, pos: "DH", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-6`, order: 6, name: "Bateador 6", number: 15, pos: "RF", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-7`, order: 7, name: "Bateador 7", number: 7, pos: "LF", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-8`, order: 8, name: "Bateador 8", number: 2, pos: "SS", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" },
      { id: `${prefix}-9`, order: 9, name: "Bateador 9", number: 8, pos: "C", ab: 0, r: 0, h: 0, "2b": 0, "3b": 0, hr: 0, rbi: 0, bb: 0, so: 0, avg: ".000" }
    ];

    return {
      id: gameId,
      leagueKey: 'custom',
      leagueName: options.league || 'Liga Oficial',
      tournament: options.tournament || 'Partido Oficial',
      venue: options.venue || 'Estadio Central',
      date: options.date || new Date().toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }),
      inningsCount: inningsCount,
      inning: 1,
      isTopInning: true,
      outs: 0,
      balls: 0,
      strikes: 0,
      isFinished: false,
      bases: { first: null, second: null, third: null },
      visitor: {
        id: 'vis_' + Date.now(),
        city: options.visCity || 'Equipo',
        name: options.visName || 'Visitante',
        abbreviation: (options.visAbbr || 'VIS').toUpperCase(),
        primaryColor: options.visColor || '#00F2FE',
        secondaryColor: '#121721',
        logoBadge: options.visLogo || '✈️',
        score: 0,
        hits: 0,
        errors: 0,
        lineScore: [...lineScore],
        currentBatterIdx: 0,
        totalPitcherOuts: 0,
        startingPitcher: {
          id: 'sp_vis_' + Date.now(),
          name: options.visSpName || 'Abridor Visitante',
          number: parseInt(options.visSpNum, 10) || 35,
          hand: options.visSpHand || 'R',
          ip: "0.0",
          ipDec: 0,
          h: 0,
          r: 0,
          er: 0,
          bb: 0,
          so: 0,
          hr: 0,
          pitches: 0,
          era: "0.00",
          whip: "0.00"
        },
        startingCatcher: {
          id: 'c_vis_' + Date.now(),
          name: options.visCName || 'Receptor Visitante',
          number: parseInt(options.visCNum, 10) || 8,
          innings: "0.0",
          cs: 0,
          sb: 0,
          csPct: "0.0%",
          pb: 0,
          e: 0,
          cera: "0.00"
        },
        lineup: makeLineup('vis'),
        bench: [
          { id: 'vis-b1', name: 'Sustituto 1', number: 18, pos: 'OF', role: 'PH', hand: 'R' },
          { id: 'vis-b2', name: 'Sustituto 2', number: 25, pos: 'INF', role: 'PR', hand: 'R' },
          { id: 'vis-b3', name: 'Relevista 1', number: 40, pos: 'RP', role: 'RP', hand: 'R' }
        ]
      },
      home: {
        id: 'home_' + Date.now(),
        city: options.homeCity || 'Equipo',
        name: options.homeName || 'Home Club',
        abbreviation: (options.homeAbbr || 'HOM').toUpperCase(),
        primaryColor: options.homeColor || '#F43F5E',
        secondaryColor: '#121721',
        logoBadge: options.homeLogo || '🏠',
        score: 0,
        hits: 0,
        errors: 0,
        lineScore: [...lineScore],
        currentBatterIdx: 0,
        totalPitcherOuts: 0,
        startingPitcher: {
          id: 'sp_home_' + Date.now(),
          name: options.homeSpName || 'Abridor Home Club',
          number: parseInt(options.homeSpNum, 10) || 50,
          hand: options.homeSpHand || 'R',
          ip: "0.0",
          ipDec: 0,
          h: 0,
          r: 0,
          er: 0,
          bb: 0,
          so: 0,
          hr: 0,
          pitches: 0,
          era: "0.00",
          whip: "0.00"
        },
        startingCatcher: {
          id: 'c_home_' + Date.now(),
          name: options.homeCName || 'Receptor Home Club',
          number: parseInt(options.homeCNum, 10) || 20,
          innings: "0.0",
          cs: 0,
          sb: 0,
          csPct: "0.0%",
          pb: 0,
          e: 0,
          cera: "0.00"
        },
        lineup: makeLineup('home'),
        bench: [
          { id: 'home-b1', name: 'Sustituto 1', number: 19, pos: 'OF', role: 'PH', hand: 'R' },
          { id: 'home-b2', name: 'Sustituto 2', number: 26, pos: 'INF', role: 'PR', hand: 'R' },
          { id: 'home-b3', name: 'Relevista 1', number: 41, pos: 'RP', role: 'RP', hand: 'R' }
        ]
      },
      currentPitches: [],
      playLog: [
        {
          id: 'log-0',
          inning: '▲ 1ra',
          type: 'info',
          title: 'Inicio del Encuentro',
          desc: `Inicio oficial del partido: ${options.visName || 'Visitante'} vs ${options.homeName || 'Home Club'} en ${options.venue || 'Estadio Central'}.`,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        }
      ],
      undoStack: [],
      checkpoints: []
    };
  },

  /**
   * Advance runners and score runs on a HIT (1B, 2B, 3B, HR)
   */
  processHit(state, hitType) {
    const battingTeam = state.isTopInning ? state.visitor : state.home;
    const defendingTeam = state.isTopInning ? state.home : state.visitor;
    const batter = battingTeam.lineup[battingTeam.currentBatterIdx];
    const pitcher = defendingTeam.startingPitcher;
    const catcher = defendingTeam.startingCatcher;

    let runsScored = 0;
    const scoredRunners = [];
    const narrativeLines = [];

    // Batter stat update
    batter.ab += 1;
    batter.h += 1;
    battingTeam.hits += 1;
    pitcher.h += 1;
    pitcher.pitches += 1;

    const b1 = state.bases.first;
    const b2 = state.bases.second;
    const b3 = state.bases.third;

    if (hitType === '1B') {
      // Sencillo: Corredor en 3B anota. Corredor en 2B avanza a 3B o anota. Corredor en 1B a 2B.
      if (b3) { runsScored++; scoredRunners.push(b3.name); }
      if (b2) {
        // En jugada estándar 2B avanza a 3B
        state.bases.third = b2;
      } else {
        state.bases.third = null;
      }
      if (b1) {
        state.bases.second = b1;
      } else {
        state.bases.second = null;
      }
      state.bases.first = { id: batter.id, name: batter.name, number: batter.number };
      narrativeLines.push(`${batter.name} conecta Sencillo (1B) al jardín.`);
    } else if (hitType === '2B') {
      batter['2b'] += 1;
      // Doble: Corredores en 3B y 2B anotan. Corredor en 1B a 3B.
      if (b3) { runsScored++; scoredRunners.push(b3.name); }
      if (b2) { runsScored++; scoredRunners.push(b2.name); }
      if (b1) { state.bases.third = b1; } else { state.bases.third = null; }
      state.bases.second = { id: batter.id, name: batter.name, number: batter.number };
      state.bases.first = null;
      narrativeLines.push(`${batter.name} sacude Doblete (2B) contra la pared.`);
    } else if (hitType === '3B') {
      batter['3b'] += 1;
      // Triple: Limpia las bases
      if (b3) { runsScored++; scoredRunners.push(b3.name); }
      if (b2) { runsScored++; scoredRunners.push(b2.name); }
      if (b1) { runsScored++; scoredRunners.push(b1.name); }
      state.bases.third = { id: batter.id, name: batter.name, number: batter.number };
      state.bases.second = null;
      state.bases.first = null;
      narrativeLines.push(`${batter.name} dispara Triple (3B) por la raya.`);
    } else if (hitType === 'HR') {
      batter.hr += 1;
      // Jonrón: Todos anotan incluido el bateador
      if (b3) { runsScored++; scoredRunners.push(b3.name); }
      if (b2) { runsScored++; scoredRunners.push(b2.name); }
      if (b1) { runsScored++; scoredRunners.push(b1.name); }
      runsScored++; // Bateador
      scoredRunners.push(batter.name);
      state.bases.first = null;
      state.bases.second = null;
      state.bases.third = null;
      pitcher.hr += 1;
      narrativeLines.push(`¡JONRÓN (HR) de ${batter.name}! Vuela la cerca con cuadrangular.`);
    }

    // Apply Runs & RBIs
    batter.rbi += runsScored;
    battingTeam.score += runsScored;
    pitcher.r += runsScored;
    pitcher.er += runsScored; // Assumed earned by default

    // Inning Box score table update
    const currentInningIdx = state.inning - 1;
    while (battingTeam.lineScore.length <= currentInningIdx) {
      battingTeam.lineScore.push(0);
    }
    battingTeam.lineScore[currentInningIdx] = (battingTeam.lineScore[currentInningIdx] || 0) + runsScored;

    if (scoredRunners.length > 0) {
      narrativeLines.push(`Anotan: ${scoredRunners.join(', ')} (${runsScored} carrera${runsScored > 1 ? 's' : ''}).`);
    }

    // Reset batter count & rotate
    state.balls = 0;
    state.strikes = 0;
    state.currentPitches = [];
    battingTeam.currentBatterIdx = (battingTeam.currentBatterIdx + 1) % 9;

    // Recalculate rates
    this.updateRates(state);

    return {
      type: 'hit',
      title: `${hitType} - ${batter.name}`,
      desc: narrativeLines.join(' '),
      badgeClass: 'badge-hit'
    };
  },

  /**
   * Process Walk (BB), Intentional Walk (IBB), Hit By Pitch (HBP), Error (E)
   */
  processAdvance(state, advType) {
    const battingTeam = state.isTopInning ? state.visitor : state.home;
    const defendingTeam = state.isTopInning ? state.home : state.visitor;
    const batter = battingTeam.lineup[battingTeam.currentBatterIdx];
    const pitcher = defendingTeam.startingPitcher;
    const catcher = defendingTeam.startingCatcher;

    pitcher.pitches += 1;
    let runsScored = 0;
    let narrative = '';

    if (advType === 'BB' || advType === 'IBB') {
      batter.bb += 1;
      pitcher.bb += 1;
      narrative = `${batter.name} recibe Base por Bolas (${advType}).`;
    } else if (advType === 'HBP') {
      narrative = `${batter.name} golpeado por el lanzamiento (HBP). Toma 1ra base.`;
    } else if (advType === 'E') {
      defendingTeam.errors += 1;
      batter.ab += 1;
      narrative = `${batter.name} embasado por Error a la defensiva (E).`;
    }

    // Forced runner advancement logic
    const b1 = state.bases.first;
    const b2 = state.bases.second;
    const b3 = state.bases.third;

    if (b1) {
      if (b2) {
        if (b3) {
          // Bases llenas: anota corredor de 3B
          runsScored++;
          battingTeam.score += 1;
          pitcher.r += 1;
          pitcher.er += (advType === 'E' ? 0 : 1);
          batter.rbi += (advType === 'E' ? 0 : 1);
          const currentInningIdx = state.inning - 1;
          battingTeam.lineScore[currentInningIdx] = (battingTeam.lineScore[currentInningIdx] || 0) + 1;
          narrative += ` ¡Anota ${b3.name} de caballito!`;
        }
        state.bases.third = b2;
      }
      state.bases.second = b1;
    }
    state.bases.first = { id: batter.id, name: batter.name, number: batter.number };

    // Reset batter count & rotate
    state.balls = 0;
    state.strikes = 0;
    state.currentPitches = [];
    battingTeam.currentBatterIdx = (battingTeam.currentBatterIdx + 1) % 9;

    this.updateRates(state);

    return {
      type: 'adv',
      title: `${advType} - ${batter.name}`,
      desc: narrative,
      badgeClass: 'badge-adv'
    };
  },

  /**
   * Process OUT (K, GO, FO, LO, FC)
   */
  processOut(state, outType) {
    const battingTeam = state.isTopInning ? state.visitor : state.home;
    const defendingTeam = state.isTopInning ? state.home : state.visitor;
    const batter = battingTeam.lineup[battingTeam.currentBatterIdx];
    const pitcher = defendingTeam.startingPitcher;
    const catcher = defendingTeam.startingCatcher;

    batter.ab += 1;
    pitcher.pitches += 1;
    state.outs += 1;
    pitcher.totalOuts = (pitcher.totalOuts || 0) + 1;
    catcher.totalOuts = (catcher.totalOuts || 0) + 1;

    let titleText = `${outType} - ${batter.name}`;
    let descText = '';

    if (outType === 'K') {
      batter.so += 1;
      pitcher.so += 1;
      descText = `${batter.name} se poncha tirándole (K). ${state.outs} out(s).`;
    } else if (outType === 'GO') {
      descText = `${batter.name} retirado con rolling al cuadro (GO). ${state.outs} out(s).`;
    } else if (outType === 'FO') {
      descText = `${batter.name} bateó elevado al jardín (FO) capturado. ${state.outs} out(s).`;
    } else if (outType === 'LO') {
      descText = `${batter.name} conecta línea fuerte directa al guante (LO). ${state.outs} out(s).`;
    } else if (outType === 'FC') {
      // Fielder's choice: lead runner retired, batter on 1B
      if (state.bases.third) state.bases.third = null;
      else if (state.bases.second) state.bases.second = null;
      else if (state.bases.first) state.bases.first = null;
      state.bases.first = { id: batter.id, name: batter.name, number: batter.number };
      descText = `Jugada de selección defensiva (FC). Corredor más adelantado out, bateador seguro en 1B.`;
    }

    // Reset batter count & rotate
    state.balls = 0;
    state.strikes = 0;
    state.currentPitches = [];
    battingTeam.currentBatterIdx = (battingTeam.currentBatterIdx + 1) % 9;

    let inningSwitched = false;
    // Check 3 outs
    if (state.outs >= 3) {
      descText += ` — Fin de la media entrada.`;
      this.switchHalfInning(state);
      inningSwitched = true;
    }

    this.updateRates(state);

    return {
      type: 'out',
      title: titleText,
      desc: descText,
      badgeClass: 'badge-out',
      inningSwitched
    };
  },

  /**
   * Switch Top / Bottom half of inning
   */
  switchHalfInning(state) {
    state.outs = 0;
    state.balls = 0;
    state.strikes = 0;
    state.bases = { first: null, second: null, third: null };
    state.currentPitches = [];

    if (state.isTopInning) {
      // Move to Bottom of the current inning
      state.isTopInning = false;
    } else {
      // Bottom completed, increment to next inning Top
      state.inning += 1;
      state.isTopInning = true;
    }
  },

  /**
   * Process pitch in Detailed Mode (Bola / Strike Cantado / Abanicado / Foul)
   */
  recordDetailedPitch(state, pitchType, quadrant = null) {
    const battingTeam = state.isTopInning ? state.visitor : state.home;
    const defendingTeam = state.isTopInning ? state.home : state.visitor;
    const batter = battingTeam.lineup[battingTeam.currentBatterIdx];
    const pitcher = defendingTeam.startingPitcher;

    pitcher.pitches += 1;
    const pitchNumber = state.currentPitches.length + 1;

    state.currentPitches.push({
      pitchNumber,
      pitchType,
      quadrant: quadrant || 'Centro',
      time: new Date().toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit' })
    });

    let result = null;

    if (pitchType === 'ball') {
      state.balls += 1;
      if (state.balls >= 4) {
        // Walk automatic trigger
        result = this.processAdvance(state, 'BB');
        result.desc = `Bola 4. ` + result.desc;
        return result;
      }
      return {
        type: 'pitch',
        title: `Bola (${state.balls}-${state.strikes})`,
        desc: `Lanzamiento fuera de zona (${quadrant || 'Zona exterior'}). Conteo: ${state.balls} bolas, ${state.strikes} strikes.`,
        badgeClass: 'badge-adv'
      };
    } else if (pitchType === 'strike_looking' || pitchType === 'strike_swinging') {
      state.strikes += 1;
      const typeLabel = pitchType === 'strike_looking' ? 'Strike Cantado' : 'Strike Abanicado';
      if (state.strikes >= 3) {
        // Strikeout automatic trigger
        result = this.processOut(state, 'K');
        result.desc = `${typeLabel} en el 3er strike. ` + result.desc;
        return result;
      }
      return {
        type: 'pitch',
        title: `${typeLabel} (${state.balls}-${state.strikes})`,
        desc: `Lanzamiento en zona ${quadrant || 'Cuadrante'}. Conteo: ${state.balls} bolas, ${state.strikes} strikes.`,
        badgeClass: 'badge-out'
      };
    } else if (pitchType === 'foul') {
      if (state.strikes < 2) {
        state.strikes += 1;
      }
      return {
        type: 'pitch',
        title: `Foul Ball (${state.balls}-${state.strikes})`,
        desc: `Batazo de foul. Conteo se mantiene en ${state.balls} bolas, ${state.strikes} strikes.`,
        badgeClass: 'badge-adv'
      };
    }

    return null;
  },

  /**
   * Base Running Events (SB, CS, PB, WP, Pickoff)
   */
  processBaseEvent(state, eventCode, targetBase = 'second') {
    const defendingTeam = state.isTopInning ? state.home : state.visitor;
    const catcher = defendingTeam.startingCatcher;
    const pitcher = defendingTeam.startingPitcher;

    let title = '';
    let desc = '';
    let badgeClass = 'badge-adv';

    if (eventCode === 'SB') {
      // Stolen base: 1B -> 2B or 2B -> 3B
      catcher.sb = (catcher.sb || 0) + 1;
      if (state.bases.second && !state.bases.third) {
        state.bases.third = state.bases.second;
        state.bases.second = null;
        desc = `Robo de 3ra base concedido a la defensiva.`;
      } else if (state.bases.first && !state.bases.second) {
        state.bases.second = state.bases.first;
        state.bases.first = null;
        desc = `Robo de 2da base concedido a la defensiva.`;
      } else {
        desc = `Intento de robo exitoso.`;
      }
      title = `Robo de Base (SB)`;
    } else if (eventCode === 'CS') {
      // Caught stealing: Out recorded, credited to Catcher!
      catcher.cs = (catcher.cs || 0) + 1;
      state.outs += 1;
      pitcher.totalOuts = (pitcher.totalOuts || 0) + 1;
      catcher.totalOuts = (catcher.totalOuts || 0) + 1;
      badgeClass = 'badge-out';

      if (state.bases.second) state.bases.second = null;
      else if (state.bases.first) state.bases.first = null;
      else if (state.bases.third) state.bases.third = null;

      title = `Atrapado Robando (CS)`;
      desc = `¡Sensacional tiro del receptor ${catcher.name}! Out en intento de robo. (${state.outs} outs).`;

      if (state.outs >= 3) {
        this.switchHalfInning(state);
        desc += ` — 3 outs en la entrada.`;
      }
    } else if (eventCode === 'PB') {
      // Passed Ball: Catcher error, runners advance
      catcher.pb = (catcher.pb || 0) + 1;
      if (state.bases.second && !state.bases.third) { state.bases.third = state.bases.second; state.bases.second = null; }
      if (state.bases.first && !state.bases.second) { state.bases.second = state.bases.first; state.bases.first = null; }
      title = `Pasbol (PB)`;
      desc = `Passed Ball detrás del plato. Corredores avanzan una base.`;
    } else if (eventCode === 'WP') {
      // Wild pitch: Pitcher responsibility
      pitcher.wp = (pitcher.wp || 0) + 1;
      if (state.bases.second && !state.bases.third) { state.bases.third = state.bases.second; state.bases.second = null; }
      if (state.bases.first && !state.bases.second) { state.bases.second = state.bases.first; state.bases.first = null; }
      title = `Wild Pitch (WP)`;
      desc = `Lanzamiento desviado (Wild Pitch) del lanzador. Corredores avanzan.`;
    } else if (eventCode === 'PICKOFF') {
      state.outs += 1;
      pitcher.totalOuts = (pitcher.totalOuts || 0) + 1;
      badgeClass = 'badge-out';
      if (state.bases.first) state.bases.first = null;
      else if (state.bases.second) state.bases.second = null;
      else if (state.bases.third) state.bases.third = null;
      title = `Pickoff Out`;
      desc = `Viraje sorpresa y out en la almohadilla (${state.outs} outs).`;
      if (state.outs >= 3) {
        this.switchHalfInning(state);
        desc += ` — Fin de la entrada.`;
      }
    }

    this.updateRates(state);

    return { type: 'base_event', title, desc, badgeClass };
  },

  /**
   * Recalculates live pitching and catching rates (ERA, WHIP, CERA, CS%)
   */
  updateRates(state) {
    [state.visitor, state.home].forEach(team => {
      const p = team.startingPitcher;
      const c = team.startingCatcher;
      const outs = p.totalOuts || 0;
      p.ip = this.formatIP(outs);
      p.era = this.calculateERA(p.er || 0, outs);
      p.whip = this.calculateWHIP(p.bb || 0, p.h || 0, outs);

      const cOuts = c.totalOuts || 0;
      c.innings = this.formatIP(cOuts);
      c.csPct = this.calculateCSPct(c.cs || 0, c.sb || 0);
      c.cera = this.calculateCERA(p.er || 0, cOuts);

      // Batters rate updates
      team.lineup.forEach(b => {
        b.avg = this.calculateAVG(b.h || 0, b.ab || 0);
        b.obp = this.calculateOBP(b.h || 0, b.bb || 0, b.ab || 0);
        b.slg = this.calculateSLG(b.h || 0, b['2b'] || 0, b['3b'] || 0, b.hr || 0, b.ab || 0);
      });
    });
  }
};
