/**
* TODO PWA - Main Application
* Vanilla JavaScript with modular architecture
* Uses IndexedDB for storage, Notification API for reminders
*/
'use strict';
// ===================================
// Constants & Configuration
// ===================================
const APP_CONFIG = {
DB_NAME: 'TodoPWA',
DB_VERSION: 1,
STORE_NAME: 'tasks',
REMINDER_CHECK_INTERVAL: 60000, // 60 seconds
SEARCH_DEBOUNCE: 300, // ms
UNDO_TIMEOUT: 5000, // ms
NOTIFICATION_SOUND_ENABLED: true
};
const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };
// Notification sound (short beep as data URI)
const NOTIFICATION_SOUND = new Audio('audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKzn77dhGwU7k9n0y3krBSl+zPDajjwLGGW56+mmVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn0vBSh+zPDajjwLGGW56uemVRILTKXh8bllHAU2jdXzzn......');

// ===================================
// Database Module (IndexedDB)
// ===================================
const DB = {
db: null,
/**
* Open and initialize IndexedDB
*/
async init() {
return new Promise((resolve, reject) => {
const request = indexedDB.open(APP_CONFIG.DB_NAME, APP_CONFIG.DB_VERSION);
request.onerror = () => reject(request.error);
request.onsuccess = () => {
this.db = request.result;
resolve(this.db);
};
request.onupgradeneeded = (event) => {
const db = event.target.result;
// Create object store if it doesn't exist
if (!db.objectStoreNames.contains(APP_CONFIG.STORE_NAME)) {
const store = db.createObjectStore(APP_CONFIG.STORE_NAME, { keyPath: 'id' });
// Create indexes for efficient querying
store.createIndex('completed', 'completed', { unique: false });
store.createIndex('priority', 'priority', { unique: false });
store.createIndex('dueDate', 'dueDate', { unique: false });
store.createIndex('createdAt', 'createdAt', { unique: false });
}
};
});
},
/**
* Get all tasks
*/
async getAllTasks() {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readonly');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.getAll();
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(request.result);
});
},
/**
* Get task by ID
*/
async getTask(id) {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readonly');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.get(id);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(request.result);
});
},
/**
* Add new task
*/
async addTask(task) {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readwrite');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.add(task);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(task);
});
},
/**
* Update existing task
*/
async updateTask(task) {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readwrite');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.put(task);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve(task);
});
},
/**
* Delete task
*/
async deleteTask(id) {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readwrite');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.delete(id);
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve();
});
},
/**
* Clear all tasks
*/
async clearAll() {
return new Promise((resolve, reject) => {
const transaction = this.db.transaction([APP_CONFIG.STORE_NAME], 'readwrite');
const store = transaction.objectStore(APP_CONFIG.STORE_NAME);
const request = store.clear();
request.onerror = () => reject(request.error);
request.onsuccess = () => resolve();
});
}
};
// ===================================
// State Management
// ===================================
const State = {
tasks: [],
filteredTasks: [],
currentFilter: 'all',
currentPriorityFilter: 'all',
currentSort: 'createdAt',
searchQuery: '',
editingTask: null,
notificationCount: 0,
settings: {
theme: 'auto', // auto, light, dark
accentColor: 'blue', // blue, purple, green
notificationsEnabled: false,
soundEnabled: true
},
init() {
this.loadSettings();
this.applyTheme();
},
loadSettings() {
const saved = localStorage.getItem('todoSettings');
if (saved) {
this.settings = { ...this.settings, ...JSON.parse(saved) };
}
},
saveSettings() {
localStorage.setItem('todoSettings', JSON.stringify(this.settings));
this.applyTheme();
},
applyTheme() {
const { theme, accentColor } = this.settings;
const root = document.documentElement;
// Remove existing theme attributes
root.removeAttribute('data-theme');
root.removeAttribute('data-accent');
// Apply theme
if (theme === 'auto') {
// Let CSS handle system preference
} else {
root.setAttribute('data-theme', theme);
}
// Apply accent color
root.setAttribute('data-accent', accentColor);
// Update theme toggle icon
const themeIcon = document.querySelector('.theme-icon');
if (themeIcon) {
const isDark = theme === 'dark' || 
(theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
themeIcon.textContent = isDark ? '☀️' : '🌙';
}
},
async loadTasks() {
try {
this.tasks = await DB.getAllTasks();
this.filterAndSortTasks();
} catch (error) {
console.error('Error loading tasks:', error);
// Don't show snackbar if UI elements not ready
if (UI.elements.snackbar && UI.elements.snackbarMessage) {
UI.showSnackbar('Error loading tasks', null);
}
}
},
filterAndSortTasks() {
let filtered = [...this.tasks];
// Apply search
if (this.searchQuery) {
const query = this.searchQuery.toLowerCase();
filtered = filtered.filter(task => 
task.title.toLowerCase().includes(query) || 
(task.description && task.description.toLowerCase().includes(query))
);
}
// Apply status filter
if (this.currentFilter === 'completed') {
filtered = filtered.filter(task => task.completed);
} else if (this.currentFilter === 'incomplete') {
filtered = filtered.filter(task => !task.completed);
} else if (this.currentFilter === 'overdue') {
const now = new Date();
filtered = filtered.filter(task => 
!task.completed && task.dueDate && new Date(task.dueDate) < now
);
}
// Apply priority filter
if (this.currentPriorityFilter !== 'all') {
filtered = filtered.filter(task => task.priority === this.currentPriorityFilter);
}
// Apply sort
filtered.sort((a, b) => {
if (this.currentSort === 'title') {
return a.title.localeCompare(b.title);
} else if (this.currentSort === 'dueDate') {
if (!a.dueDate && !b.dueDate) return 0;
if (!a.dueDate) return 1;
if (!b.dueDate) return -1;
return new Date(a.dueDate) - new Date(b.dueDate);
} else if (this.currentSort === 'priority') {
return PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
} else { // createdAt
return new Date(b.createdAt) - new Date(a.createdAt);
}
});
this.filteredTasks = filtered;
UI.renderTasks(filtered);
}
};
// ===================================
// UI Module
// ===================================
const UI = {
elements: {},
// Snackbar config + runtime timeout id
_SNACKBAR_DEFAULT_TIMEOUT: 5000,
_snackbarTimeoutId: null,
// Initialize snackbar DOM state (call this after cacheElements)
initSnackbar() {
// Ensure element refs exist (cacheElements should have been called)
this.elements = this.elements || {};
this.elements.snackbar = this.elements.snackbar || document.getElementById('snackbar');
this.elements.snackbarMessage = this.elements.snackbarMessage || document.getElementById('snackbar-message');
this.elements.snackbarAction = this.elements.snackbarAction || document.getElementById('snackbar-action');
if (this.elements.snackbar) {
this.elements.snackbar.hidden = true;
this.elements.snackbar.setAttribute('role', 'status');
this.elements.snackbar.setAttribute('aria-live', 'polite');
this.elements.snackbar.setAttribute('aria-atomic', 'true');
this.elements.snackbar.setAttribute('aria-hidden', 'true');
}
if (this.elements.snackbarMessage) {
this.elements.snackbarMessage.textContent = '';
}
if (this.elements.snackbarAction) {
this.elements.snackbarAction.hidden = true;
this.elements.snackbarAction.textContent = '';
}
// Clear any leftover timeout
if (this._snackbarTimeoutId) {
clearTimeout(this._snackbarTimeoutId);
this._snackbarTimeoutId = null;
}
},
/**
* Auto-resizes a textarea to fit its content
* @param {HTMLTextAreaElement} textarea - The textarea element to resize
*/
autoResizeTextarea(textarea) {
if (!textarea) return;
// Reset height to auto to get accurate scrollHeight
textarea.style.height = 'auto';
// Set new height based on content, with a maximum of 200px
const newHeight = Math.min(textarea.scrollHeight, 200);
textarea.style.height = newHeight + 'px';
},
init() {
this.cacheElements();
this.initSnackbar();
this.attachEventListeners();
this.updateNotificationBadge();
// Ensure all modals are closed on init
this.closeAllModals();
},
cacheElements() {
// Helper to safely get element
const getEl = (id) => {
const el = document.getElementById(id);
if (!el) console.warn(`Element not found: ${id}`);
return el;
};
this.elements = {
// Tasks
tasksContainer: getEl('tasks-container'),
emptyState: getEl('empty-state'),
noResultsState: getEl('no-results-state'),
// Controls
addTaskBtn: getEl('add-task-btn'),
searchInput: getEl('search-input'),
statusFilter: getEl('status-filter'),
priorityFilter: getEl('priority-filter'),
sortSelect: getEl('sort-select'),
// Task Modal
taskModal: getEl('task-modal'),
taskForm: getEl('task-form'),
modalTitle: getEl('modal-title'),
formSubmitText: getEl('form-submit-text'),
taskTitle: getEl('task-title'),
taskDescription: getEl('task-description'),
taskDueDate: getEl('task-due-date'),
taskPriority: getEl('task-priority'),
taskTags: getEl('task-tags'),
// Detail Modal
detailModal: getEl('detail-modal'),
detailTitle: getEl('detail-title'),
detailDescription: getEl('detail-description'),
detailDescriptionSection: getEl('detail-description-section'),
detailDue: getEl('detail-due'),
detailDueSection: getEl('detail-due-section'),
detailTags: getEl('detail-tags'),
detailTagsSection: getEl('detail-tags-section'),
detailCreated: getEl('detail-created'),
detailPriority: getEl('detail-priority'),
detailStatus: getEl('detail-status'),
detailEditBtn: getEl('detail-edit-btn'),
detailDeleteBtn: getEl('detail-delete-btn'),
// Settings Modal
settingsModal: getEl('settings-modal'),
settingsBtn: getEl('settings-btn'),
themeSelect: getEl('theme-select'),
colorOptions: document.querySelectorAll('.color-option'),
notificationsToggle: getEl('notifications-toggle'),
soundToggle: getEl('sound-toggle'),
exportBtn: getEl('export-btn'),
importBtn: getEl('import-btn'),
importFile: getEl('import-file'),
clearDataBtn: getEl('clear-data-btn'),
// Confirm Modal
confirmModal: getEl('confirm-modal'),
confirmMessage: getEl('confirm-message'),
confirmOk: getEl('confirm-ok'),
confirmCancel: getEl('confirm-cancel'),
// Other
themeToggle: getEl('theme-toggle'),
notificationsBtn: getEl('notifications-btn'),
notificationBadge: getEl('notification-badge'),
snackbar: getEl('snackbar'),
snackbarMessage: getEl('snackbar-message'),
snackbarAction: getEl('snackbar-action')
};
},
attachEventListeners() {
// Add null checks for all elements
if (!this.elements.addTaskBtn || !this.elements.searchInput) {
console.error('Critical UI elements missing');
return;
}
// Add task
this.elements.addTaskBtn.addEventListener('click', () => this.openTaskModal());
// Search
let searchTimeout;
this.elements.searchInput.addEventListener('input', (e) => {
clearTimeout(searchTimeout);
searchTimeout = setTimeout(() => {
State.searchQuery = e.target.value.trim();
State.filterAndSortTasks();
}, APP_CONFIG.SEARCH_DEBOUNCE);
});
// Filters
this.elements.statusFilter.addEventListener('change', (e) => {
State.currentFilter = e.target.value;
State.filterAndSortTasks();
});
this.elements.priorityFilter.addEventListener('change', (e) => {
State.currentPriorityFilter = e.target.value;
State.filterAndSortTasks();
});
this.elements.sortSelect.addEventListener('change', (e) => {
State.currentSort = e.target.value;
State.filterAndSortTasks();
});
// Theme toggle
this.elements.themeToggle.addEventListener('click', () => {
const current = State.settings.theme;
State.settings.theme = current === 'light' ? 'dark' : 'light';
State.saveSettings();
});
// Settings
this.elements.settingsBtn.addEventListener('click', () => this.openSettingsModal());
// Auto-resize description textarea
if (this.elements.taskDescription) {
this.elements.taskDescription.addEventListener('input', () => {
this.autoResizeTextarea(this.elements.taskDescription);
});
}
// Task form
this.elements.taskForm.addEventListener('submit', (e) => {
e.preventDefault();
this.handleTaskSubmit();
});
// Modal close buttons
document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
btn.addEventListener('click', (e) => {
const modal = e.target.closest('.modal');
if (modal) {
this.closeModal(modal);
}
});
});
// Modal overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
overlay.addEventListener('click', () => {
const modal = overlay.closest('.modal');
this.closeModal(modal);
});
});
// Settings
this.elements.themeSelect.addEventListener('change', (e) => {
State.settings.theme = e.target.value;
State.saveSettings();
});
this.elements.colorOptions.forEach(btn => {
btn.addEventListener('click', (e) => {
const color = e.currentTarget.dataset.color;
State.settings.accentColor = color;
State.saveSettings();
this.updateColorOptions();
});
});
this.elements.notificationsToggle.addEventListener('change', async (e) => {
if (e.target.checked) {
const granted = await Notifications.requestPermission();
e.target.checked = granted;
State.settings.notificationsEnabled = granted;
} else {
State.settings.notificationsEnabled = false;
}
State.saveSettings();
});
this.elements.soundToggle.addEventListener('change', (e) => {
State.settings.soundEnabled = e.target.checked;
State.saveSettings();
});
// Data management
this.elements.exportBtn.addEventListener('click', () => this.exportTasks());
this.elements.importBtn.addEventListener('click', () => this.elements.importFile.click());
this.elements.importFile.addEventListener('change', (e) => this.importTasks(e));
this.elements.clearDataBtn.addEventListener('click', () => this.confirmClearData());
// Keyboard shortcuts
document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
},
handleKeyboardShortcuts(e) {
// Ignore if typing in input/textarea
if (e.target.matches('input, textarea, select')) {
if (e.key === 'Escape') {
e.target.blur();
this.closeAllModals();
}
return;
}
switch(e.key.toLowerCase()) {
case 'n':
e.preventDefault();
this.openTaskModal();
break;
case '/':
e.preventDefault();
this.elements.searchInput.focus();
break;
case 'escape':
this.closeAllModals();
break;
}
},
closeAllModals() {
document.querySelectorAll('.modal').forEach(modal => {
if (!modal.hidden) {
this.closeModal(modal);
}
});
},
openTaskModal(task = null) {
State.editingTask = task;
if (task) {
// Edit mode
this.elements.modalTitle.textContent = 'Edit Task';
this.elements.formSubmitText.textContent = 'Save Changes';
this.elements.taskTitle.value = task.title;
this.elements.taskDescription.value = task.description || '';
this.elements.taskDueDate.value = task.dueDate ? 
new Date(task.dueDate).toISOString().slice(0, 16) : '';
this.elements.taskPriority.value = task.priority;
this.elements.taskTags.value = task.tags ? task.tags.join(', ') : '';
// Auto-resize the textarea after setting content
this.autoResizeTextarea(this.elements.taskDescription);
} else {
// Add mode
this.elements.modalTitle.textContent = 'Add Task';
this.elements.formSubmitText.textContent = 'Add Task';
this.elements.taskForm.reset();
this.elements.taskPriority.value = 'medium';
this.elements.taskDescription.value = ''; // Ensure empty
// Auto-resize the empty textarea
this.autoResizeTextarea(this.elements.taskDescription);
}
this.showModal(this.elements.taskModal);
setTimeout(() => {
this.elements.taskTitle.focus();
// Force resize after focus (sometimes needed for Chrome)
this.autoResizeTextarea(this.elements.taskDescription);
}, 100);
},
async handleTaskSubmit() {
const title = this.elements.taskTitle.value.trim();
if (!title) return;
const taskData = {
title,
description: this.elements.taskDescription.value.trim(),
dueDate: this.elements.taskDueDate.value || null,
priority: this.elements.taskPriority.value,
tags: this.elements.taskTags.value 
.split(',')
.map(tag => tag.trim())
.filter(tag => tag)
};
try {
if (State.editingTask) {
// Update existing task
const updated = { ...State.editingTask, ...taskData };
await DB.updateTask(updated);
this.showSnackbar('Task updated successfully');
} else {
// Create new task
const newTask = {
id: this.generateId(),
...taskData,
completed: false,
createdAt: new Date().toISOString(),
notified: false
};
await DB.addTask(newTask);
this.showSnackbar('Task created successfully');
}
await State.loadTasks();
this.closeModal(this.elements.taskModal);
State.editingTask = null;
} catch (error) {
console.error('Error saving task:', error);
this.showSnackbar('Error saving task', null);
}
},
renderTasks(tasks) {
const container = this.elements.tasksContainer;
// Early return if critical elements missing
if (!container) {
console.error('Critical error: tasks-container element not found in DOM');
return;
}
const hasResults = tasks.length > 0;
const hasAnyTasks = State.tasks.length > 0;
// Show/hide states with null checks
if (this.elements.emptyState) {
this.elements.emptyState.hidden = hasAnyTasks;
}
if (this.elements.noResultsState) {
this.elements.noResultsState.hidden = hasResults || !hasAnyTasks;
}
container.style.display = hasResults ? 'flex' : 'none';
if (!hasResults) return;
// Render tasks
container.innerHTML = tasks.map(task => this.createTaskCard(task)).join('');
// Attach event listeners to task cards
container.querySelectorAll('.task-card').forEach(card => {
const taskId = card.dataset.taskId;
const checkbox = card.querySelector('.task-checkbox');
// Card click - open detail
card.addEventListener('click', (e) => {
if (e.target === checkbox) return;
this.openTaskDetail(taskId);
});
// Checkbox - toggle completion
checkbox.addEventListener('click', async (e) => {
e.stopPropagation();
await this.toggleTaskCompletion(taskId);
});
});
},
createTaskCard(task) {
const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
const dueDate = task.dueDate ? new Date(task.dueDate) : null;
return `
<div class="task-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}"
data-task-id="${task.id}"
role="button"
tabindex="0"
aria-label="Task: ${this.escapeHtml(task.title)}">
<div class="task-header">
<div class="task-checkbox-container">
<input type="checkbox"
class="task-checkbox"
${task.completed ? 'checked' : ''}
aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}">
</div>
<div class="task-content">
<h3 class="task-title">${this.escapeHtml(task.title)}</h3>
${task.description ? `
<p class="task-description">${this.escapeHtml(task.description)}</p>
` : ''}
<div class="task-meta">
<span class="priority-badge priority-${task.priority}">
${this.getPriorityIcon(task.priority)} ${task.priority}
</span>
${isOverdue ? '<span class="overdue-badge">⚠️ Overdue</span>' : ''}
${dueDate ? `
<span class="due-date ${isOverdue ? 'overdue' : ''}">
📅 ${this.formatDate(dueDate)}
</span>
` : ''}
${task.tags && task.tags.length > 0 ? `
<div class="tags-list">
${task.tags.slice(0, 3).map(tag => 
`<span class="tag">${this.escapeHtml(tag)}</span>`
).join('')}
${task.tags.length > 3 ? `<span class="tag">+${task.tags.length - 3}</span>` : ''}
</div>
` : ''}
</div>
</div>
</div>
</div>
`;
},
async openTaskDetail(taskId) {
const task = await DB.getTask(taskId);
if (!task) return;
// Populate detail modal
this.elements.detailTitle.textContent = task.title;
this.elements.detailPriority.textContent = task.priority;
this.elements.detailPriority.className = `priority-badge priority-${task.priority}`;
this.elements.detailStatus.textContent = task.completed ? 'Completed' : 'Incomplete';
this.elements.detailStatus.className = `status-badge status-${task.completed ? 'completed' : 'incomplete'}`;
// Description
if (task.description) {
this.elements.detailDescription.textContent = task.description;
this.elements.detailDescriptionSection.hidden = false;
} else {
this.elements.detailDescriptionSection.hidden = true;
}
// Due date
if (task.dueDate) {
const dueDate = new Date(task.dueDate);
const isOverdue = !task.completed && dueDate < new Date();
this.elements.detailDue.innerHTML = `
${this.formatDateTime(dueDate)}
${isOverdue ? '<span class="overdue-badge" style="margin-left: 0.5rem;">⚠️ Overdue</span>' : ''}
`;
this.elements.detailDueSection.hidden = false;
} else {
this.elements.detailDueSection.hidden = true;
}
// Tags
if (task.tags && task.tags.length > 0) {
this.elements.detailTags.innerHTML = task.tags
.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`)
.join('');
this.elements.detailTagsSection.hidden = false;
} else {
this.elements.detailTagsSection.hidden = true;
}
// Created date
this.elements.detailCreated.textContent = this.formatDateTime(new Date(task.createdAt));
// Button handlers
this.elements.detailEditBtn.onclick = () => {
this.closeModal(this.elements.detailModal);
this.openTaskModal(task);
};
this.elements.detailDeleteBtn.onclick = () => {
this.closeModal(this.elements.detailModal);
this.confirmDelete(task);
};
this.showModal(this.elements.detailModal);
},
async toggleTaskCompletion(taskId) {
try {
const task = await DB.getTask(taskId);
if (!task) return;
task.completed = !task.completed;
await DB.updateTask(task);
await State.loadTasks();
} catch (error) {
console.error('Error toggling task:', error);
this.showSnackbar('Error updating task', null);
}
},
confirmDelete(task) {
let deletedTask = null;
this.showConfirm(
`Are you sure you want to delete "${task.title}"?`,
async () => {
try {
deletedTask = { ...task };
await DB.deleteTask(task.id);
await State.loadTasks();
// Show undo snackbar
this.showSnackbar('Task deleted', 'Undo', async () => {
if (deletedTask) {
await DB.addTask(deletedTask);
await State.loadTasks();
this.showSnackbar('Task restored');
}
});
} catch (error) {
console.error('Error deleting task:', error);
this.showSnackbar('Error deleting task', null);
}
}
);
},
openSettingsModal() {
// Sync settings to UI
this.elements.themeSelect.value = State.settings.theme;
this.elements.notificationsToggle.checked = State.settings.notificationsEnabled;
this.elements.soundToggle.checked = State.settings.soundEnabled;
this.updateColorOptions();
this.showModal(this.elements.settingsModal);
},
updateColorOptions() {
this.elements.colorOptions.forEach(btn => {
const isActive = btn.dataset.color === State.settings.accentColor;
btn.classList.toggle('active', isActive);
});
},
async exportTasks() {
try {
const tasks = await DB.getAllTasks();
const dataStr = JSON.stringify(tasks, null, 2);
const dataBlob = new Blob([dataStr], { type: 'application/json' });
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = `todo-backup-${new Date().toISOString().slice(0, 10)}.json`;
link.click();
URL.revokeObjectURL(url);
this.showSnackbar('Tasks exported successfully');
} catch (error) {
console.error('Error exporting tasks:', error);
this.showSnackbar('Error exporting tasks', null);
}
},
async importTasks(event) {
const file = event.target.files[0];
if (!file) return;
try {
const text = await file.text();
const tasks = JSON.parse(text);
if (!Array.isArray(tasks)) {
throw new Error('Invalid file format');
}
// Import tasks (merge, don't overwrite)
for (const task of tasks) {
try {
const existing = await DB.getTask(task.id);
if (!existing) {
await DB.addTask(task);
}
} catch (error) {
// If task doesn't exist, add it
await DB.addTask(task);
}
}
await State.loadTasks();
this.showSnackbar(`${tasks.length} tasks imported`);
event.target.value = ''; // Reset file input
} catch (error) {
console.error('Error importing tasks:', error);
this.showSnackbar('Error importing tasks - invalid file', null);
event.target.value = '';
}
},
confirmClearData() {
this.showConfirm(
'Are you sure you want to delete all tasks? This action cannot be undone.',
async () => {
try {
await DB.clearAll();
await State.loadTasks();
this.showSnackbar('All tasks cleared');
this.closeModal(this.elements.settingsModal);
} catch (error) {
console.error('Error clearing ', error);
this.showSnackbar('Error clearing data', null);
}
}
);
},
showModal(modal) {
if (!modal) return;
modal.hidden = false;
modal.style.display = ''; // Remove inline style to let CSS take over
modal.removeAttribute('aria-hidden');
// Focus trap
const focusable = modal.querySelectorAll(
'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
if (focusable.length > 0) {
// Small delay to ensure modal is rendered
setTimeout(() => focusable[0].focus(), 50);
}
},
closeModal(modal) {
if (!modal) return;
// Remove focus from any element inside the modal first
const activeElement = document.activeElement;
if (modal.contains(activeElement)) {
activeElement.blur();
}
// Now safe to hide
modal.hidden = true;
modal.style.display = 'none'; // Explicitly set display none
modal.setAttribute('aria-hidden', 'true');
},
showConfirm(message, onConfirm) {
if (!this.elements.confirmModal || !this.elements.confirmMessage) {
console.warn('Confirm modal elements not available');
return;
}
this.elements.confirmMessage.textContent = message;
const handleConfirm = () => {
onConfirm();
cleanup();
};
const handleCancel = () => {
cleanup();
};
const cleanup = () => {
this.closeModal(this.elements.confirmModal);
if (this.elements.confirmOk) {
this.elements.confirmOk.removeEventListener('click', handleConfirm);
}
if (this.elements.confirmCancel) {
this.elements.confirmCancel.removeEventListener('click', handleCancel);
}
};
if (this.elements.confirmOk) {
this.elements.confirmOk.addEventListener('click', handleConfirm);
}
if (this.elements.confirmCancel) {
this.elements.confirmCancel.addEventListener('click', handleCancel);
}
this.showModal(this.elements.confirmModal);
},
showSnackbar(message, actionText = null, actionHandler = null) {
// Ensure snackbar elements exist
if (!this.elements || !this.elements.snackbar || !this.elements.snackbarMessage) {
console.warn('Snackbar elements missing. Message:', message);
return;
}
// Normalize message and treat whitespace as empty
const text = (message || '').toString().trim();
if (!text) {
// nothing meaningful to show
this.hideSnackbar();
return;
}
// Clear any existing timeout to avoid overlap
if (this._snackbarTimeoutId) {
clearTimeout(this._snackbarTimeoutId);
this._snackbarTimeoutId = null;
}
// Set message safely
this.elements.snackbarMessage.textContent = text;
// Setup action button defensively
if (this.elements.snackbarAction) {
// Remove old listeners by replacing the node (defensive)
const oldBtn = this.elements.snackbarAction;
const newBtn = oldBtn.cloneNode(true);
if (oldBtn && oldBtn.parentNode) {
oldBtn.parentNode.replaceChild(newBtn, oldBtn);
}
this.elements.snackbarAction = newBtn;
// Default hide
this.elements.snackbarAction.hidden = true;
this.elements.snackbarAction.textContent = '';
if (actionText && typeof actionHandler === 'function') {
this.elements.snackbarAction.textContent = actionText;
this.elements.snackbarAction.hidden = false;
this.elements.snackbarAction.addEventListener('click', (ev) => {
try { actionHandler(ev); } catch (e) { console.error(e); }
this.hideSnackbar();
});
// Use configured UNDO_TIMEOUT if available, otherwise default
const delay = (typeof APP_CONFIG !== 'undefined' && APP_CONFIG.UNDO_TIMEOUT) ? APP_CONFIG.UNDO_TIMEOUT : this._SNACKBAR_DEFAULT_TIMEOUT;
this._snackbarTimeoutId = setTimeout(() => this.hideSnackbar(), delay);
} else {
// No action -> auto-hide after default
this.elements.snackbarAction.hidden = true;
this._snackbarTimeoutId = setTimeout(() => this.hideSnackbar(), this._SNACKBAR_DEFAULT_TIMEOUT);
}
} else {
// No action element present, still auto-hide
this._snackbarTimeoutId = setTimeout(() => this.hideSnackbar(), this._SNACKBAR_DEFAULT_TIMEOUT);
}
// Show snackbar (and accessibility)
this.elements.snackbar.hidden = false;
this.elements.snackbar.setAttribute('aria-hidden', 'false');
},
hideSnackbar() {
if (!this.elements || !this.elements.snackbar || !this.elements.snackbarMessage) return;
// Clear running timeout
if (this._snackbarTimeoutId) {
clearTimeout(this._snackbarTimeoutId);
this._snackbarTimeoutId = null;
}
// Reset action button (remove listeners by replacing node)
if (this.elements.snackbarAction) {
const oldBtn = this.elements.snackbarAction;
const newBtn = oldBtn.cloneNode(true);
newBtn.hidden = true;
newBtn.textContent = '';
if (oldBtn && oldBtn.parentNode) {
oldBtn.parentNode.replaceChild(newBtn, oldBtn);
}
this.elements.snackbarAction = newBtn;
}
// Clear message
this.elements.snackbarMessage.textContent = '';
// Hide container & update accessibility
this.elements.snackbar.hidden = true;
this.elements.snackbar.setAttribute('aria-hidden', 'true');
},
updateNotificationBadge() {
if (!this.elements.notificationsBtn || !this.elements.notificationBadge) {
return;
}
if (State.notificationCount > 0) {
this.elements.notificationsBtn.hidden = false;
this.elements.notificationBadge.hidden = false;
this.elements.notificationBadge.textContent = State.notificationCount;
} else {
this.elements.notificationsBtn.hidden = true;
this.elements.notificationBadge.hidden = true;
}
},
// Utility functions
generateId() {
return Date.now().toString(36) + Math.random().toString(36).substr(2);
},
escapeHtml(text) {
const div = document.createElement('div');
div.textContent = text;
return div.innerHTML;
},
formatDate(date) {
const now = new Date();
const diff = date - now;
const days = Math.floor(diff / (1000 * 60 * 60 * 24));
if (days === 0) return 'Today';
if (days === 1) return 'Tomorrow';
if (days === -1) return 'Yesterday';
if (days < -1) return `${Math.abs(days)} days ago`;
if (days < 7) return `In ${days} days`;
return date.toLocaleDateString('en-US', {
month: 'short',
day: 'numeric',
year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
});
},
formatDateTime(date) {
return date.toLocaleString('en-US', {
month: 'short',
day: 'numeric',
year: 'numeric',
hour: 'numeric',
minute: '2-digit',
hour12: true
});
},
getPriorityIcon(priority) {
const icons = {
high: '🔴',
medium: '🟡',
low: '🔵'
};
return icons[priority] || '⚪';
}
};
// ===================================
// Notifications Module
// ===================================
const Notifications = {
permission: 'default',
checkInterval: null,
notifiedTasks: new Set(),
async init() {
this.permission = Notification.permission;
if (this.permission === 'granted') {
State.settings.notificationsEnabled = true;
State.saveSettings();
}
// Start checking for due tasks
this.startChecking();
},
async requestPermission() {
if (!('Notification' in window)) {
console.warn('Notifications not supported');
return false;
}
try {
this.permission = await Notification.requestPermission();
return this.permission === 'granted';
} catch (error) {
console.error('Error requesting notification permission:', error);
return false;
}
},
startChecking() {
// Check immediately
this.checkDueTasks();
// Then check every interval
this.checkInterval = setInterval(() => {
this.checkDueTasks();
}, APP_CONFIG.REMINDER_CHECK_INTERVAL);
},
async checkDueTasks() {
if (!State.settings.notificationsEnabled) return;
const now = new Date();
const tasks = await DB.getAllTasks();
for (const task of tasks) {
if (task.completed || !task.dueDate || task.notified) continue;
const dueDate = new Date(task.dueDate);
// Check if task is due (within 1 minute tolerance)
if (dueDate <= now && (now - dueDate) < 60000) {
await this.sendNotification(task);
// Mark as notified
task.notified = true;
await DB.updateTask(task);
}
}
},
async sendNotification(task) {
// In-app notification
State.notificationCount++;
UI.updateNotificationBadge();
// Play sound
if (State.settings.soundEnabled) {
try {
NOTIFICATION_SOUND.play().catch(err => console.log('Sound play failed:', err));
} catch (error) {
console.log('Could not play notification sound');
}
}
// Browser notification
if (this.permission === 'granted') {
try {
const notification = new Notification('Task Due', {
body: task.title,
icon: '/icons/icon-192.png',
badge: '/icons/icon-96.png',
tag: task.id,
requireInteraction: false,
silent: !State.settings.soundEnabled
});
notification.onclick = () => {
window.focus();
UI.openTaskDetail(task.id);
notification.close();
};
setTimeout(() => notification.close(), 10000);
} catch (error) {
console.error('Error showing notification:', error);
}
}
},
stop() {
if (this.checkInterval) {
clearInterval(this.checkInterval);
this.checkInterval = null;
}
}
};
// ===================================
// PWA Module
// ===================================
const PWA = {
deferredPrompt: null,
init() {
this.registerServiceWorker();
this.handleInstallPrompt();
},
async registerServiceWorker() {
if ('serviceWorker' in navigator) {
try {
const registration = await navigator.serviceWorker.register('/service-worker.js');
console.log('Service Worker registered:', registration.scope);
// Handle updates
registration.addEventListener('updatefound', () => {
const newWorker = registration.installing;
newWorker.addEventListener('statechange', () => {
if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
UI.showSnackbar('New version available', 'Refresh', () => {
window.location.reload();
});
}
});
});
} catch (error) {
console.error('Service Worker registration failed:', error);
}
}
},
handleInstallPrompt() {
const installBanner = document.getElementById('install-banner');
const installBtn = document.getElementById('install-btn');
const dismissBtn = document.getElementById('dismiss-install');
window.addEventListener('beforeinstallprompt', (e) => {
e.preventDefault();
this.deferredPrompt = e;
// Show custom install UI
installBanner.hidden = false;
});
installBtn.addEventListener('click', async () => {
if (!this.deferredPrompt) return;
this.deferredPrompt.prompt();
const { outcome } = await this.deferredPrompt.userChoice;
console.log(`Install prompt outcome: ${outcome}`);
this.deferredPrompt = null;
installBanner.hidden = true;
});
dismissBtn.addEventListener('click', () => {
installBanner.hidden = true;
this.deferredPrompt = null;
});
window.addEventListener('appinstalled', () => {
console.log('PWA installed successfully');
installBanner.hidden = true;
this.deferredPrompt = null;
});
}
};
// ===================================
// App Initialization
// ===================================
async function initApp() {
try {
console.log('🚀 Starting app initialization...');
// Initialize database first
await DB.init();
console.log('✅ Database initialized');
// Initialize state (loads settings)
State.init();
console.log('✅ State initialized');
// Initialize UI BEFORE loading tasks (UI needs to exist first!)
UI.init();
console.log('✅ UI initialized');
// Verify critical UI elements
if (!UI.elements.tasksContainer || !UI.elements.snackbar) {
const missing = [];
if (!UI.elements.tasksContainer) missing.push('tasks-container');
if (!UI.elements.snackbar) missing.push('snackbar');
throw new Error(`Critical HTML elements missing: ${missing.join(', ')}. Please ensure index.html is complete.`);
}
// Explicitly ensure all modals are closed (safety check)
document.querySelectorAll('.modal').forEach(modal => {
modal.hidden = true;
modal.setAttribute('aria-hidden', 'true');
});
// Now load tasks (UI is ready to display them)
await State.loadTasks();
console.log('✅ Tasks loaded:', State.tasks.length);
// Initialize notifications
await Notifications.init();
console.log('✅ Notifications initialized');
// Initialize PWA features
PWA.init();
console.log('✅ PWA features initialized');
console.log('🎉 App initialized successfully!');
} catch (error) {
console.error('❌ Error initializing app:', error);
// Show user-friendly error
const errorMessage = 'Failed to initialize the application.';
const errorDetail = error.message || 'Unknown error';
// Log detailed diagnostic info
console.error('=== DIAGNOSTIC INFORMATION ===');
console.error('Error:', errorDetail);
console.error('Stack:', error.stack);
console.error('HTML Elements found:', {
tasksContainer: !!document.getElementById('tasks-container'),
emptyState: !!document.getElementById('empty-state'),
snackbar: !!document.getElementById('snackbar'),
addTaskBtn: !!document.getElementById('add-task-btn'),
searchInput: !!document.getElementById('search-input')
});
console.error('Document ready state:', document.readyState);
console.error('==============================');
// Show alert
alert(`${errorMessage}\nError: ${errorDetail}\nPlease check:\n✓ All files are uploaded correctly\n✓ index.html is complete\n✓ Browser console for details\n✓ Try clearing cache (Ctrl+Shift+R)`);
}
}
// Start the app when DOM is ready
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', initApp);
} else {
initApp();
}

// Make sure the auto-resize function is available globally for any needed adjustments
window.autoResizeTextarea = function(textarea) {
if (!textarea) return;
textarea.style.height = 'auto';
textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
};