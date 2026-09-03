import { clients, saveToStorage, addClient } from "./storage.js";
import { renderTable } from "./clients.js";

export async function fetchExternalLeads() {
    const fetchBtn = document.getElementById("btn-fetch-leads");

    try {
        if (fetchBtn) {
            fetchBtn.disabled = true;
            fetchBtn.textContent = "Loading API Data...";
        }

        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const users = await response.json();

        if (users.length > 0) {
            const randomUser =
                users[Math.floor(Math.random() * users.length)];

            const newClient = {
                id:
                    clients.length > 0
                        ? clients[clients.length - 1].id + 1
                        : 101,
                name: randomUser.company.name,
                email: randomUser.email.toLowerCase(),
                stage: "contract-signed"
            };

            addClient(newClient);
            saveToStorage();
            renderTable();

            alert(
                `Successfully fetched lead "${newClient.name}" via API!`
            );
        }
    } catch (error) {
        console.error(
            "Failed to fetch external leads:",
            error.message
        );

        alert(`API Request failed: ${error.message}`);
    } finally {
        if (fetchBtn) {
            fetchBtn.disabled = false;
            fetchBtn.textContent = "Fetch External Lead (API)";
        }
    }
}

export async function syncClientToServer(clientData) {
    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/posts",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clientData)
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const result = await response.json();

        console.log(
            "POST Success (Status 201 Created):",
            result
        );
    } catch (error) {
        console.error(
            "Failed to sync client to server:",
            error.message
        );
    }
}