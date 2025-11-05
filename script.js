window.addEventListener("DOMContentLoaded", () => {
    // --- Build current list of all moves ---
    const allMoves = moveGroups.flatMap(g => g.moves);
    const allMoveNames = allMoves.map(m => m.name);

    // --- Load saved moves, clean up, and merge defaults ---
    let savedMoves = JSON.parse(localStorage.getItem("enabledMoves")) || {};
    let savedMeta = JSON.parse(localStorage.getItem("moveMeta")) || {};
    let enabledMoves = {};
    let newMeta = {}; // we'll rebuild this fresh

    // Keep only valid moves and fill missing ones
    for (const move of allMoves) {
        const wasSaved = move.name in savedMoves;
        const previouslyEnabled = savedMoves[move.name];
        const prev = savedMeta[move.name] || {};

        const hasDate = !!move.date;
        const hasCategory = !!move.category;

        // detect if a date or category was newly added
        const dateWasAdded = hasDate && !prev.date;
        const categoryWasAdded = hasCategory && !prev.category;
        const autoEnable = dateWasAdded || categoryWasAdded;

        if (!wasSaved) {
            // New move: enabled if it already has a date
            enabledMoves[move.name] = hasDate;
        } else if (autoEnable) {
            // Metadata was added since last load → force-enable
            enabledMoves[move.name] = true;
        } else {
            // Otherwise preserve user’s previous choice
            enabledMoves[move.name] = previouslyEnabled;
        }

        // Save new metadata snapshot for next comparison
        newMeta[move.name] = { date: hasDate, category: hasCategory };
    }

    // Save the cleaned version back to storage
    localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
    localStorage.setItem("moveMeta", JSON.stringify(newMeta));


    const moveListEl = document.getElementById("moveList");
    const randomizeBtn = document.getElementById("randomizeBtn");
    const currentMoveEl = document.getElementById("currentMove");
    const sortBtn = document.getElementById("sortBtn");
    const sortMenu = document.getElementById("sortMenu");
    const semiToggle = document.getElementById("semiToggle");

    const sortModes = {
        alphaAsc: { label: "Alphabetical", fn: (a, b) => a.name.localeCompare(b.name) },
        dateDesc: {
            label: "Newest First",
            fn: (a, b) => {
                const da = a.date ? new Date(a.date) : new Date(0);
                const db = b.date ? new Date(b.date) : new Date(0);
                return db - da;
            }
        },
        dateAsc: {
            label: "Oldest First",
            fn: (a, b) => {
                const da = a.date ? new Date(a.date) : new Date(8640000000000000);
                const db = b.date ? new Date(b.date) : new Date(8640000000000000);
                return da - db;
            }
        }
    };

    let currentSort = localStorage.getItem("sortMode") || "dateDesc";

    // --- Semi toggle state management ---
    let semiEnabled = localStorage.getItem("semiEnabled") === "true";

    function syncSemiUI() {
        semiToggle.checked = semiEnabled;
    }

    semiToggle.addEventListener("change", () => {
        semiEnabled = semiToggle.checked;
        localStorage.setItem("semiEnabled", String(semiEnabled));
        syncSemiUI();
    });

    syncSemiUI();

    // --- Render the move list ---
    function renderMoveList() {
        moveListEl.innerHTML = "";
        const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

        moveGroups.forEach(group => {
            const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};
            const isUncategorized = !group.name || group.name.toLowerCase() === "uncategorized";
            const isPartnerwork = !group.name || group.name.toLowerCase().includes("men's");

            if (!(group.name in collapsedGroups) && (isUncategorized || isPartnerwork)) {
                collapsedGroups[group.name] = true;
                localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
            }

            const isCollapsed = collapsedGroups[group.name] || false;
            const sorted = [...group.moves].sort(sortModes[currentSort].fn);

            const groupHTML = `
                <div class="move-group ${isCollapsed ? "collapsed" : ""}" data-group="${group.name}">
                    <h3 class="group-header ${isCollapsed ? "collapsed" : ""}">
                        ${group.name}
                        <span class="material-symbols-rounded collapse-icon">
                            expand_less
                        </span>
                    </h3>
                    <div class="group-moves" style="display:${isCollapsed ? "none" : "block"}">
                        ${sorted.map(m => `
                            <label class="move-item">
                                <div class="checkbox-wrapper">
                                    <input type="checkbox" data-move="${m.name}" ${enabledMoves[m.name] ? "checked" : ""}>
                                    <span class="checkbox-custom"></span>
                                </div>
                                <span class="move-name">${m.name}</span>
                                <span class="move-date">
                                    ${m.date
                    ? new Date(m.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
                    : "—"}
                                </span>
                            </label>`).join("")}
                    </div>
                </div>`;
            moveListEl.insertAdjacentHTML("beforeend", groupHTML);
        });

        // Collapse toggle behavior
        document.querySelectorAll(".group-header").forEach(header => {
            header.addEventListener("click", () => {
                const groupEl = header.closest(".move-group");
                const groupName = groupEl.dataset.group;
                const movesEl = groupEl.querySelector(".group-moves");
                const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

                const isCollapsed = groupEl.classList.toggle("collapsed");
                movesEl.style.display = isCollapsed ? "none" : "block";
                header.classList.toggle("collapsed", isCollapsed);

                collapsedGroups[groupName] = isCollapsed;
                localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
            });
        });
    }

    renderMoveList();

    // --- Save move changes ---
    moveListEl.addEventListener("change", e => {
        if (e.target.matches("input[type='checkbox']")) {
            const move = e.target.dataset.move;
            enabledMoves[move] = e.target.checked;
            localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
        }
    });

    // --- Randomizer logic ---
    let lastRandomMove = null;
    randomizeBtn.addEventListener("click", () => {
        // animation
        const icon = randomizeBtn.querySelector(".material-symbols-rounded");
        if (icon) {
            icon.classList.remove("spin");
            void icon.offsetWidth; // force reflow so animation restarts
            icon.classList.add("spin");
        }

        const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

        const activeMoves = moveGroups
            .filter(g => !collapsedGroups[g.name])
            .flatMap(g => g.moves)
            .filter(m => enabledMoves[m.name]);

        if (activeMoves.length === 0) {
            currentMoveEl.textContent = "No moves selected!";
            return;
        }

        let moveObj;
        if (activeMoves.length === 1) {
            moveObj = activeMoves[0];
        } else {
            do {
                moveObj = activeMoves[Math.floor(Math.random() * activeMoves.length)];
            } while (moveObj.name === lastRandomMove);
        }

        lastRandomMove = moveObj.name;

        let displayName = moveObj.name;
        if (semiEnabled && moveObj.semi && Math.random() < 0.50) {
            displayName += " (semi)";
        }

        currentMoveEl.style.opacity = 0;
        setTimeout(() => {
            currentMoveEl.textContent = displayName;
            currentMoveEl.style.opacity = 1;
        }, 150);
    });

    // --- Tab switching ---
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");

            const tab = btn.dataset.tab;
            document.getElementById(tab).classList.add("active");

            // Stop any leftover spin animation when switching tabs
            const icon = randomizeBtn.querySelector(".material-symbols-rounded");
            if (icon) icon.classList.remove("spin");

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

    document.addEventListener("click", e => {
        if (!sortMenu.classList.contains("hidden")) {
            sortMenu.classList.add("hidden");
        }
    });
});
