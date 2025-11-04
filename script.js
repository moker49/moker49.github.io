window.addEventListener("DOMContentLoaded", () => {
    // --- Build current list of all moves ---
    const allMoves = moveGroups.flatMap(g => g.moves);
    const allMoveNames = allMoves.map(m => m.name);

    // --- Load saved moves, clean up, and merge defaults ---
    let savedMoves = JSON.parse(localStorage.getItem("enabledMoves")) || {};
    let enabledMoves = {};

    // Keep only valid moves and fill missing ones
    for (const move of allMoves) {
        if (move.name in savedMoves) {
            enabledMoves[move.name] = savedMoves[move.name];
        } else {
            // New move — enabled if it has a date
            enabledMoves[move.name] = !!move.date;
        }
    }

    // Save the cleaned version back to storage
    localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));

    const moveListEl = document.getElementById("moveList");
    const randomizeBtn = document.getElementById("randomizeBtn");
    const currentMoveEl = document.getElementById("currentMove");
    const sortBtn = document.getElementById("sortBtn");
    const sortMenu = document.getElementById("sortMenu");
    const titleText = document.getElementById("titleText");

    const sortModes = {
        alphaAsc: {
            label: "Alphabetical",
            fn: (a, b) => a.name.localeCompare(b.name)
        },
        dateDesc: {
            label: "Newest First",
            fn: (a, b) => {
                const da = a.date ? new Date(a.date) : new Date(0); // fallback = oldest
                const db = b.date ? new Date(b.date) : new Date(0);
                return db - da;
            }
        },
        dateAsc: {
            label: "Oldest First",
            fn: (a, b) => {
                const da = a.date ? new Date(a.date) : new Date(8640000000000000); // fallback = far future
                const db = b.date ? new Date(b.date) : new Date(8640000000000000);
                return da - db;
            }
        }
    };

    let currentSort = localStorage.getItem("sortMode") || "dateDesc";

    function renderMoveList() {
        moveListEl.innerHTML = "";

        // Load category collapse states
        const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

        moveGroups.forEach(group => {
            const isCollapsed = collapsedGroups[group.name] || false;

            const sorted = [...group.moves].sort(sortModes[currentSort].fn);
            const groupHTML = `
      <div class="move-group ${isCollapsed ? "collapsed" : ""}" data-group="${group.name}">
        <h3 class="group-header ${isCollapsed ? "collapsed" : ""}">
          ${group.name}
          <span class="material-symbols-rounded collapse-icon">
            ${isCollapsed ? "expand_more" : "expand_less"}
          </span>
        </h3>
        <div class="group-moves" style="display:${isCollapsed ? "none" : "block"}">
          ${sorted
                    .map(
                        m => `
                <label class="move-item">
                  <div class="checkbox-wrapper">
                    <input type="checkbox" data-move="${m.name}" ${enabledMoves[m.name] ? "checked" : ""}>
                    <span class="checkbox-custom"></span>
                  </div>
                  <span class="move-name">${m.name}</span>
                  <span class="move-date">${m.date ? new Date(m.date).toLocaleDateString() : "—"}</span>
                </label>`
                    )
                    .join("")}
        </div>
      </div>`;
            moveListEl.insertAdjacentHTML("beforeend", groupHTML);
        });

        // --- Toggle collapse on header click ---
        document.querySelectorAll(".group-header").forEach(header => {
            header.addEventListener("click", () => {
                const groupEl = header.closest(".move-group");
                const groupName = groupEl.dataset.group;
                const movesEl = groupEl.querySelector(".group-moves");
                const iconEl = header.querySelector(".collapse-icon");
                const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

                const isCollapsed = groupEl.classList.toggle("collapsed");
                movesEl.style.display = isCollapsed ? "none" : "block";
                header.classList.toggle("collapsed", isCollapsed);
                iconEl.textContent = isCollapsed ? "expand_more" : "expand_less";

                collapsedGroups[groupName] = isCollapsed;
                localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
            });
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
        const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

        // Collect only moves from non-collapsed groups
        const activeMoves = moveGroups
            .filter(g => !collapsedGroups[g.name])
            .flatMap(g => g.moves)
            .filter(m => enabledMoves[m.name])
            .map(m => m.name);

        if (activeMoves.length === 0) {
            currentMoveEl.textContent = "No moves selected!";
            return;
        }

        const move = activeMoves[Math.floor(Math.random() * activeMoves.length)];
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

    // --- Sort menu toggle ---
    sortBtn.addEventListener("click", e => {
        e.stopPropagation();
        sortMenu.classList.toggle("hidden");

        // Sync radio states when opening
        document.querySelectorAll('.sort-option input').forEach(input => {
            input.checked = input.value === currentSort;
        });
    });

    // --- Sort option selection ---
    sortMenu.addEventListener("change", e => {
        if (e.target.matches("input[name='sortOption']")) {
            currentSort = e.target.value;
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
