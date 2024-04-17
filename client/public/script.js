const API_URL = '/api';

const api = {
  getUsers() {
    return fetch(`${API_URL}/users`)
    .then(res => res.json())
    .then(res => res.data);
  },
  createUser(username, password) {
    return fetch(`${API_URL}/auth/register`, { method: 'POST', body: JSON.stringify({ username, password }) })
    .then(res => res.json())
    .then(res => res.data);
  }
}

main();

async function main() {
  await fetchAndShowUsers();

  document.getElementById('create-user').addEventListener('click', createUser);
}

async function fetchAndShowUsers() {
  const users = await api.getUsers();

  displayUsers(users);
}

function displayUsers(users) {
  const id = 'users-list';
  const element = document.getElementById(id) || document.createElement('div');

  element.id = id;
  element.innerHTML = users.reduce((content, user) => {
    const { id, createdAt, updatedAt, username } = user;
    return content + `<div>ID: ${id}, username: ${username}, createdAt: ${createdAt}, updatedAt: ${updatedAt}</div>`;
  }, '');

  document.body.append(element);
}

async function createUser() {
  const [username, password] = document.getElementById('create-user-form').elements;

  await api.createUser(username.value, password.value);
  fetchAndShowUsers();
}
