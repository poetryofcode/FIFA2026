const TABS = ["home", "teams", "players", "matches", "tickets"];
const PARENT = { player: "players", team: "teams", match: "matches" };
const DURATION = 580;

const PLAYERS = {
  mercier: {
    name: "Louis Mercier",
    role: "Captain, Tokyo Warriors",
    photo: "images/player-1.png",
  },
  ronaldo: {
    name: "Cristiano Ronaldo",
    role: "Symbol of discipline, speed",
    photo: "images/player-2.png",
  },
  mbappe: {
    name: "Kylian Mbappé",
    role: "New generation of football",
    photo: "images/player-3.png",
  },
  bellingham: {
    name: "Jude Bellingham",
    role: "Key player of world class",
    photo: "images/player-4.png",
  },
};

const TEAMS = {
  usa: { name: "United States", code: "USA", next: "vs Mexico · Group stage", match: "usa-mex" },
  mex: { name: "Mexico", code: "MEX", next: "vs United States · Group stage", match: "usa-mex" },
  can: { name: "Canada", code: "CAN", next: "vs Japan · Group stage", match: "can-jpn" },
  bra: { name: "Brazil", code: "BRA", next: "vs France · Live", match: "bra-fra", player: null },
  fra: { name: "France", code: "FRA", next: "vs Brazil · Live", match: "bra-fra", player: "mbappe" },
  arg: { name: "Argentina", code: "ARG", next: "vs England · Tonight", match: "arg-eng" },
  eng: { name: "England", code: "ENG", next: "vs Argentina · Tonight", match: "arg-eng", player: "bellingham" },
  por: { name: "Portugal", code: "POR", next: "vs Spain · Tomorrow", match: "por-esp", player: "ronaldo" },
  esp: { name: "Spain", code: "ESP", next: "vs Portugal · Tomorrow", match: "por-esp" },
  jpn: { name: "Japan", code: "JPN", next: "vs Canada · Group stage", match: "can-jpn" },
  ger: { name: "Germany", code: "GER", next: "vs Morocco · Group stage", match: "ger-mar" },
  mar: { name: "Morocco", code: "MAR", next: "vs Germany · Group stage", match: "ger-mar" },
};

const MATCHES = {
  "bra-fra": {
    home: "Brazil",
    away: "France",
    homeCode: "BRA",
    awayCode: "FRA",
    score: "2–1",
    minute: "67'",
    status: "Live",
    venue: "Group stage · packed stadium",
    live: true,
  },
  "arg-eng": {
    home: "Argentina",
    away: "England",
    homeCode: "ARG",
    awayCode: "ENG",
    score: "vs",
    minute: "Tonight",
    status: "Tonight",
    venue: "Group stage",
    live: false,
  },
  "usa-mex": {
    home: "United States",
    away: "Mexico",
    homeCode: "USA",
    awayCode: "MEX",
    score: "vs",
    minute: "Saturday",
    status: "Upcoming",
    venue: "Host nations",
    live: false,
  },
  "por-esp": {
    home: "Portugal",
    away: "Spain",
    homeCode: "POR",
    awayCode: "ESP",
    score: "vs",
    minute: "Tomorrow",
    status: "Upcoming",
    venue: "Group stage",
    live: false,
  },
  "can-jpn": {
    home: "Canada",
    away: "Japan",
    homeCode: "CAN",
    awayCode: "JPN",
    score: "vs",
    minute: "Sunday",
    status: "Upcoming",
    venue: "Group stage",
    live: false,
  },
  "ger-mar": {
    home: "Germany",
    away: "Morocco",
    homeCode: "GER",
    awayCode: "MAR",
    score: "vs",
    minute: "Sunday",
    status: "Upcoming",
    venue: "Group stage",
    live: false,
  },
};

const COPY = {
  home: {
    step: "01 — Home",
    title: "The game that unites millions",
    body: "Tap Be the part online. The phone moves only when you tap.",
  },
  teams: {
    step: "02 — Teams",
    title: "The biggest football event on earth",
    body: "Filter the 48 national teams, then tap one to open its next match.",
  },
  team: {
    step: "03 — Team",
    title: "National team",
    body: "Open the fixture, or go back to the full list.",
  },
  players: {
    step: "04 — Players",
    title: "Star players",
    body: "Tap Louis Mercier, Cristiano Ronaldo, Kylian Mbappé, or Jude Bellingham.",
  },
  player: {
    step: "05 — Player",
    title: "Star player",
    body: "Follow the player, or open HD highlights inside the stadium.",
  },
  matches: {
    step: "06 — Matches",
    title: "Live match updates",
    body: "Tap the live fixture. One hundred-plus matches, one tap at a time.",
  },
  match: {
    step: "07 — Stadium",
    title: "Feel the stadium atmosphere",
    body: "Switch Live updates, Fan community, Match statistics, or HD highlights. Then continue.",
  },
  tickets: {
    step: "08 — Tickets",
    title: "Ready for the next match?",
    body: "Pick a match and a side, then tap Be the part online.",
  },
};

const HINT = {
  home: "[data-screen='home'] [data-go='matches']",
  teams: "[data-screen='teams'] [data-team='bra']",
  team: "[data-screen='team'] [data-open-match]",
  players: "[data-screen='players'] [data-player='mbappe']",
  player: "[data-screen='player'] [data-open-highlights]",
  matches: "[data-screen='matches'] [data-match='bra-fra']",
  match: "[data-screen='match'] [data-panel='fans']",
  tickets: "[data-confirm]",
};

const state = {
  current: "home",
  tab: "home",
  stack: ["home"],
  lock: false,
  player: "mercier",
  team: "bra",
  match: "bra-fra",
  panel: "live",
  filter: "all",
  ticketMatch: "bra-fra",
  ticketSide: "France",
  confirmed: false,
  following: {},
  highlightOn: false,
};

const device = document.querySelector(".device");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function screenEl(id) {
  return document.querySelector(`[data-screen="${id}"]`);
}

function parentOf(id) {
  return PARENT[id] || id;
}

function chapterOf(id) {
  if (id === "player") return "players";
  if (id === "team") return "teams";
  return id;
}

function updateChrome(id) {
  const tab = TABS.includes(id) ? id : parentOf(id);
  device.classList.toggle("is-detail", !TABS.includes(id));
  document.querySelectorAll(".tabbar button").forEach((button) => {
    const on = button.dataset.tab === tab;
    button.classList.toggle("is-current", on);
    if (on) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  document.querySelectorAll(".chapters button").forEach((button) => {
    button.classList.toggle("is-current", button.dataset.chapter === chapterOf(id));
  });
  document.querySelectorAll(".screen").forEach((screen) => {
    const on = screen.dataset.screen === id;
    screen.setAttribute("aria-hidden", on ? "false" : "true");
    screen.inert = !on;
  });
  const copy = COPY[id];
  document.getElementById("coach-step").textContent = copy.step;
  document.getElementById("coach-title").textContent = copy.title;
  document.getElementById("coach-body").textContent = copy.body;
  const match = MATCHES[state.match];
  const island = document.getElementById("island");
  const showLive = id === "match" && match.live;
  island.classList.toggle("is-live", showLive);
  document.getElementById("island-label").textContent = showLive
    ? `LIVE  ${match.score}`
    : "";
  document.querySelectorAll(".is-hint").forEach((el) => el.classList.remove("is-hint"));
  const sheetOpen = document.getElementById("sheet").classList.contains("is-open");
  const hint = document.querySelector(
    id === "tickets" && sheetOpen ? "[data-go='matches'].sheet-go" : HINT[id],
  );
  if (hint) hint.classList.add("is-hint");
  document.querySelectorAll(".header__link[data-nav]").forEach((link) => {
  link.classList.toggle("is-section", link.dataset.nav === tab);
});
}

function renderPlayer() {
  const player = PLAYERS[state.player];
  const photo = document.getElementById("player-photo");
  photo.src = player.photo;
  photo.alt = player.name;
  document.getElementById("player-name").textContent = player.name;
  document.getElementById("player-role").textContent = player.role;
  const follow = document.getElementById("follow");
  const on = Boolean(state.following[state.player]);
  follow.textContent = on ? "Following" : "Follow";
  follow.classList.toggle("is-selected", on);
  follow.setAttribute("aria-pressed", on ? "true" : "false");
}

function renderTeam() {
  const team = TEAMS[state.team];
  document.getElementById("team-code").textContent = team.code;
  document.getElementById("team-name").textContent = team.name;
  document.getElementById("team-next").textContent = team.next;
  const star = document.getElementById("team-star");
  if (team.player) {
    star.hidden = false;
    star.dataset.player = team.player;
    star.textContent = `Star player · ${PLAYERS[team.player].name}`;
  } else {
    star.hidden = true;
  }
}

function renderMatch() {
  const match = MATCHES[state.match];
  document.getElementById("match-home-code").textContent = match.homeCode;
  document.getElementById("match-away-code").textContent = match.awayCode;
  document.getElementById("match-home-name").textContent = match.home;
  document.getElementById("match-away-name").textContent = match.away;
  document.getElementById("match-score").textContent = match.score;
  document.getElementById("match-minute").textContent = match.minute;
  document.getElementById("match-venue").textContent = match.venue;
  const liveCopy = document.getElementById("live-copy");
  liveCopy.textContent = match.live
    ? "From the group stage to the final, millions of fans follow every second of the game."
    : "Follow the main matches of the tournament and support your favorite team along with millions of fans around the world.";
}

function setPanel(name) {
  state.panel = name;
  document.querySelectorAll("[data-panel]").forEach((button) => {
    const on = button.dataset.panel === name;
    button.classList.toggle("is-selected", on);
    button.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll("[data-panel-view]").forEach((panel) => {
    panel.classList.toggle("is-on", panel.dataset.panelView === name);
  });
  if (name !== "hd") state.highlightOn = false;
  const frame = document.getElementById("highlight-frame");
  frame.hidden = !state.highlightOn;
}

function setFilter(name) {
  state.filter = name;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const on = button.dataset.filter === name;
    button.classList.toggle("is-selected", on);
    button.setAttribute("aria-pressed", on ? "true" : "false");
  });
  document.querySelectorAll("[data-team]").forEach((row) => {
    const host = row.dataset.host === "true";
    row.hidden = name === "hosts" && !host;
  });
}

function selectTicket(kind, value) {
  if (kind === "match") state.ticketMatch = value;
  if (kind === "side") state.ticketSide = value;
  document.querySelectorAll("[data-ticket-match]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.ticketMatch === state.ticketMatch);
  });
  document.querySelectorAll("[data-ticket-side]").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.ticketSide === state.ticketSide);
  });
}

function openSheet() {
  state.confirmed = true;
  const match = MATCHES[state.ticketMatch];
  document.getElementById("sheet-detail").textContent =
    `${state.ticketSide} · ${match.home} vs ${match.away}. Follow the main matches of the tournament and support your favorite team along with millions of fans around the world.`;
  document.getElementById("sheet").classList.add("is-open");
  device.classList.add("is-sheet");
  updateChrome(state.current);
}

function closeSheet() {
  const wasOpen = document.getElementById("sheet").classList.contains("is-open");
  document.getElementById("sheet").classList.remove("is-open");
  device.classList.remove("is-sheet");
  if (wasOpen && state.current === "tickets" && !state.lock) updateChrome("tickets");
}

function transition(next, direction) {
  if (state.lock || next === state.current || !screenEl(next)) return;
  const from = screenEl(state.current);
  const to = screenEl(next);
  updateChrome(next);

  if (reduceMotion) {
    from.classList.remove("is-active", "is-entered");
    to.classList.add("is-active", "is-entered");
    state.current = next;
    if (TABS.includes(next)) state.tab = next;
    updateChrome(next);
    return;
  }

  const enter =
    direction === "forward"
      ? "from-right"
      : direction === "back"
        ? "from-left"
        : direction === "up"
          ? "from-bottom"
          : "from-top";
  const exit =
    direction === "forward"
      ? "to-left"
      : direction === "back"
        ? "to-right"
        : direction === "up"
          ? "to-back"
          : "to-bottom";

  state.lock = true;
  to.classList.add("is-animating", enter);
  from.classList.add("is-animating");
  void to.offsetWidth;
  to.classList.remove(enter);
  to.classList.add("is-active");
  from.classList.remove("is-active", "is-entered");
  from.classList.add(exit);

  let settled = false;
  const finish = () => {
    if (settled) return;
    settled = true;
    from.classList.remove("is-animating", exit);
    to.classList.remove("is-animating");
    to.classList.add("is-entered");
    state.current = next;
    if (TABS.includes(next)) state.tab = next;
    state.lock = false;
    updateChrome(next);
  };

  const onEnd = (event) => {
    if (event.target === to && event.propertyName === "transform") finish();
  };
  to.addEventListener("transitionend", onEnd);
  window.setTimeout(() => {
    to.removeEventListener("transitionend", onEnd);
    finish();
  }, DURATION + 70);
}

function switchTab(id) {
  if (!id || state.lock || id === state.current) return;
  const from = TABS.includes(state.current) ? state.current : state.tab;
  if (!TABS.includes(state.current) && parentOf(state.current) === id && state.stack.at(-2) === id) {
    state.stack.pop();
    transition(id, "down");
    return;
  }
  const direction = TABS.indexOf(id) >= TABS.indexOf(from) ? "forward" : "back";
  state.stack = [id];
  state.tab = id;
  transition(id, direction);
}

function pushDetail(id) {
  if (state.lock || id === state.current) return;
  if (state.stack.at(-1) !== id) state.stack.push(id);
  transition(id, "up");
}

function pop() {
  if (state.lock) return;
  if (state.stack.length < 2) {
    switchTab("home");
    return;
  }
  state.stack.pop();
  const previous = state.stack.at(-1);
  if (TABS.includes(previous)) state.tab = previous;
  transition(previous, "down");
}

function openPlayer(id) {
  state.player = id;
  renderPlayer();
  pushDetail("player");
}

function openTeam(id) {
  state.team = id;
  renderTeam();
  pushDetail("team");
}

function openMatch(id, panel = "live") {
  if (state.lock) return;
  if (state.current === "match" && state.match === id && state.panel === panel) return;
  state.match = id;
  state.highlightOn = false;
  renderMatch();
  setPanel(panel);
  if (state.current === "match") {
    updateChrome("match");
    return;
  }
  pushDetail("match");
}

document.querySelector(".viewport").addEventListener("click", (event) => {
  const back = event.target.closest("[data-action='back']");
  if (back) {
    pop();
    return;
  }

  const panel = event.target.closest("[data-panel]");
  if (panel) {
    setPanel(panel.dataset.panel);
    if (panel.dataset.panel === "fans") {
      document.querySelectorAll(".is-hint").forEach((el) => el.classList.remove("is-hint"));
      document.querySelector("[data-screen='match'] [data-go='tickets']")?.classList.add("is-hint");
    }
    return;
  }

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    setFilter(filter.dataset.filter);
    return;
  }

  const follow = event.target.closest("[data-follow]");
  if (follow) {
    state.following[state.player] = !state.following[state.player];
    renderPlayer();
    return;
  }

  const highlight = event.target.closest("[data-highlight]");
  if (highlight) {
    state.highlightOn = !state.highlightOn;
    document.getElementById("highlight-frame").hidden = !state.highlightOn;
    highlight.setAttribute("aria-pressed", state.highlightOn ? "true" : "false");
    return;
  }

  const ticketMatch = event.target.closest("[data-ticket-match]");
  if (ticketMatch) {
    selectTicket("match", ticketMatch.dataset.ticketMatch);
    return;
  }

  const ticketSide = event.target.closest("[data-ticket-side]");
  if (ticketSide) {
    selectTicket("side", ticketSide.dataset.ticketSide);
    return;
  }

  if (event.target.closest("[data-confirm]")) {
    openSheet();
    return;
  }

  if (event.target.closest("[data-sheet-close]")) {
    closeSheet();
    return;
  }

  const player = event.target.closest("[data-player]");
  if (player && PLAYERS[player.dataset.player]) {
    openPlayer(player.dataset.player);
    return;
  }

  const team = event.target.closest("[data-team]");
  if (team && TEAMS[team.dataset.team]) {
    openTeam(team.dataset.team);
    return;
  }

  const match = event.target.closest("[data-match]");
  if (match && MATCHES[match.dataset.match]) {
    openMatch(match.dataset.match);
    return;
  }

  const linkedMatch = event.target.closest("[data-open-match]");
  if (linkedMatch) {
    openMatch(TEAMS[state.team].match);
    return;
  }

  const highlights = event.target.closest("[data-open-highlights]");
  if (highlights) {
    openMatch("bra-fra", "hd");
    return;
  }

  const go = event.target.closest("[data-go]");
  if (go) {
    closeSheet();
    const id = go.dataset.go;
    if (TABS.includes(id)) switchTab(id);
    else if (id === "match") openMatch(state.match);
  }
});

document.querySelector(".tabbar").addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  if (tab) switchTab(tab.dataset.tab);
});

document.querySelector(".chapters").addEventListener("click", (event) => {
  const chapter = event.target.closest("[data-chapter]");
  if (!chapter) return;
  const id = chapter.dataset.chapter;
  if (id === "match") openMatch("bra-fra");
  else switchTab(id);
});

document.querySelectorAll(".header__link[data-nav]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    switchTab(link.dataset.nav);
  });
});

renderPlayer();
renderTeam();
renderMatch();
setPanel("live");
setFilter("all");
selectTicket("match", state.ticketMatch);
selectTicket("side", state.ticketSide);

const params = new URLSearchParams(window.location.search);
const requested = params.get("screen");
if (requested === "match") openMatch("bra-fra");
else if (TABS.includes(requested) && requested !== "home") switchTab(requested);
else {
  screenEl("home").classList.add("is-entered");
  updateChrome("home");
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (document.getElementById("sheet").classList.contains("is-open")) closeSheet();
  else if (!TABS.includes(state.current)) pop();
});
