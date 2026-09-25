// ============================================================
// DEFAULT_DATA — сид для первого запуска. Сетка жёстко на 6 команд.
// Команды 1 и 2 — топ-сеяные, получают bye в R1 верхней.
// ============================================================
const DEFAULT_DATA = {
  tournament: {
    name: "Compass Arena",
    game: "Dota 2",
    format: "Double Elimination",
    matches: "Bo3",
    dates: "26 сентября 2026"
  },
  teams: [
    { id: 1, name: "Слот 1", players: [], logo: "" },
    { id: 2, name: "Слот 2", players: [], logo: "" },
    { id: 3, name: "Слот 3", players: [], logo: "" },
    { id: 4, name: "Слот 4", players: [], logo: "" },
    { id: 5, name: "Слот 5", players: [], logo: "" },
    { id: 6, name: "Слот 6", players: [], logo: "" }
  ],
  matches: [
    // Верхняя сетка
    { id: 1, round: 1, team1: 3, team2: 4, winner: null, bracket: 'upper' },
    { id: 2, round: 1, team1: 5, team2: 6, winner: null, bracket: 'upper' },
    { id: 3, round: 2, team1: 1, team2: null, winner: null, bracket: 'upper' },
    { id: 4, round: 2, team1: 2, team2: null, winner: null, bracket: 'upper' },
    { id: 5, round: 3, team1: null, team2: null, winner: null, bracket: 'upper' },
    // Нижняя сетка
    { id: 6, round: 1, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 7, round: 2, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 8, round: 3, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 9, round: 4, team1: null, team2: null, winner: null, bracket: 'lower' },
    // Гранд-финал
    { id: 10, round: 5, team1: null, team2: null, winner: null, bracket: 'grand' }
  ],
  schedule: {},
  liveMatchId: null,
  tournamentStart: null,
  projectStart: null,
  alwaysShowBracketBanner: true
};

export async function onRequestGet(context) {
  const { env } = context;
  let data = await env.COMPASS_KV.get('tournament', { type: 'json' });

  if (!data) {
    data = DEFAULT_DATA;
    await env.COMPASS_KV.put('tournament', JSON.stringify(data));
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    }
  });
}
