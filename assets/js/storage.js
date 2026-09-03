import { defaultClients } from "./data.js";

export let clients =
    JSON.parse(localStorage.getItem("trackpilot_clients")) ||
    defaultClients;

export function saveToStorage() {
    localStorage.setItem(
        "trackpilot_clients",
        JSON.stringify(clients)
    );
}

export function addClient(client) {
    clients.push(client);
}

export function removeClient(index) {
    clients.splice(index, 1);
}