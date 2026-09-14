

import { loadClients, saveClients, fetchClientsFromApi } from './storage.js';

export const STAGES = [
  { id: 'contract-signed', label: 'Contract Signed' },
  { id: 'kickoff-call', label: 'Kickoff Call' },
  { id: 'access-granted', label: 'Access Granted' },
  { id: 'completed', label: 'Completed' },
];

/* REACT:
   In a React version of this project, this whole file would likely
   become a <Board> component, with each column as a <StageColumn>
   component and each card as a <ClientCard> component. React would
   automatically re-render only the parts of the board that changed,
   instead of us manually clearing and rebuilding the HTML by hand
   the way renderBoard() does below. That's the main thing React
   would be doing for us here — not adding new features, just
   managing these updates more efficiently. */

/* Rebuilds the board from scratch based on the current client list.
   Called every time something changes (add, delete, fetch). */
function renderBoard(clients) {
  STAGES.forEach((stage) => {
    const column = document.querySelector(`[data-stage="${stage.id}"]`);
    if (!column) return;

    const cardsContainer = column.querySelector('[data-cards]');
    const countEl = column.querySelector('[data-count]');
    const clientsInStage = clients.filter((client) => client.stage === stage.id);

    countEl.textContent = clientsInStage.length;
    cardsContainer.innerHTML = '';

    if (clientsInStage.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'board__empty';
      empty.textContent = 'No clients at this stage yet.';
      cardsContainer.appendChild(empty);
      return;
    }

    clientsInStage.forEach((client) => {
      cardsContainer.appendChild(buildClientCard(client));
    });
  });
}

/* Builds one client card element. Uses textContent (not innerHTML) for
   the client's name, since it comes from user input / an external API
   and textContent can't be used to inject HTML. */
function buildClientCard(client) {
  const card = document.createElement('article');
  card.className = 'client-card';
  card.dataset.clientId = client.id;

  const name = document.createElement('p');
  name.className = 'client-card__name';
  name.textContent = client.name;

  const footer = document.createElement('div');
  footer.className = 'client-card__footer';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  /* Bootstrap's own outline-button classes, see components/_button.css */
  deleteBtn.className = 'btn btn-outline-danger btn-sm';
  deleteBtn.dataset.deleteId = client.id;
  deleteBtn.textContent = 'Delete';

  footer.appendChild(deleteBtn);
  card.appendChild(name);
  card.appendChild(footer);

  return card;
}

export function initDashboard() {
  const board = document.querySelector('[data-board]');
  if (!board) return; // Not on the dashboard page, stop here.

  let clients = loadClients();
  renderBoard(clients);

  /* --- Add member form --- */
  const addForm = document.querySelector('[data-add-member-form]');
  addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = addForm.elements.clientName;
    const stageSelect = addForm.elements.clientStage;
    const name = nameInput.value.trim();

    if (!name) {
      nameInput.focus();
      return;
    }

    clients.push({
      id: crypto.randomUUID(),
      name,
      stage: stageSelect.value,
    });

    saveClients(clients);
    renderBoard(clients);

    addForm.reset();
    nameInput.focus();
  });

  /* --- Fetch clients from the API button --- */
  const fetchBtn = document.querySelector('[data-fetch-clients]');
  fetchBtn.addEventListener('click', async () => {
    fetchBtn.disabled = true;
    const originalLabel = fetchBtn.textContent;
    fetchBtn.textContent = 'Fetching…';

    try {
      const fetchedClients = await fetchClientsFromApi(STAGES);
      clients = clients.concat(fetchedClients);
      saveClients(clients);
      renderBoard(clients);
      alert(`Success: ${fetchedClients.length} clients were fetched from the API.`);
    } catch (error) {
      console.error('Could not fetch clients from the API.', error);
      alert('Something went wrong: clients could not be fetched from the API. Please try again.');
    } finally {
      fetchBtn.disabled = false;
      fetchBtn.textContent = originalLabel;
    }
  });

  
  board.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('[data-delete-id]');
    if (!deleteBtn) return;

    const clientId = deleteBtn.dataset.deleteId;
    clients = clients.filter((client) => client.id !== clientId);

    saveClients(clients);
    renderBoard(clients);
  });
}
