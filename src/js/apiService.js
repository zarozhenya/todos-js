const BASE_URL = "https://62fbde66abd610251c12ab0b.mockapi.io/todo";

export const createTodo = (newTodo) =>
  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(newTodo),
    headers: { "Content-type": "application/json" },
  }).then((res) => res.json());

export const readTodos = () => fetch(BASE_URL).then((res) => res.json());

export const updateTodo = (idTodo, payload) =>
  fetch(`${BASE_URL}/${idTodo}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deleteTodo = (idToDelete) =>
  fetch(`${BASE_URL}/${idToDelete}`, { method: "DELETE" });
