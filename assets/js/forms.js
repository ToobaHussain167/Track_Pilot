import { clients, saveToStorage, addClient } from "./storage.js";
import { renderTable } from "./clients.js";
import { syncClientToServer } from "./api.js";

export function setupAddClientForm() {
    const addClientForm =
        document.getElementById("add-client-form");

    if (!addClientForm) return;

    addClientForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document
            .getElementById("company-name")
            .value
            .trim();

        const email = document
            .getElementById("contact-email")
            .value
            .trim();

        const stage =
            document.getElementById("stage").value;

        if (name.length < 2) {
            alert(
                "Company name must be at least 2 characters."
            );
            return;
        }

        const newClient = {
            id:
                clients.length > 0
                    ? clients[clients.length - 1].id + 1
                    : 101,
            name: name,
            email: email,
            stage: stage
        };

        addClient(newClient);
        saveToStorage();
        renderTable();

        syncClientToServer(newClient);

        addClientForm.reset();
    });
}

export function setupContactForm() {
    const contactForm =
        document.getElementById("contact-form");

    const contactAlert =
        document.getElementById("contact-alert");

    if (!contactForm) return;

    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (contactAlert) {
            contactAlert.classList.remove("d-none");

            setTimeout(() => {
                contactAlert.classList.add("d-none");
            }, 4000);
        }

        contactForm.reset();
    });
}