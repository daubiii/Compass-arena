// ============================================================
// DEFAULT_DATA — сид, который используется ТОЛЬКО при первом
// запуске сайта, пока в KV ничего не сохранено через админку.
// После первого сохранения живут данные из KV, а не отсюда.
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
    { id: 1, name: "Слот 1", players: [] },
    { id: 2, name: "Слот 2", players: [] },
    { id: 3, name: "Слот 3", players: [] },
    { id: 4, name: "Слот 4", players: [] },
    { id: 5, name: "Слот 5", players: [] },
    { id: 6, name: "Слот 6", players: [] },
    { id: 7, name: "Слот 7", players: [] },
    { id: 8, name: "Слот 8", players: [] }
  ],
  matches: [
    { id: 1, round: 1, team1: 1, team2: 2, winner: null, bracket: 'upper' },
    { id: 2, round: 1, team1: 3, team2: 4, winner: null, bracket: 'upper' },
    { id: 3, round: 1, team1: 5, team2: 6, winner: null, bracket: 'upper' },
    { id: 4, round: 1, team1: 7, team2: 8, winner: null, bracket: 'upper' },
    { id: 5, round: 2, team1: null, team2: null, winner: null, bracket: 'upper' },
    { id: 6, round: 2, team1: null, team2: null, winner: null, bracket: 'upper' },
    { id: 7, round: 3, team1: null, team2: null, winner: null, bracket: 'upper' },
    { id: 8, round: 1, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 9, round: 1, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 10, round: 2, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 11, round: 2, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 12, round: 3, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 13, round: 4, team1: null, team2: null, winner: null, bracket: 'lower' },
    { id: 14, round: 5, team1: null, team2: null, winner: null, bracket: 'grand' }
  ],
  schedule: {},
  liveMatchId: null,
  // ISO-строка даты старта. null = использовать дефолт из index.html
  tournamentStart: null,
  // Показывать баннер «Турнирная сетка» всегда (true) или только после старта (false)
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
