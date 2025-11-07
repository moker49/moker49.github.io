window.addEventListener("DOMContentLoaded", () => {
    // --- Build current list of all moves ---
    const allMoves = moveGroups.flatMap(g => g.moves);

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
    const semiContainer = document.querySelector(".semi-toggle-container");
    const introMessages = [
        "Hit the beat!",
        "Kick it off!",
        "Spin it up!",
        "Give it a spin!",
    ];
    currentMoveEl.textContent = introMessages[Math.floor(Math.random() * introMessages.length)];

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

        moveGroups.forEach(group => {
            const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

            // determine if group name includes "Advanced"
            const isAdvanced = group.name && group.name.toLowerCase().includes("advanced");

            // if no saved state, collapse by default unless it's Advanced
            if (!(group.name in collapsedGroups)) {
                collapsedGroups[group.name] = !isAdvanced; // collapsed unless advanced
                localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
            }

            const isCollapsed = collapsedGroups[group.name] || false;
            const sorted = [...group.moves].sort(sortModes[currentSort].fn);

            const groupHTML = `
        <div class="move-group ${isCollapsed ? "collapsed" : ""}" data-group="${group.name}">
            <h3 class="group-header ${isCollapsed ? "collapsed" : ""}" data-group="${group.name}">
            ${group.name}
            <div class="group-actions">
                <span class="material-symbols-rounded toggle-group" title="Toggle all">select_all</span>
                <span class="material-symbols-rounded collapse-icon">expand_less</span>
            </div>
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
                        <span class="move-date">
                            ${m.date
                                ? new Date(m.date).toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit"
                                })
                                : "—"}
                        </span>
                    </label>`
                    )
                    .join("")}
            </div>
        </div>`;
            moveListEl.insertAdjacentHTML("beforeend", groupHTML);
        });


        // Collapse toggle behavior
        document.querySelectorAll(".group-header").forEach(header => {
            header.addEventListener("click", (e) => {
                const header = e.target.closest(".group-header");
                if (!header) return;

                // if click was on the toggle-all icon (or the actions container), do nothing
                if (e.target.closest(".toggle-group") || e.target.closest(".group-actions")) return;
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

    // --- Toggle entire category ---
    document.addEventListener("click", (e) => {
        const toggle = e.target.closest(".toggle-group");
        if (!toggle) return;

        // prevent the document's other click handlers (like collapse) from running
        e.stopImmediatePropagation();
        e.preventDefault();

        const header = toggle.closest(".group-header");
        const groupName = header?.dataset.group;
        const group = moveGroups.find(g => g.name === groupName);
        if (!group) return;

        group.moves.forEach(m => {
            const cb = document.querySelector(`input[data-move="${m.name}"]`);
            if (cb) {
                cb.checked = !cb.checked;
                enabledMoves[m.name] = cb.checked; // ✅ keep the data model in sync
            }
        });

        localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
    });

    if (!localStorage.getItem("randomizeUsed")) {
        randomizeBtn.classList.add("first-time");
    }

    const semiUnlocked = localStorage.getItem("semiUnlocked") ?? "false";
    if (semiUnlocked === "true") {
        semiContainer.classList.add("visible");
    }

    let randomizeCount = 0;

    function pulseHighlight(target) {
        target.removeEventListener("animationend", handleAnimationEnd);
        target.classList.remove("highlight");
        void target.offsetWidth; // flush styles, restart animation timing
        target.classList.add("highlight");
        target.addEventListener("animationend", handleAnimationEnd);
        function handleAnimationEnd() {
            target.classList.remove("highlight");
            target.removeEventListener("animationend", handleAnimationEnd);
        }
    }

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

        // first-time use handling
        if (!localStorage.getItem("randomizeUsed")) {
            localStorage.setItem("randomizeUsed", "true");
            randomizeBtn.classList.remove("first-time");
        }

        randomizeCount++;

        // reveal semi toggle after 4 presses
        if (randomizeCount === 4 && semiContainer) {
            semiContainer.classList.add("visible");
            localStorage.setItem("semiUnlocked", "true");
        }

        const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};
        const enabledMoves = JSON.parse(localStorage.getItem("enabledMoves")) || {};

        const activeMoves = moveGroups
            .filter(g => !collapsedGroups[g.name])
            .flatMap(g => g.moves)
            .filter(m => enabledMoves[m.name]);

        const noMovesMsg = "Nothing to spin!";
        const settingsTabBtn = document.querySelector('[data-tab="tab-settings"]');

        if (activeMoves.length === 0) {
            if (currentMoveEl.textContent === noMovesMsg) {
                pulseHighlight(settingsTabBtn);
            } else {
                currentMoveEl.textContent = noMovesMsg;
            }
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
