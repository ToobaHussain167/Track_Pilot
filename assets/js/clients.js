import { clients, saveToStorage, removeClient } from "./storage.js";
import { stageLabels } from "./data.js";

export function updateQuickStats() {
    const activeElem = document.getElementById("stat-active");
    const pendingElem = document.getElementById("stat-pending");
    const completedElem = document.getElementById("stat-completed");

    if (!activeElem) return;

    const activeCount = clients.filter(
        (client) => client.stage !== "completed"
    ).length;

    const completedCount = clients.filter(
        (client) => client.stage === "completed"
    ).length;

    const pendingTasks = clients.length * 2;

    activeElem.textContent = activeCount;
    pendingElem.textContent = pendingTasks;
    completedElem.textContent = completedCount;
}

export function renderTable() {
    const tableBody = document.getElementById("dashboard-table-body");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    clients.forEach((client, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td><strong>#${client.id}</strong></td>
            <td>${client.name}</td>
            <td><em>${client.email}</em></td>
            <td>
                <span class="status-badge">
                    ${stageLabels[client.stage] || client.stage}
                </span>
            </td>
            <td>
                <button
                    class="btn btn-sm btn-danger text-white py-1 px-2"
                    data-client-index="${index}"
                >
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    updateQuickStats();
}

export function deleteClient(index) {
    removeClient(index);
    saveToStorage();
    renderTable();
}

export function setupClientActions() {
    const tableBody = document.getElementById("dashboard-table-body");

    if (!tableBody) return;

    tableBody.addEventListener("click", (event) => {
        const deleteButton = event.target.closest("[data-client-index]");

        if (!deleteButton) return;

        const index = Number(deleteButton.dataset.clientIndex);

        deleteClient(index);
    });
}