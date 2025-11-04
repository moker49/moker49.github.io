window.addEventListener("DOMContentLoaded", () => {
    const allMoves = moveGroups.flatMap(g => g.moves);
    let enabledMoves = JSON.parse(localStorage.getItem("enabledMoves")) ||
        Object.fromEntries(allMoves.map(m => [m.name, true]));

    const moveListEl = document.getElementById("moveList");
    const randomizeBtn = document.getElementById("randomizeBtn");
    const currentMoveEl = document.getElementById("currentMove");
    const sortBtn = document.getElementById("sortBtn");
    const sortMenu = document.getElementById("sortMenu");
    const titleText = document.getElementById("titleText");

    const sortModes = {
        alphaAsc: { label: "Alphabetical", fn: (a, b) => a.name.localeCompare(b.name) },
        dateDesc: { label: "Newest First", fn: (a, b) => new Date(b.date) - new Date(a.date) },
        dateAsc: { label: "Oldest First", fn: (a, b) => new Date(a.date) - new Date(b.date) },
    };

    let currentSort = localStorage.getItem("sortMode") || "alphaAsc";

    function renderMoveList() {
        moveListEl.innerHTML = "";
        moveGroups.forEach(group => {
            const sorted = [...group.moves].sort(sortModes[currentSort].fn);
            const html = `
        <div class="move-group">
          <h3>${group.name}</h3>
          ${sorted.map(m => `
            <label>
              <input type="checkbox" data-move="${m.name}" ${enabledMoves[m.name] ? "checked" : ""}>
              ${m.name}
            </label>
          `).join("")}
        </div>
      `;
            moveListEl.insertAdjacentHTML("beforeend", html);
        });
    }

    renderMoveList();

    // Auto-save on checkbox change
    moveListEl.addEventListener("change", e => {
        if (e.target.matches("input[type='checkbox']")) {
            const move = e.target.dataset.move;
            enabledMoves[move] = e.target.checked;
            localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
        }
    });

    // Randomizer
    randomizeBtn.addEventListener("click", () => {
        const active = Object.entries(enabledMoves)
            .filter(([_, v]) => v)
            .map(([name]) => name);
        if (!active.length) {
            currentMoveEl.textContent = "No moves selected!";
            return;
        }
        const move = active[Math.floor(Math.random() * active.length)];
        currentMoveEl.style.opacity = 0;
        setTimeout(() => {
            currentMoveEl.textContent = move;
            currentMoveEl.style.opacity = 1;
        }, 150);
    });

    // Tab switching
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");

            const tab = btn.dataset.tab;
            document.getElementById(tab).classList.add("active");

            if (tab === "tab-settings") {
                sortBtn.style.visibility = "visible";
            } else {
                sortBtn.style.visibility = "hidden";
                sortMenu.classList.add("hidden");
            }
        });
    });

    // Sort menu toggle
    sortBtn.addEventListener("click", e => {
        e.stopPropagation();
        sortMenu.classList.toggle("hidden");
    });

    // Select sort mode
    sortMenu.addEventListener("click", e => {
        if (e.target.matches("button[data-sort]")) {
            currentSort = e.target.dataset.sort;
            localStorage.setItem("sortMode", currentSort);
            renderMoveList();
            sortMenu.classList.add("hidden");
        }
    });

    // Hide menu when clicking elsewhere
    document.addEventListener("click", e => {
        if (!sortMenu.classList.contains("hidden")) {
            sortMenu.classList.add("hidden");
        }
    });
});
