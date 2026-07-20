let todos = [
  { id: 1, title: "Learn Next.js Route Handlers", done: false },
  { id: 2, title: "Build a CRUD frontend", done: false },
];
let nextId = 3;

export function getTodos() {
  return todos;
}

export function addTodo(title) {
  const newTodo = { id: nextId++, title, done: false };
  todos.push(newTodo);
  return newTodo;
}

export function updateTodo(id, updates) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return null;
  Object.assign(todo, updates);
  return todo;
}

export function deleteTodo(id) {
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}
