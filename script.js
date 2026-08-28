// 1. DATA STATE & LOCALSTORAGE PERSISTENCE

const defaultClients = [
    { id: 101, name: "Acme Corp", email: "john@acme.com", stage: "contract-signed" },
    { id: 102, name: "TechNova", email: "sarah@technova.io", stage: "kickoff-call" },
    { id: 103, name: "CloudScale", email: "admin@cloudscale.net", stage: "access-granted" }
];

// Load saved clients from localStorage or fall back to defaults
let clients = JSON.parse(localStorage.getItem("trackpilot_clients")) || defaultClients;

const stageLabels = {
    "contract-signed": "Contract Signed",
    "kickoff-call": "Kickoff Call",
    "access-granted": "Access Granted",
    "completed": "Completed"
};

function saveToStorage() {
    localStorage.setItem("trackpilot_clients", JSON.stringify(clients));
}

// 2. DOM MANIPULATION & RENDER FUNCTIONS 

function updateQuickStats() {
    const activeElem = document.getElementById("stat-active");
    const pendingElem = document.getElementById("stat-pending");
    const completedElem = document.getElementById("stat-completed");

    if (!activeElem) return; // Exit if not on dashboard page

    const activeCount = clients.filter(c => c.stage !== "completed").length;
    const completedCount = clients.filter(c => c.stage === "completed").length;
    const pendingTasks = clients.length * 2;

    activeElem.textContent = activeCount;
    pendingElem.textContent = pendingTasks;
    completedElem.textContent = completedCount;
}

function renderTable() {
    const tableBody = document.getElementById("dashboard-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    clients.forEach((client, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>#${client.id}</strong></td>
            <td>${client.name}</td>
            <td><em>${client.email}</em></td>
            <td><span class="status-badge">${stageLabels[client.stage] || client.stage}</span></td>
            <td>
                <button class="btn btn-sm btn-danger text-white py-1 px-2" onclick="deleteClient(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    updateQuickStats();
}

function deleteClient(index) {
    clients.splice(index, 1);
    saveToStorage();
    renderTable();
}

// 3. API HANDLING: GET & POST REQUESTS (Day 2)

async function fetchExternalLeads() {
    const fetchBtn = document.getElementById("btn-fetch-leads");
    
    try {
        if (fetchBtn) {
            fetchBtn.disabled = true;
            fetchBtn.textContent = "Loading API Data...";
        }

        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        
        // Manual HTTP status code checking (Day 2)
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const users = await response.json();

        if (users.length > 0) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const newClient = {
                id: clients.length > 0 ? clients[clients.length - 1].id + 1 : 101,
                name: randomUser.company.name,
                email: randomUser.email.toLowerCase(),
                stage: "contract-signed"
            };

            clients.push(newClient);
            saveToStorage();
            renderTable();
            alert(`Successfully fetched lead "${newClient.name}" via API!`);
        }
    } catch (error) {
        console.error("Failed to fetch external leads:", error.message);
        alert(`API Request failed: ${error.message}`);
    } finally {
        if (fetchBtn) {
            fetchBtn.disabled = false;
            fetchBtn.textContent = "Fetch External Lead (API)";
        }
    }
}

/**
 * POST Request: Simulates sending a new client record to a remote backend API.
 */
async function syncClientToServer(clientData) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(clientData)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("POST Success (Status 201 Created):", result);
    } catch (error) {
        console.error("Failed to sync client to server:", error.message);
    }
}

// 4. FORM HANDLING & VALIDATION (Day 3)

const addClientForm = document.getElementById("add-client-form");
if (addClientForm) {
    addClientForm.addEventListener("submit", function(e) {
        // Prevent default browser page reload
        e.preventDefault();

        const name = document.getElementById("company-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const stage = document.getElementById("stage").value;

        // Form Validation Check
        if (name.length < 2) {
            alert("Company name must be at least 2 characters.");
            return;
        }

        const newClient = {
            id: clients.length > 0 ? clients[clients.length - 1].id + 1 : 101,
            name: name,
            email: email,
            stage: stage
        };

        // Update local state and dynamic DOM rendering
        clients.push(newClient);
        saveToStorage();
        renderTable();

        // Send POST request to API in background
        syncClientToServer(newClient);

        addClientForm.reset();
    });
}

// 5. CONTACT FORM EVENT HANDLER

const contactForm = document.getElementById("contact-form");
const contactAlert = document.getElementById("contact-alert");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (contactAlert) {
            contactAlert.classList.remove("d-none");
            setTimeout(() => contactAlert.classList.add("d-none"), 4000);
        }

        contactForm.reset();
    });
}

renderTable();