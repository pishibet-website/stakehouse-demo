// In-memory mock "database". Resets whenever the server restarts.
// Replace this with a real database + licensed odds feed + real auth (hashed passwords, sessions) before going live.

let matches = {
  football: [
    { id: "f1", league: "Premier League", home: "Arsenal", away: "Chelsea", time: "Today 20:00", odds: { home: 2.10, draw: 3.40, away: 3.20 }, live: false },
    { id: "f2", league: "Serie A", home: "Inter", away: "Juventus", time: "Today 21:45", odds: { home: 1.95, draw: 3.30, away: 3.90 }, live: true },
    { id: "f3", league: "La Liga", home: "Real Madrid", away: "Sevilla", time: "Tomorrow 19:00", odds: { home: 1.45, draw: 4.50, away: 6.20 }, live: false },
    { id: "f4", league: "Bundesliga", home: "Bayern", away: "Dortmund", time: "Sat 17:30", odds: { home: 1.70, draw: 3.90, away: 4.60 }, live: false },
  ],
  tennis: [
    { id: "t1", league: "ATP Cincinnati", home: "Alcaraz", away: "Sinner", time: "Today 18:00", odds: { home: 1.80, away: 2.00 }, live: true },
    { id: "t2", league: "WTA Montreal", home: "Swiatek", away: "Gauff", time: "Today 20:30", odds: { home: 1.55, away: 2.40 }, live: false },
  ],
  basketball: [
    { id: "b1", league: "EuroLeague", home: "Real Madrid", away: "Barcelona", time: "Today 20:00", odds: { home: 1.60, away: 2.30 }, live: false },
  ],
};

let betHistory = [];

let users = [];
let tokens = {};
let nextUserId = 1;

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, balance: u.balance };
}

export function registerUser({ name, email, password }) {
  if (!name || !email || !password) return { ok: false, error: "همه فیلدها لازمه" };
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "این ایمیل قبلاً ثبت شده" };
  }
  const user = { id: nextUserId++, name, email, password, balance: 250.0 };
  users.push(user);
  const token = `tok_${user.id}_${Date.now()}`;
  tokens[token] = user.id;
  return { ok: true, token, user: publicUser(user) };
}

export function loginUser({ email, password }) {
  const user = users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user || user.password !== password) {
    return { ok: false, error: "ایمیل یا رمز عبور اشتباهه" };
  }
  const token = `tok_${user.id}_${Date.now()}`;
  tokens[token] = user.id;
  return { ok: true, token, user: publicUser(user) };
}

export function getUserByToken(token) {
  const userId = tokens[token];
  if (!userId) return null;
  const user = users.find((u) => u.id === userId);
  return user ? publicUser(user) : null;
}

function jitterOdds(v) {
  const delta = (Math.random() - 0.5) * 0.1;
  return Math.max(1.05, Math.round((v + delta) * 100) / 100);
}

export function getMatches() {
  const sportKeys = Object.keys(matches);
  const sportKey = sportKeys[Math.floor(Math.random() * sportKeys.length)];
  const list = matches[sportKey];
  const idx = Math.floor(Math.random() * list.length);
  const oddsKeys = Object.keys(list[idx].odds);
  const key = oddsKeys[Math.floor(Math.random() * oddsKeys.length)];
  list[idx].odds[key] = jitterOdds(list[idx].odds[key]);
  return matches;
}

export function placeBet({ token, selections, stake }) {
  const userId = tokens[token];
  const user = users.find((u) => u.id === userId);
  if (!user) return { ok: false, error: "باید اول وارد حساب بشی" };

  const stakeNum = Number(stake);
  if (!selections?.length || !stakeNum || stakeNum <= 0) {
    return { ok: false, error: "شرط نامعتبره" };
  }
  if (stakeNum > user.balance) {
    return { ok: false, error: "موجودی کافی نیست" };
  }
  const combinedOdds = selections.reduce((acc, s) => acc * s.odds, 1);
  user.balance = Math.round((user.balance - stakeNum) * 100) / 100;
  const bet = {
    id: `bet_${Date.now()}`,
    userId: user.id,
    selections,
    stake: stakeNum,
    combinedOdds: Math.round(combinedOdds * 100) / 100,
    potentialReturn: Math.round(stakeNum * combinedOdds * 100) / 100,
    placedAt: new Date().toISOString(),
  };
  betHistory.push(bet);
  return { ok: true, bet, balance: user.balance };
}

export function getHistory(userId) {
  return betHistory.filter((b) => b.userId === userId);
}

export function getHistoryByToken(token) {
  const userId = tokens[token];
  if (!userId) return null;
  return betHistory.filter((b) => b.userId === userId);
      }
