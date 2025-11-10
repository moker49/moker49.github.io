window.addEventListener("DOMContentLoaded", () => {

    // --- Load user state or start empty (no auto-enables) ---
    let savedMoves = JSON.parse(localStorage.getItem("enabledMoves"));
    let enabledMoves = {};

    // First launch: no saved state, nothing pre-enabled
    if (!savedMoves) {
        moveGroups.forEach(g => g.moves.forEach(m => {
            enabledMoves[m.name] = false;
        }));
        localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
    } else {
        // Existing user → restore exactly what they had before
        enabledMoves = savedMoves;
    }

    // Save the cleaned version back to storage
    localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));

    const moveListEl = document.getElementById("moveList");
    const randomizeBtn = document.getElementById("randomizeBtn");
    const currentMoveEl = document.getElementById("currentMove");
    const sortBtn = document.getElementById("sortBtn");
    const sortMenu = document.getElementById("sortMenu");
    const semiButtons = document.querySelectorAll(".semi-toggle-group .md3-segment");
    const semiContainer = document.querySelector(".semi-toggle-container");
    const groupToggleBtn = document.getElementById("groupToggleBtn");
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
    let semiEnabled = localStorage.getItem("semiEnabled") || "false";

    updateSemiButtons();

    semiButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            semiEnabled = btn.dataset.value;
            localStorage.setItem("semiEnabled", semiEnabled);
            updateSemiButtons();
        });
    });

    function updateSemiButtons() {
        semiButtons.forEach(b => b.classList.toggle("active", b.dataset.value === semiEnabled));
    }

    let showGrouped = localStorage.getItem("showGrouped");
    if (showGrouped === null) {
        showGrouped = true;
    } else {
        showGrouped = showGrouped === "true";
    }

    groupToggleBtn.addEventListener("click", () => {
        showGrouped = !showGrouped;
        localStorage.setItem("showGrouped", showGrouped);
        renderMoveList();
        // updateGroupToggleIcon();
    });

    function updateGroupToggleIcon() {
        const icon = groupToggleBtn.querySelector(".material-symbols-rounded");
        icon.textContent = showGrouped ? "format_list_bulleted" : "table_rows";
        groupToggleBtn.title = showGrouped ? "Show all moves" : "Show grouped";
    }

    // --- Render the move list ---
    function renderMoveList() {
        moveListEl.innerHTML = "";

        if (showGrouped) {
            moveGroups.forEach(group => {
                const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};
                const isAdvanced = group.name && group.name.toLowerCase().includes("advanced");

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
                    <div class="group-moves${isCollapsed ? "" : " expanded"}">
                        ${sorted.map(m => `
                        <label class="move-item">
                            <div class="checkbox-wrapper">
                            <input type="checkbox" data-move="${m.name}" ${enabledMoves[m.name] ? "checked" : ""}>
                            <span class="checkbox-custom"></span>
                            </div>
                            <span class="move-name">${m.name}</span>
                            <span class="move-meta">
                            ${m.semi ? '<span class="semi-indicator" title="Can be semi"></span>' : ''}
                            <span class="move-date">
                                ${m.date
                        ? new Date(m.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
                        : "—"}
                            </span>
                            </span>
                        </label>
                        `).join("")}
                    </div>
                </div>`;
                moveListEl.insertAdjacentHTML("beforeend", groupHTML);
            });
        } else {
            const allMoves = moveGroups.flatMap(g => g.moves);
            const sorted = [...allMoves].sort(sortModes[currentSort].fn);

            const groupHTML = `
            <div class="move-group expanded" data-group="all">
                <h3 class="group-header" data-group="all">
                    All Moves
                    <div class="group-actions">
                        <span class="material-symbols-rounded toggle-group" title="Toggle all">select_all</span>
                        <span class="material-symbols-rounded collapse-icon">expand_less</span>
                    </div>
                </h3>
                <div class="group-moves expanded">
                    ${sorted.map(m => `
                        <label class="move-item">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" data-move="${m.name}" ${enabledMoves[m.name] ? "checked" : ""}>
                                <span class="checkbox-custom"></span>
                            </div>
                            <span class="move-name">${m.name}</span>
                            <span class="move-meta">
                                ${m.semi ? '<span class="semi-indicator" title="Can be semi"></span>' : ''}
                                <span class="move-date">
                                    ${m.date
                    ? new Date(m.date).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })
                    : "—"}
                                </span>
                            </span>
                        </label>
                    `).join("")}
                </div>
            </div>`;

            moveListEl.insertAdjacentHTML("beforeend", groupHTML);
        }

        function toggleHeight(el, expand) {
            if (expand) {
                const endHeight = el.scrollHeight; // exact pixel height
                el.style.height = endHeight + "px";
            } else {
                el.style.height = el.scrollHeight + "px"; // set current height
                el.offsetHeight; // force reflow
                el.style.height = "0";
            }
        }

        // Collapse toggle behavior
        document.querySelectorAll(".group-header").forEach(header => {
            header.addEventListener("click", e => {
                const headerEl = e.target.closest(".group-header");
                if (!headerEl) return;
                if (headerEl.dataset.group === "all") return;

                const collapseIcon = e.target.closest(".collapse-icon");
                const toggleGroupBtn = e.target.closest(".toggle-group");

                // Clicking the toggle-all icon still does nothing (as before)
                if (toggleGroupBtn) return;

                const groupEl = headerEl.closest(".move-group");
                const movesEl = groupEl.querySelector(".group-moves");
                const groupName = groupEl.dataset.group;
                const collapsedGroups = JSON.parse(localStorage.getItem("collapsedGroups")) || {};

                // If clicked on collapse icon or anywhere on header → toggle collapse
                if (collapseIcon || headerEl) {
                    const isCollapsed = groupEl.classList.toggle("collapsed");
                    headerEl.classList.toggle("collapsed", isCollapsed);
                    movesEl.classList.toggle("expanded", !isCollapsed);
                    toggleHeight(movesEl, !isCollapsed);

                    collapsedGroups[groupName] = isCollapsed;
                    localStorage.setItem("collapsedGroups", JSON.stringify(collapsedGroups));
                }
            });
        });

        const expandedEls = document.querySelectorAll(".group-moves.expanded");
        expandedEls.forEach(el => {
            const prev = el.style.transition;
            el.style.transition = "none";
            el.style.height = "auto";
            el.offsetHeight;
            el.style.transition = prev;
        });

    }

    renderMoveList();

    semiContainer.classList.add("no-transition");
    requestAnimationFrame(() => {
        semiContainer.classList.remove("no-transition");
    });

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

        const groupHeader = toggle.closest(".group-header");
        if (!groupHeader) return;

        const groupName = groupHeader.dataset.group;
        let movesToToggle = [];

        if (groupName === "all") {
            movesToToggle = moveGroups.flatMap(g => g.moves);
        } else {
            const group = moveGroups.find(g => g.name === groupName);
            if (!group) return;
            movesToToggle = group.moves;
        }

        const allChecked = movesToToggle.every(m => enabledMoves[m.name]);
        const newState = !allChecked;

        movesToToggle.forEach(m => {
            const cb = document.querySelector(`input[data-move="${m.name}"]`);
            if (cb) {
                cb.checked = newState;
                enabledMoves[m.name] = newState;
            }
        });

        localStorage.setItem("enabledMoves", JSON.stringify(enabledMoves));
    });

    if (!localStorage.getItem("randomizeUsed")) {
        randomizeBtn.classList.add("first-time");
    }

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
        let chance = semiEnabled === "full" ? 1.0 : semiEnabled === "true" ? 0.35 : 0.0;
        if (semiEnabled && moveObj.semi && Math.random() < chance) {
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
            // reset nav + tabs
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
            btn.classList.add("active");

            // activate tab
            const tab = btn.dataset.tab;
            document.getElementById(tab).classList.add("active");

            // Stop any leftover spin animation when switching tabs
            const icon = randomizeBtn.querySelector(".material-symbols-rounded");
            if (icon) icon.classList.remove("spin");

            // visibility
            if (tab === "tab-settings") {
                sortBtn.style.visibility = "visible";
                groupToggleBtn.style.visibility = "visible";
                semiContainer.classList.add("visible");
            } else {
                sortBtn.style.visibility = "hidden";
                sortMenu.classList.add("hidden");
                groupToggleBtn.style.visibility = "hidden";
                semiContainer.classList.remove("visible");
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

    // Elements that get a one-time dot
    const notifTargets = {
        sortBtn: document.getElementById("sortBtn"),
        groupToggleBtn: document.getElementById("groupToggleBtn"),
    };

    // Load stored cleared states
    const seenState = JSON.parse(localStorage.getItem("seenDots") || "{}");

    // Helper to show/hide dots
    function updateDots() {
        Object.entries(notifTargets).forEach(([key, el]) => {
            if (!seenState[key]) el.classList.add("has-dot");
            else el.classList.remove("has-dot");
        });
    }

    // Click handler that clears the dot
    function clearDot(key) {
        seenState[key] = true;
        localStorage.setItem("seenDots", JSON.stringify(seenState));
        updateDots();
    }

    // Attach once listeners
    notifTargets.sortBtn?.addEventListener("click", () => clearDot("sortBtn"));
    notifTargets.groupToggleBtn?.addEventListener("click", () => clearDot("groupToggleBtn"));

    // Initial draw
    updateDots();
});
