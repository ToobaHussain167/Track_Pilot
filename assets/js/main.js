import { renderNavbar } from "./navbar.js";
import { renderTable, setupClientActions } from "./clients.js";
import {
    setupAddClientForm,
    setupContactForm
} from "./forms.js";
import { fetchExternalLeads } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
    renderNavbar();

    renderTable();
    setupClientActions();
    setupAddClientForm();
    setupContactForm();

    const fetchButton = document.getElementById("btn-fetch-leads");

    if (fetchButton) {
        fetchButton.addEventListener("click", fetchExternalLeads);
    }
});