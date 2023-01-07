const API_URL = '/api';

main();

async function main() {
  const user = await getUsers();

  displayUsers(user);
}

function getUsers() {
  return fetch(`${API_URL}/users`)
    .then(res => res.json())
    .then(res => res.data);
}

function displayUsers(users) {
  const div = document.createElement('div');

  div.innerHTML = users.reduce((content, user) => {
    const { id, createdAt, updatedAt, username } = user;
    return content + `<div>ID: ${id}, username: ${username}, createdAt: ${createdAt}, updatedAt: ${updatedAt}</div>`;
  }, '');

  document.body.append(div);
}
