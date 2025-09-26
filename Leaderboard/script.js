// Number of rows to display per page
const rowsPerPage = 10;

// Track current page number
let currentPage = 1;

// Array to hold player data
let players = [];

// Sorting state
let sortColumn = null;
let sortAsc = true;

// Load player data from JSON file
async function loadData() {
    try {
        const response = await fetch("script.json"); // Fetch data from local JSON file
        const data = await response.json();

        // Sort players by score in descending order initially
        data.sort((a, b) => b.score - a.score);

        // Format player data and assign rank
        players = data.map((p, index) => {
            const [firstName, ...rest] = p.name.split(" ");
            return {
                rank: index + 1,
                firstName,
                lastName: rest.join(" "),
                score: p.score,
                level: p.level,
                joinDate: p.join_date,
                country: p.country,
                avatar: p.avatar_url
            };
        });

        renderTable();     // Display the table
        setupSorting();    // Enable sorting functionality
    } catch (err) {
        console.error("Error loading JSON:", err);
    }
}

// Render the table based on current page and sorting
function renderTable() {
    const tbody = document.getElementById("player-body");
    tbody.innerHTML = ""; // Clear previous rows

    // Calculate start and end index for current page
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pagePlayers = players.slice(start, end); // Get players for current page

    // Generate table rows
    pagePlayers.forEach(player => {
        const row = `
            <tr>
                <td>${player.rank}</td>
                <td><img src="${player.avatar}" class="avatar" alt="avatar"></td>
                <td>${player.firstName}</td>
                <td>${player.lastName}</td>
                <td>${player.score}</td>
                <td>${player.level}</td>
                <td>${player.joinDate}</td>
                <td>${player.country}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
    });

    // Update page info and button states
    document.getElementById("page-info").textContent =
        `Page ${currentPage} of ${Math.ceil(players.length / rowsPerPage)}`;

    document.getElementById("prev").disabled = currentPage === 1;
    document.getElementById("next").disabled =
        currentPage === Math.ceil(players.length / rowsPerPage);
}

// Handle "Previous" button click
document.getElementById("prev").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

// Handle "Next" button click
document.getElementById("next").addEventListener("click", () => {
    if (currentPage < Math.ceil(players.length / rowsPerPage)) {
        currentPage++;
        renderTable();
    }
});

// Enable sorting when clicking on table headers
function setupSorting() {
    const headers = document.querySelectorAll("th");

    // Map header text to player object keys
    const keyMap = {
        "Rank": "rank",
        "First Name": "firstName",
        "Last Name": "lastName",
        "Score": "score",
        "Level": "level",
        "Join Date": "joinDate",
        "Country": "country"
    };

    headers.forEach(header => {
        header.style.cursor = "pointer";

        header.addEventListener("click", () => {
            const key = keyMap[header.textContent];
            if (!key) return; // Skip if header is not sortable

            // Toggle sort direction or set new column
            if (sortColumn === key) {
                sortAsc = !sortAsc;
            } else {
                sortColumn = key;
                sortAsc = true;
            }

            // Sort players array
            players.sort((a, b) => {
                let valA = a[key];
                let valB = b[key];

                // Convert to numbers if applicable
                if (typeof valA === "number" || !isNaN(Number(valA))) {
                    valA = Number(valA);
                    valB = Number(valB);
                }

                // Convert to Date objects if sorting by date
                if (key === "joinDate") {
                    valA = new Date(valA);
                    valB = new Date(valB);
                }

                // Compare values
                if (valA < valB) return sortAsc ? -1 : 1;
                if (valA > valB) return sortAsc ? 1 : -1;
                return 0;
            });

            // Reassign ranks after sorting
            players.forEach((p, i) => (p.rank = i + 1));

            currentPage = 1; // Reset to first page
            renderTable();   // Re-render table
        });
    });
}

// Load leaderboard data on page load
loadData();
