

const STORAGE_KEY = 'trackpilot-clients';
const API_URL = 'https://jsonplaceholder.typicode.com/users';


export function loadClients() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Saved client data was corrupted, ignoring it.', error);
    return [];
  }
}

export function saveClients(clients) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}


export async function fetchClientsFromApi(stages) {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  const users = await response.json();

  return users.slice(0, 6).map((user, index) => ({
    id: crypto.randomUUID(),
    name: user.name,
    stage: stages[index % stages.length].id,
  }));
}
