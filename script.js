// ==========================================
// 1. DATA STATE & LOCALSTORAGE PERSISTENCE
// ==========================================
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

// ==========================================
// 2. DASHBOARD FUNCTIONS (index.html)
// ==========================================
function saveToStorage() {
    localStorage.setItem("trackpilot_clients", JSON.stringify(clients));
}

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

// Handle Add Client Form Submit
const addClientForm = document.getElementById("add-client-form");
if (addClientForm) {
    addClientForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("company-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const stage = document.getElementById("stage").value;

        // Form Validation
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

        clients.push(newClient);
        saveToStorage();
        renderTable();
        addClientForm.reset();
    });
}

// ==========================================
// 3. CONTACT FORM HANDLER (contact.html)
// ==========================================
const contactForm = document.getElementById("contact-form");
const contactAlert = document.getElementById("contact-alert");

if (contactForm) {
    contactForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Show success notification alert
        if (contactAlert) {
            contactAlert.classList.remove("d-none");
            setTimeout(() => contactAlert.classList.add("d-none"), 4000);
        }

        contactForm.reset();
    });
}

// Initial render execution
renderTable();