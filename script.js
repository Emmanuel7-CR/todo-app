'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging.js';

const firebaseConfig = {
  apiKey: "AIzaSyDfT-dd5B30EcCeHHbZ-iIzRwVg1sLP0ek",
  authDomain: "todo-reminder-app-6cab6.firebaseapp.com",
  projectId: "todo-reminder-app-6cab6",
  messagingSenderId: "361450721360",
  appId: "1:361450721360:web:acaff1832005963e9c0155"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function getPushToken() {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BPY2MxTs0UUWymlN9eHvZSzERaipZ8Gh7l55DXnXSOsKy5enxQmg0VvuVN5PpKxlMi_vs0jpMsbOj5mrY2YsuA4"
    });

    if (token) {
      console.log("🔐 Push token:", token);
    } else {
      console.warn("⚠️ No registration token available.");
    }
  } catch (err) {
    console.error("❌ Error retrieving token:", err);
  }
}
getPushToken();

if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('✅ Notification permission granted.');
    } else {
      console.log('❌ Notification permission denied.');
    }
  });
}

// === SOUND SETUP ===
const alertSound = new Audio('sounds/alert.mp3');
alertSound.load();

// === REMINDER LOOP ===
function checkAndSendReminders() {
  const now = new Date();
  allTodos.forEach((todo, index) => {
    const dueTime = new Date(todo.dueDate);
    if (
      !todo.completed &&
      todo.reminderCount === 0 &&
      Math.abs(now - dueTime) <= 15000
    ) {
      console.log(`🕒 Task due: ${todo.title} at ${dueTime.toLocaleString()}`);
      sendReminderNotification(todo.title, todo.description);
      allTodos[index].reminderCount += 1;
      saveTodos();
    }
  });
}



const addButton = document.getElementById('add-btn');
const searchInput = document.getElementById('search-input');

//Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('search-icon');
  const searchWrapper = document.getElementById('search-wrapper');
  const searchInput = document.getElementById('search-input');
  const installBtn = document.getElementById('install-button'); // ✅ Declare once

  // === Search Box Logic ===
  if (searchBtn && searchWrapper && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchWrapper.style.display = 'flex';
      searchInput.focus();
    });

    searchWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    document.addEventListener('click', () => {
      searchWrapper.style.display = 'none';

      const query = searchInput.value.trim().toLowerCase();
      const matchExists = allTodos.some(todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query) ||
        todo.dueDate.toLowerCase().includes(query)
      );

      if (!matchExists && query !== '') {
        searchInput.value = '';
        renderTodoFiltered(allTodos);
      }
    });
  }

  // === Custom Install Button Logic ===
let deferredPrompt = null;


// Function to adjust install button label based on screen size
function updateInstallButton() {
  if (!installBtn) return;
  if (window.innerWidth <= 480) {
    installBtn.textContent = '📲';
  } else {
    installBtn.textContent = '📲 Install App';
  }
}

// Run initially
updateInstallButton();

// Update whenever screen is resized
window.addEventListener('resize', updateInstallButton);

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.classList.add('pulse');

    setTimeout(() => {
      installBtn.classList.remove('pulse');
    }, 4500);

    installBtn.addEventListener('click', async () => {
      installBtn.style.display = 'none';

      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install: ${outcome}`);
        deferredPrompt = null;
      }
    });
  }
});

});


let allTodos = getTodos();
renderTodoFiltered(allTodos);
updateProgressSummary();


searchInput.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filteredTodos = allTodos.filter(todo =>
    todo.title.toLowerCase().includes(query) ||
    todo.description.toLowerCase().includes(query) ||
    todo.dueDate.toLowerCase().includes(query)
  );
  renderTodoFiltered(filteredTodos);
});

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(allTodos));
}

function getTodos() {
  const json = localStorage.getItem('todos');
  if (!json) return [];
  return JSON.parse(json).map(todo => ({
    ...todo,
    completed: todo.completed ?? false,
  }));
}

function addTodo(title, description, dueDateISO) {
  allTodos.push({
    title,
    description,
    dueDate: dueDateISO,
    completed: false,
    reminderCount: 0
  });
  saveTodos();
}

function renderTodoFiltered(todos) {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = "";

  todos.forEach((task, index) => {
    todoList.innerHTML += `
      <div>
        <h2 style="${task.completed ? 'text-decoration: line-through;' : ''}">
         ${task.title} ${!task.completed && new Date(task.dueDate) < new Date() ? '⚠️' : ''}
        </h2>
        <p style="${task.completed ? 'text-decoration: line-through;' : ''}">
          Due Date: ${new Date(task.dueDate).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
        ${!task.completed && new Date(task.dueDate) < new Date() ? `
          <span style="background: red; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
            OVERDUE
          </span>` : ''}
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
  form.innerHTML = `
    <div class="floating-input">
      <input type="text" id="task-title" value="${todo.title}" autocomplete="off" />
      <label for="task-title">Task Title</label>
    </div>
    <p class="error-message">Please input the task title</p>
    <div class="floating-input">
      <input type="text" id="task-description" value="${todo.description}" autocomplete="off" />
      <label for="task-description">Task Description</label>
    </div>
    <div class="non-floating-input">
      <label for="custom-date">Due Date</label>
      <input type="date" id="custom-date" />
    </div>
    <div class="non-floating-input">
      <label for="custom-time">Due Time</label>
      <input type="time" id="custom-time" />
    </div>
    <p class="date-error-message">Please select both date and time</p>
    <button id="update-button">Update Task</button>
    <button type="button" id="cancel-button" style="margin-top: 8px;">Cancel</button>
  `;
  formContainer.appendChild(form);

  document.querySelectorAll('.floating-input input').forEach(input => {
    const checkInput = () => {
      input.classList.toggle('not-empty', input.value.trim() !== '');
    };
    input.addEventListener('input', checkInput);
    input.addEventListener('blur', checkInput);
    checkInput();
  });

  document.getElementById('cancel-button').addEventListener('click', () => {
    history.back();
    formContainer.innerHTML = "";
    todoList.style.display = 'block';
  });

  const titleInput = document.getElementById('task-title');
  const error = document.querySelector('.error-message');
  titleInput.addEventListener('input', () => {
    if (titleInput.value.trim() !== '') error.style.display = 'none';
  });

  document.getElementById('update-button').addEventListener('click', function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const desc = document.getElementById('task-description').value;
    const date = document.getElementById('custom-date').value;
    const time = document.getElementById('custom-time').value;
    const dateError = document.querySelector('.date-error-message');

    if (!title) {
      error.style.display = 'block';
    } else if (!date || !time) {
      dateError.style.display = 'block';
    } else {
      const isoDate = new Date(`${date}T${time}`).toISOString();
      allTodos[index] = { ...allTodos[index], title, description: desc, dueDate: isoDate, reminderCount: 0 };
      saveTodos();
      renderTodoFiltered(allTodos);
      formContainer.innerHTML = "";
      todoList.style.display = 'block';
      history.pushState({ page: 'form' }, '', '#form');
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
    <div class="floating-input">
      <input type="text" id="task-title" autocomplete="off" />
      <label for="task-title">Task Title</label>
    </div>
    <p class="error-message">Please input the task title</p>
    <div class="floating-input">
      <input type="text" id="task-description" autocomplete="off" />
      <label for="task-description">Task Description</label>
    </div>
    <div class="non-floating-input">
      <label for="custom-date">Due Date</label>
      <input type="date" id="custom-date" />
    </div>
    <div class="non-floating-input">
      <label for="custom-time">Due Time</label>
      <input type="time" id="custom-time" />
    </div>
    <p class="date-error-message">Please select both date and time</p>
    <button id="save-button">Save Task</button>
    <button type="button" id="cancel-button" style="margin-top: 8px;">Cancel</button>
  `;
  formContainer.appendChild(form);

  document.querySelectorAll('.floating-input input').forEach(input => {
    const checkInput = () => {
      input.classList.toggle('not-empty', input.value.trim() !== '');
    };
    input.addEventListener('input', checkInput);
    input.addEventListener('blur', checkInput);
    checkInput();
  });

  document.getElementById('cancel-button').addEventListener('click', () => {
    history.back();
    formContainer.innerHTML = "";
    todoList.style.display = 'block';
  });

  const titleInput = document.getElementById('task-title');
  const error = document.querySelector('.error-message');
  titleInput.addEventListener('input', () => {
    if (titleInput.value.trim() !== '') error.style.display = 'none';
  });

  document.getElementById('save-button').addEventListener('click', function (event) {
    event.preventDefault();
    const title = titleInput.value;
    const desc = document.getElementById('task-description').value;
    const date = document.getElementById('custom-date').value;
    const time = document.getElementById('custom-time').value;
    const dateError = document.querySelector('.date-error-message');

    if (!title) {
      error.style.display = 'block';
    } else if (!date || !time) {
      dateError.style.display = 'block';
    } else {
      const isoDate = new Date(`${date}T${time}`).toISOString();
      addTodo(title, desc, isoDate);
      saveTodos();
      renderTodoFiltered(allTodos);
      formContainer.innerHTML = "";
      todoList.style.display = 'block';
    }
  });

  history.pushState({ page: 'form' }, '', '#form');
}






function sendReminderNotification(title, description) {
  if (Notification.permission === 'granted') {
    new Notification('🔔 Task Reminder', {
      body: `${title}\n${description || ''}`,
      icon: 'icons/icon-192.png'
    });

    alertSound.play().catch(() => {
      console.warn("🔇 Sound playback blocked (user gesture needed).");
    });
  }
}


function startReminderLoop() {
  console.log("🔁 Reminder loop started");
  checkAndSendReminders();
  setInterval(checkAndSendReminders, 5000); // 5 seconds for testing
}


// Final setup
addButton.addEventListener('click', taskForm);

window.addEventListener('popstate', (event) => {
  if (event.state && event.state.page === 'form') {
    document.getElementById('form-container').innerHTML = "";
    document.getElementById('todo-list').style.display = 'block';
  }
});




// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then(reg => console.log('✅ Service Worker registered:', reg.scope))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}


// === Call Reminder Loop after DOM Ready ===
document.addEventListener('DOMContentLoaded', () => {
  startReminderLoop();
});
