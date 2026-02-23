// DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");

// Track Attendance
let count = 0;
const maxCount = 50;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];

const storageKeys = {
  total: "intelAttendanceCount",
  teams: "intelTeamCounts",
  list: "intelAttendeeList",
};

function getTeamLabel(team) {
  if (team === "water") {
    return "Team Water Wise";
  }
  if (team === "zero") {
    return "Team Net Zero";
  }
  return "Team Renewables";
}

function saveState() {
  localStorage.setItem(storageKeys.total, count);
  localStorage.setItem(storageKeys.teams, JSON.stringify(teamCounts));
  localStorage.setItem(storageKeys.list, JSON.stringify(attendees));
}

function loadState() {
  const savedCount = localStorage.getItem(storageKeys.total);
  const savedTeams = localStorage.getItem(storageKeys.teams);
  const savedList = localStorage.getItem(storageKeys.list);

  if (savedCount) {
    count = parseInt(savedCount, 10) || 0;
  }

  if (savedTeams) {
    const parsedTeams = JSON.parse(savedTeams);
    teamCounts.water = parsedTeams.water || 0;
    teamCounts.zero = parsedTeams.zero || 0;
    teamCounts.power = parsedTeams.power || 0;
  }

  if (savedList) {
    const parsedList = JSON.parse(savedList);
    if (Array.isArray(parsedList)) {
      attendees = parsedList;
    }
  }

  updateUI();
}

function updateProgressBar() {
  const progress = Math.min(count, maxCount) / maxCount;
  progressBar.style.width = `${Math.round(progress * 100)}%`;
}

function updateCounts() {
  attendeeCount.textContent = count;
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
}

function renderAttendeeList() {
  attendeeList.innerHTML = "";

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";
    listItem.innerHTML = `<span>${attendee.name}</span> ${attendee.teamLabel}`;
    attendeeList.appendChild(listItem);
  }
}

function getWinningTeamMessage() {
  const values = [
    { name: "Team Water Wise", count: teamCounts.water },
    { name: "Team Net Zero", count: teamCounts.zero },
    { name: "Team Renewables", count: teamCounts.power },
  ];

  let maxValue = 0;
  for (let i = 0; i < values.length; i++) {
    if (values[i].count > maxValue) {
      maxValue = values[i].count;
    }
  }

  const winners = [];
  for (let i = 0; i < values.length; i++) {
    if (values[i].count === maxValue) {
      winners.push(values[i].name);
    }
  }

  if (winners.length === 1) {
    return `${winners[0]} is leading the celebration!`;
  }

  return `It is a tie between ${winners.join(" and ")}!`;
}

function updateCelebration() {
  if (count >= maxCount) {
    celebration.textContent = `Goal reached! ${getWinningTeamMessage()}`;
    celebration.style.display = "block";
  } else {
    celebration.textContent = "";
    celebration.style.display = "none";
  }
}

function updateUI() {
  updateCounts();
  updateProgressBar();
  renderAttendeeList();
  updateCelebration();
}

// Form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) {
    return;
  }

  const teamLabel = getTeamLabel(team);

  count = count + 1;
  teamCounts[team] = teamCounts[team] + 1;

  attendees.unshift({
    name: name,
    team: team,
    teamLabel: teamLabel,
  });

  greeting.textContent = `Welcome, ${name} from ${teamLabel}!`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  updateUI();
  saveState();

  form.reset();
});

loadState();
