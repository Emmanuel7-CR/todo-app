'use strict';

// DOM Elements
const search = document.querySelector('.wrapper');
const addButton = document.getElementById('add-btn');
const searchInput = document.getElementById('search-input');

// State
let allTodos = getTodos();

// Initial Render
renderTodoFiltered(allTodos);
updateProgressSummary();

// Search Bar Toggle
function searchBar() {
  search.style.display = 'flex';
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredTodos = allTodos.filter((todo) =>
    todo.title.toLowerCase().includes(query) ||
    todo.description.toLowerCase().includes(query) ||
    todo.dueDate.toLowerCase().includes(query)
  );
  renderTodoFiltered(filteredTodos);
});

// Save Todos to Local Storage
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(allTodos));
}

// Get Todos from Local Storage
function getTodos() {
  const json = localStorage.getItem('todos');
  if (!json) return [];
  return JSON.parse(json).map(todo => ({
    ...todo,
    completed: todo.completed ?? false,
  }));
}

// Add New Todo
function addTodo(title, description, dueDate) {
  allTodos.push({ title, description, dueDate, completed: false });
  saveTodos();
}

// Render Todos to DOM
function renderTodoFiltered(todos) {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = "";

  todos.forEach((task, index) => {
    todoList.innerHTML += `
      <div>
        <h2 style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.title}</h2>
        <p style="${task.completed ? 'text-decoration: line-through;' : ''}">${task.description}</p>
        <p style="${task.completed ? 'text-decoration: line-through;' : ''}">Due Date: ${task.dueDate}</p>

        <h2 class="edit-option" data-index="${index}">Edit</h2>
        <h2 class="delete-option" data-index="${index}">Delete</h2>

        <button class="complete-btn ${task.completed ? 'completed' : ''}" data-index="${index}">
          ${task.completed ? 'Completed' : 'Complete'}
        </button>
      </div>
    `;
  });

  document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      allTodos[i].completed = !allTodos[i].completed;
      saveTodos();
      renderTodoFiltered(allTodos);
    });
  });

  document.querySelectorAll('.delete-option').forEach(btn => {
    btn.addEventListener('click', () => deleteTask(btn.dataset.index));
  });

  document.querySelectorAll('.edit-option').forEach(btn => {
    btn.addEventListener('click', () => editTask(btn.dataset.index));
  });

  updateProgressSummary();
}

function updateProgressSummary() {
  const completed = allTodos.filter(todo => todo.completed).length;
  const total = allTodos.length;
  const progressText = total === 0 ? "No tasks added yet." : `${completed} of ${total} tasks completed`;
  document.getElementById('progress-summary').textContent = progressText;
}

function deleteTask(index) {
  const modal = document.getElementById('confirm-modal');
  const yesBtn = document.getElementById('confirm-yes');
  const noBtn = document.getElementById('confirm-no');

  modal.style.display = 'flex';

  const confirmHandler = () => {
    allTodos.splice(index, 1);
    saveTodos();
    renderTodoFiltered(allTodos);
    modal.style.display = 'none';
    yesBtn.removeEventListener('click', confirmHandler);
    noBtn.removeEventListener('click', cancelHandler);
  };

  const cancelHandler = () => {
    modal.style.display = 'none';
    yesBtn.removeEventListener('click', confirmHandler);
    noBtn.removeEventListener('click', cancelHandler);
  };

  yesBtn.addEventListener('click', confirmHandler);
  noBtn.addEventListener('click', cancelHandler);
}

function editTask(index) {
  const todo = allTodos[index];
  const formContainer = document.getElementById('form-container');
  const todoList = document.getElementById('todo-list');
  formContainer.innerHTML = "";
  todoList.style.display = 'none';

  const form = document.createElement('form');
  const [datePart, timePart] = todo.dueDate.split(",");

  form.innerHTML = `
    <label for="task-title">Task Title</label>
    <input type="text" id="task-title" value="${todo.title}" autocomplete="off" />
    <p class="error-message">Please input the task title</p>

    <label for="task-description">Task Description</label><span>(optional)</span>
    <input type="text" id="task-description" value="${todo.description}" autocomplete="off" />

    <label for="custom-date">Due Date</label>
    <input type="date" id="custom-date" />

    <label for="custom-time">Due Time</label>
    <input type="time" id="custom-time" />
    <p class="date-error-message">Please select both date and time</p>

    <button id="update-button">Update Task</button>
  `;

  formContainer.appendChild(form);

  document.getElementById('update-button').addEventListener('click', function (event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-description').value;
    const date = document.getElementById('custom-date').value;
    const time = document.getElementById('custom-time').value;

    const error = document.querySelector('.error-message');
    const dateError = document.querySelector('.date-error-message');

    if (!title) {
      error.style.display = 'block';
    } else if (!date || !time) {
      dateError.style.display = 'block';
    } else {
      const dueDate = new Date(`${date}T${time}`).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      allTodos[index] = { ...allTodos[index], title, description: desc, dueDate };
      saveTodos();
      renderTodoFiltered(allTodos);
      formContainer.innerHTML = "";
      todoList.style.display = 'block';
    }
  });
}

function taskForm() {
  const formContainer = document.getElementById('form-container');
  const todoList = document.getElementById('todo-list');
  formContainer.innerHTML = "";
  todoList.style.display = 'none';

  const form = document.createElement('form');
  form.innerHTML = `
    <label for="task-title">Task Title</label>
    <input type="text" id="task-title" placeholder="enter task title" autocomplete="off" />
    <p class="error-message">Please input the task title</p>

    <label for="task-description">Task Description</label><span>(optional)</span>
    <input type="text" id="task-description" placeholder="enter task description" autocomplete="off" />

    <label for="custom-date">Due Date</label>
    <input type="date" id="custom-date" />

    <label for="custom-time">Due Time</label>
    <input type="time" id="custom-time" />
    <p class="date-error-message">Please select both date and time</p>

    <button id="save-button">Save Task</button>
  `;
  formContainer.appendChild(form);

  document.getElementById('save-button').addEventListener('click', function (event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-description').value;
    const date = document.getElementById('custom-date').value;
    const time = document.getElementById('custom-time').value;

    const error = document.querySelector('.error-message');
    const dateError = document.querySelector('.date-error-message');

    if (!title) {
      error.style.display = 'block';
    } else if (!date || !time) {
      dateError.style.display = 'block';
    } else {
      const dueDate = new Date(`${date}T${time}`).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      error.style.display = 'none';
      dateError.style.display = 'none';
      addTodo(title, desc, dueDate);
      renderTodoFiltered(allTodos);
      formContainer.innerHTML = "";
      todoList.style.display = 'block';
    }
  });
}

addButton.addEventListener('click', taskForm);
