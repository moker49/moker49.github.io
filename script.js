const moves = [
    "Basic Step", "Cross Body Lead", "Right Turn", "Left Turn",
    "Open Break", "Inside Turn", "Outside Turn",
    "Shine Step", "Copa", "360 Spin", "Hammerlock", "Sweetheart", "Shadow Position"
];

const moveListEl = document.getElementById("moveList");
const randomizeBtn = document.getElementById("randomizeBtn");
const currentMoveEl = document.getElementById("currentMove");
const saveSettingsBtn = document.getElementById("saveSettings");

// Load settings from localStorage or default to all true
let enabledMoves = JSON.parse(localStorage.getItem("enabledMoves")) ||
    Object.fromEntries(moves.map(m => [m, true]));

// Populate settings checklist
function renderMoveList() {
    moveListEl.innerHTML = moves.map(m =>
        `<label><input type="checkbox" data-move="${m}" ${enabledMoves[m] ? "checked" : ""}> ${m}</label>`
    ).join("");
}

// Handle saving
saveSettingsBtn.addEventListener("click", () => {
    document.querySelectorAll("#moveList input[type='checkbox']").forEach(cb => {
        enabledMoves[cb.dataset.move] = cb.checked;
    });
    localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
    alert("Settings saved!");
});

// Randomizer
randomizeBtn.addEventListener("click", () => {
    const activeMoves = Object.entries(enabledMoves)
        .filter(([_, enabled]) => enabled)
        .map(([name]) => name);

    if (activeMoves.length === 0) {
        currentMoveEl.textContent = "No moves selected!";
        return;
    }

    const randomMove = activeMoves[Math.floor(Math.random() * activeMoves.length)];
    currentMoveEl.textContent = randomMove;
});

// Tab switching
document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

// Initial render
renderMoveList();