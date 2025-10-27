'use strict';

// === EXTERNAL DEPENDENCIES ===
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging.js';

// Note: Ensure localForage is loaded in index.html:
// <script src="https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js"></script>

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

// === GLOBAL STATE ===
let allTodos = [];

// === STORAGE KEYS ===
const STORAGE_KEY = 'todos_v2';
const SETTINGS_KEY = 'user_settings';

// === DEFAULT SETTINGS ===
const DEFAULT_SETTINGS = {
  soundEnabled: true,
  reminderLeadTimeMinutes: 15,
  snoozeMinutes: 5
};

// === STORAGE HELPERS ===
async function saveTodos() {
  try {
    await localForage.setItem(STORAGE_KEY, allTodos);
    localStorage.removeItem('todos'); // cleanup legacy
  } catch (e) {
    showToast('Failed to save tasks.', 'error');
    console.error(e);
  }
}

async function loadTodos() {
  try {
    const todos = await localForage.getItem(STORAGE_KEY);
    if (todos) return todos;

    const legacy = localStorage.getItem('todos');
    if (legacy) {
      const parsed = JSON.parse(legacy).map(t => ({ ...t, completed: t.completed ?? false }));
      await localForage.setItem(STORAGE_KEY, parsed);
      localStorage.removeItem('todos');
      return parsed;
    }
    return [];
  } catch (e) {
    console.warn('Failed to load todos, using empty list.', e);
    return [];
  }
}

async function loadSettings() {
  try {
    const saved = await localForage.getItem(SETTINGS_KEY);
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch (e) {
    console.warn('Failed to load settings, using defaults.', e);
    return DEFAULT_SETTINGS;
  }
}

async function saveSettings(settings) {
  try {
    await localForage.setItem(SETTINGS_KEY, settings);
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// === UI RENDERING ===
function renderTodoFiltered(todos) {
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = allTodos.length === 0 
      ? '📭 No tasks yet. Tap "+" to add one!' 
      : '🔍 No tasks match your search.';
    empty.style.cssText = 'text-align: center; margin-top: 100px; color: var(--secondary-color);';
    todoList.appendChild(empty);
  }

  todos.forEach((task, index) => {
    const div = document.createElement('div');

    const titleEl = document.createElement('h2');
    titleEl.textContent = task.title;
    if (task.completed) titleEl.style.textDecoration = 'line-through';
    if (!task.completed && new Date(task.dueDate) < new Date()) {
      titleEl.textContent += ' ⚠️';
    }

    const dueDate = new Date(task.dueDate).toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const dueEl = document.createElement('p');
    dueEl.textContent = `Due Date: ${dueDate}`;
    if (task.completed) dueEl.style.textDecoration = 'line-through';

    const container = document.createElement('div');
    container.appendChild(titleEl);
    container.appendChild(dueEl);

    if (!task.completed && new Date(task.dueDate) < new Date()) {
      const overdue = document.createElement('span');
      overdue.textContent = 'OVERDUE';
      overdue.style.cssText = "background: red; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;";
      container.appendChild(overdue);
    }

    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-option';
    viewBtn.dataset.index = index;
    viewBtn.setAttribute('aria-label', `View task: ${task.title}`);
    viewBtn.textContent = 'View';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-option';
    editBtn.dataset.index = index;
    editBtn.setAttribute('aria-label', `Edit task: ${task.title}`);
    editBtn.textContent = 'Edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-option';
    deleteBtn.dataset.index = index;
    deleteBtn.setAttribute('aria-label', `Delete task: ${task.title}`);
    deleteBtn.textContent = 'Delete';

    const completeBtn = document.createElement('button');
    completeBtn.className = `complete-btn ${task.completed ? 'completed' : ''}`;
    completeBtn.dataset.index = index;
    completeBtn.textContent = task.completed ? 'Completed' : 'Complete';

div.appendChild(container);
div.appendChild(viewBtn);
div.appendChild(editBtn);
div.appendChild(deleteBtn);
div.appendChild(completeBtn);
todoList.appendChild(div);
  });

  // Reattach event listeners
  document.querySelectorAll('.complete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.index;
      allTodos[i].completed = !allTodos[i].completed;
      saveTodos();
      renderTodoFiltered(allTodos);
    });
  });

  document.querySelectorAll('.view-option').forEach(btn => {
  btn.addEventListener('click', () => viewTask(btn.dataset.index));
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

// === TASK OPERATIONS ===
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

function deleteTask(index) {
  const modal = document.getElementById('confirm-modal');
  const yesBtn = document.getElementById('confirm-yes');
  const noBtn = document.getElementById('confirm-no');

  modal.style.display = 'flex';
  trapFocusInModal(modal);

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

function viewTask(index) {
  const todo = allTodos[index];
  const modal = document.getElementById('view-modal');
  const modalTitle = document.getElementById('view-title');
  const modalDescription = document.getElementById('view-description');
  const modalDueDate = document.getElementById('view-due-date');
  const modalStatus = document.getElementById('view-status');
  const closeBtn = document.getElementById('view-close');

  // Populate modal content
  modalTitle.textContent = todo.title;
  modalDescription.textContent = todo.description || 'No description provided';
  
  const dueDate = new Date(todo.dueDate).toLocaleString('en-NG', {
    dateStyle: 'full',
    timeStyle: 'short'
  });
  modalDueDate.textContent = dueDate;
  
  modalStatus.textContent = todo.completed ? '✅ Completed' : '⏳ Pending';
  modalStatus.style.color = todo.completed ? '#00FFCA' : '#FF4C4C';

  modal.style.display = 'flex';
  trapFocusInModal(modal);

  const closeHandler = () => {
    modal.style.display = 'none';
    closeBtn.removeEventListener('click', closeHandler);
  };

  closeBtn.addEventListener('click', closeHandler);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeHandler();
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

// === ACCESSIBILITY ===
function trapFocusInModal(modalElement) {
  const focusableElements = modalElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];

  const handleKeydown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === 'Escape') {
      modalElement.style.display = 'none';
      modalElement.removeEventListener('keydown', handleKeydown);
    }
  };

  modalElement.addEventListener('keydown', handleKeydown);
  if (first) first.focus();
}

// === NOTIFICATIONS ===
async function sendReminderNotification(title, description) {
  if (Notification.permission !== 'granted') return;

  new Notification('🔔 Task Reminder', {
    body: `${title}\n${description || ''}`,
    icon: 'icons/icon-192.png'
  });

  const settings = await loadSettings();
  if (settings.soundEnabled) {
    alertSound.play().catch(() => {});
  }
}

// === REMINDERS (TIMEOUT-BASED) ===
let scheduledTimeouts = [];

function clearAllReminders() {
  scheduledTimeouts.forEach(id => clearTimeout(id));
  scheduledTimeouts = [];
}

async function scheduleReminders() {
  clearAllReminders();
  const settings = await loadSettings();
  const leadMs = settings.reminderLeadTimeMinutes * 60 * 1000;

  const now = Date.now();
  const upcomingTasks = allTodos
    .filter(todo => !todo.completed && todo.reminderCount === 0)
    .map(todo => ({ ...todo, dueMs: new Date(todo.dueDate).getTime() }))
    .filter(todo => todo.dueMs > now && todo.dueMs - now <= 2 * 60 * 60 * 1000); // next 2 hours

  upcomingTasks.forEach(todo => {
    const delay = Math.max(0, todo.dueMs - now - leadMs);
    const id = setTimeout(async () => {
      const current = allTodos.find(t => t.title === todo.title && t.dueDate === todo.dueDate);
      if (!current || current.completed) return;
      sendReminderNotification(todo.title, todo.description);
      current.reminderCount = 1;
      saveTodos();
    }, delay);
    scheduledTimeouts.push(id);
  });
}

// === TOAST ===
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: ${type === 'error' ? 'var(--error-color)' : 'var(--accent-color)'};
    color: var(--background);
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// === FINAL INITIALIZATION ===
document.addEventListener('DOMContentLoaded', async () => {
  // Load data
  allTodos = await loadTodos();
  renderTodoFiltered(allTodos);
  updateProgressSummary();

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = allTodos.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query) ||
        todo.dueDate.toLowerCase().includes(query)
      );
      renderTodoFiltered(filtered);
    });
  }

  // Search UI
  const searchBtn = document.getElementById('search-icon');
  const searchWrapper = document.getElementById('search-wrapper');
  if (searchBtn && searchWrapper && searchInput) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchWrapper.style.display = 'flex';
      searchInput.focus();
    });
    searchWrapper.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => {
      searchWrapper.style.display = 'none';
      const q = searchInput.value.trim().toLowerCase();
      if (q && !allTodos.some(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.dueDate.toLowerCase().includes(q)
      )) {
        searchInput.value = '';
        renderTodoFiltered(allTodos);
      }
    });
  }

  // Install button
  const installBtn = document.getElementById('install-button');
  let deferredPrompt = null;

  const updateInstallButton = () => {
    if (installBtn) {
      installBtn.textContent = window.innerWidth <= 480 ? '📲' : '📲 Install App';
    }
  };
  updateInstallButton();
  window.addEventListener('resize', updateInstallButton);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.classList.add('pulse');
      setTimeout(() => installBtn.classList.remove('pulse'), 4500);
      const handler = async () => {
        installBtn.style.display = 'none';
        installBtn.removeEventListener('click', handler);
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response to install: ${outcome}`);
          deferredPrompt = null;
        }
      };
      installBtn.addEventListener('click', handler);
    }
  });

  // Export / Import
  document.getElementById('export-btn')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(allTodos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-tasks-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  document.getElementById('import-btn')?.addEventListener('click', () => {
    document.getElementById('import-input')?.click();
  });

  document.getElementById('import-input')?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (!Array.isArray(imported)) throw new Error('Invalid format');
      const valid = imported.every(t =>
        typeof t.title === 'string' &&
        typeof t.dueDate === 'string' &&
        !isNaN(new Date(t.dueDate).getTime())
      );
      if (!valid) throw new Error('Invalid task data');

      allTodos = imported.map(t => ({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate,
        completed: Boolean(t.completed),
        reminderCount: t.reminderCount || 0
      }));
      await saveTodos();
      renderTodoFiltered(allTodos);
      scheduleReminders();
      showToast('Tasks imported successfully!', 'info');
    } catch (err) {
      showToast('Import failed: ' + (err.message || 'Invalid file'), 'error');
    }
    e.target.value = '';
  });

  // Settings Modal
  const settingsModal = document.getElementById('settings-modal');
  const settingsBtn = document.getElementById('settings-btn');
  const soundToggle = document.getElementById('sound-toggle');
  const leadTimeSelect = document.getElementById('lead-time');
  const settingsSaveBtn = document.getElementById('settings-save');
  const settingsCancelBtn = document.getElementById('settings-cancel');

  if (settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', async () => {
      const settings = await loadSettings();
      soundToggle.checked = settings.soundEnabled;
      leadTimeSelect.value = settings.reminderLeadTimeMinutes.toString();
      settingsModal.style.display = 'flex';
      trapFocusInModal(settingsModal);
    });

    const closeSettings = () => {
      settingsModal.style.display = 'none';
    };

    settingsCancelBtn?.addEventListener('click', closeSettings);
    settingsSaveBtn?.addEventListener('click', async () => {
      const newSettings = {
        soundEnabled: soundToggle.checked,
        reminderLeadTimeMinutes: parseInt(leadTimeSelect.value, 10),
        snoozeMinutes: DEFAULT_SETTINGS.snoozeMinutes
      };
      await saveSettings(newSettings);
      showToast('Settings saved!', 'info');
      closeSettings();
      scheduleReminders(); // re-schedule with new lead time
    });

    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeSettings();
    });
  }

  // Start reminders
  scheduleReminders();
});

// Global event listeners
document.getElementById('add-btn')?.addEventListener('click', taskForm);

window.addEventListener('popstate', (event) => {
  if (event.state?.page === 'form') {
    document.getElementById('form-container').innerHTML = "";
    document.getElementById('todo-list').style.display = 'block';
  }
});

// Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
    .then(reg => console.log('✅ Service Worker registered:', reg.scope))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}