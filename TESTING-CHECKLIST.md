# TODO PWA - Acceptance Testing Checklist

Run through these tests to verify all functionality is working correctly.

## Prerequisites
- [ ] App is running on a local server (not file:// protocol)
- [ ] Browser DevTools open for debugging (F12)
- [ ] Check console for any errors

---

## 1. Basic CRUD Operations

### Create Task
- [ ] Click "Add Task" button
- [ ] Modal opens with empty form
- [ ] Enter title (required field)
- [ ] Optionally fill description, due date, priority, tags
- [ ] Click "Add Task"
- [ ] Modal closes
- [ ] New task appears in the list
- [ ] Success snackbar shows "Task created successfully"

### Read/View Task
- [ ] Click on any task card
- [ ] Detail modal opens
- [ ] All task information is displayed correctly:
  - [ ] Title
  - [ ] Description (if present)
  - [ ] Due date (if present)
  - [ ] Priority badge
  - [ ] Status (completed/incomplete)
  - [ ] Tags (if present)
  - [ ] Created date

### Update Task
- [ ] Open task detail modal
- [ ] Click "Edit" button
- [ ] Form opens with pre-filled data
- [ ] Modify any field
- [ ] Click "Save Changes"
- [ ] Modal closes
- [ ] Changes are reflected in task list
- [ ] Success snackbar shows "Task updated successfully"

### Delete Task
- [ ] Open task detail modal
- [ ] Click "Delete" button
- [ ] Confirmation dialog appears
- [ ] Click "Confirm"
- [ ] Task is removed from list
- [ ] Snackbar shows "Task deleted" with "Undo" button

### Undo Delete
- [ ] Delete a task
- [ ] Click "Undo" in snackbar within 5 seconds
- [ ] Task is restored to the list
- [ ] Snackbar shows "Task restored"

---

## 2. Persistence & Reload

### Data Persists After Reload
- [ ] Create 2-3 tasks with different properties
- [ ] Refresh the page (F5)
- [ ] All tasks still appear
- [ ] All task data is intact

### Completed State Persists
- [ ] Mark a task as completed (click checkbox)
- [ ] Visual style changes (strikethrough, opacity)
- [ ] Refresh the page
- [ ] Task is still marked as completed

### Settings Persist
- [ ] Change theme to dark
- [ ] Change accent color
- [ ] Refresh page
- [ ] Theme and color preferences are maintained

---

## 3. Task Completion

### Toggle Completion
- [ ] Click checkbox on incomplete task
- [ ] Task shows completed styling
- [ ] Click checkbox again
- [ ] Task returns to incomplete styling

### Filter Completed Tasks
- [ ] Create mix of completed and incomplete tasks
- [ ] Select "Completed" from status filter
- [ ] Only completed tasks show
- [ ] Select "Incomplete" from status filter
- [ ] Only incomplete tasks show
- [ ] Select "All Tasks"
- [ ] All tasks show again

---

## 4. Search Functionality

### Search by Title
- [ ] Create tasks with distinct titles
- [ ] Type search query in search box
- [ ] Results filter instantly (debounced)
- [ ] Only matching tasks appear

### Search by Description
- [ ] Create task with specific word in description
- [ ] Search for that word
- [ ] Task appears in results

### Clear Search
- [ ] Enter search query (results filter)
- [ ] Clear search box
- [ ] All tasks reappear

### No Results State
- [ ] Search for text that doesn't exist
- [ ] "No tasks found" message appears
- [ ] Suggestion to adjust search/filters shown

---

## 5. Filtering & Sorting

### Priority Filter
- [ ] Create tasks with different priorities (high, medium, low)
- [ ] Select "High" from priority filter
- [ ] Only high-priority tasks show
- [ ] Test other priority filters

### Overdue Filter
- [ ] Create task with due date in the past
- [ ] Task shows red "Overdue" badge
- [ ] Select "Overdue" from status filter
- [ ] Only overdue tasks appear

### Sort by Due Date
- [ ] Create tasks with different due dates
- [ ] Select "Due Date" from sort dropdown
- [ ] Tasks are ordered by due date (earliest first)

### Sort Alphabetically
- [ ] Create tasks with names A-Z
- [ ] Select "Alphabetical" from sort
- [ ] Tasks are in alphabetical order

### Sort by Priority
- [ ] Create tasks with different priorities
- [ ] Select "Priority" from sort
- [ ] Tasks ordered: High → Medium → Low

### Sort by Creation Date
- [ ] Select "Date Created" from sort
- [ ] Tasks ordered by creation time (newest first)

---

## 6. Due Dates & Notifications

### Permission Request
- [ ] Enable notifications in Settings
- [ ] Browser prompts for notification permission
- [ ] Grant permission
- [ ] Toggle switches to ON

### Set Future Due Date
- [ ] Create task with due date 2-3 minutes in future
- [ ] Task appears with due date shown
- [ ] Wait until due time passes (keep tab open)
- [ ] Browser notification appears
- [ ] Notification shows task title
- [ ] In-app notification badge increments
- [ ] (Optional) Sound plays if enabled

### Overdue Visual Indicator
- [ ] Create task with due date in past
- [ ] Task has red stripe on left edge
- [ ] Task shows "⚠️ Overdue" badge
- [ ] Due date text is red

### Notification Sound
- [ ] Go to Settings
- [ ] Toggle "Notification Sound" ON
- [ ] Create task due in 1 minute
- [ ] Wait for notification
- [ ] Sound plays with notification

### Notification Sound Off
- [ ] Toggle "Notification Sound" OFF
- [ ] Create task due in 1 minute
- [ ] Wait for notification
- [ ] Notification appears but no sound plays

---

## 7. Theme & Appearance

### Auto Theme (System Preference)
- [ ] Set Settings theme to "Auto (System)"
- [ ] Change OS dark mode setting
- [ ] App theme changes automatically

### Light Theme
- [ ] Set theme to "Light"
- [ ] Background is light
- [ ] Text is dark
- [ ] Good contrast

### Dark Theme
- [ ] Set theme to "Dark"
- [ ] Background is dark
- [ ] Text is light
- [ ] Good contrast

### Theme Persists
- [ ] Change theme
- [ ] Refresh page
- [ ] Theme preference is maintained

### Accent Colors
- [ ] Click Blue color in Settings
- [ ] Buttons and accents are blue
- [ ] Click Purple color
- [ ] Accents change to purple
- [ ] Click Green color
- [ ] Accents change to green
- [ ] Refresh page
- [ ] Accent color is maintained

---

## 8. PWA Features

### Service Worker Registration
- [ ] Open DevTools → Application → Service Workers
- [ ] Service Worker is registered and active
- [ ] Status shows "activated and is running"

### Offline Functionality - First Load
- [ ] Clear all browser cache (DevTools → Application → Clear storage)
- [ ] Load app while online
- [ ] Check Network tab - resources loaded
- [ ] Check Application → Cache Storage
- [ ] Files are cached

### Offline Functionality - Reload
- [ ] With app loaded, go offline (DevTools → Network → Offline)
- [ ] Refresh page (F5)
- [ ] App loads successfully from cache
- [ ] All functionality works (except notifications)
- [ ] No network errors in console

### Install Prompt
- [ ] (Desktop Chrome/Edge) Install banner appears at top
- [ ] Click "Install App" button
- [ ] Browser install dialog appears
- [ ] Click "Install"
- [ ] App installs and opens in standalone window

### Installed App
- [ ] Launch installed app from OS
- [ ] App opens in standalone window (no browser UI)
- [ ] All features work normally
- [ ] Data persists between standalone and browser versions

### Manifest Validation
- [ ] Open DevTools → Application → Manifest
- [ ] All fields populated correctly
- [ ] Icons listed (all sizes)
- [ ] No manifest errors

---

## 9. Data Management

### Export Tasks
- [ ] Create several tasks with various properties
- [ ] Go to Settings → Export Data
- [ ] Click "📥 Export Tasks"
- [ ] JSON file downloads
- [ ] Filename format: `todo-backup-YYYY-MM-DD.json`
- [ ] Open file - valid JSON with all task data

### Import Tasks
- [ ] Go to Settings → Import Data
- [ ] Click "📤 Import Tasks"
- [ ] File picker opens
- [ ] Select exported JSON file
- [ ] Tasks are imported
- [ ] Snackbar shows "X tasks imported"
- [ ] Imported tasks appear in list

### Import Merge Behavior
- [ ] Export current tasks
- [ ] Add new task (not in export)
- [ ] Import the exported file
- [ ] New task is still present (not overwritten)
- [ ] Imported tasks merged with existing

### Clear All Data
- [ ] Go to Settings
- [ ] Click "🗑️ Clear All Tasks"
- [ ] Confirmation dialog appears
- [ ] Click "Confirm"
- [ ] All tasks deleted
- [ ] Empty state appears
- [ ] Snackbar shows "All tasks cleared"

---

## 10. Keyboard Shortcuts

### New Task Shortcut
- [ ] Press `N` key (outside inputs)
- [ ] Task creation modal opens
- [ ] Title field is focused

### Search Shortcut
- [ ] Press `/` key (outside inputs)
- [ ] Search input is focused
- [ ] Can type immediately

### Escape to Close
- [ ] Open any modal
- [ ] Press `Escape` key
- [ ] Modal closes

### Form Navigation
- [ ] Open task creation modal
- [ ] Press `Tab` key repeatedly
- [ ] Focus moves through all form fields in order
- [ ] Can navigate entire form with keyboard

---

## 11. Accessibility

### Screen Reader (if available)
- [ ] Enable screen reader (NVDA, JAWS, VoiceOver)
- [ ] Navigate through tasks
- [ ] Task titles and metadata announced
- [ ] Button labels announced correctly
- [ ] Modal titles announced on open

### Keyboard Navigation
- [ ] Without using mouse, press Tab repeatedly
- [ ] All interactive elements focusable
- [ ] Focus indicator visible (blue outline)
- [ ] Logical focus order maintained

### Focus Trap in Modals
- [ ] Open any modal
- [ ] Press Tab repeatedly
- [ ] Focus stays within modal
- [ ] Cannot tab to elements behind modal

### ARIA Labels
- [ ] Inspect elements in DevTools
- [ ] Buttons have aria-label or visible text
- [ ] Form inputs have associated labels
- [ ] Modals have aria-modal and role="dialog"

---

## 12. Responsive Design

### Mobile View (375px)
- [ ] Open DevTools → Toggle device toolbar
- [ ] Select iPhone SE or similar
- [ ] Layout stacks vertically
- [ ] Text is readable (not too small)
- [ ] Buttons are large enough to tap (min 44x44px)
- [ ] No horizontal scrolling

### Tablet View (768px)
- [ ] Set viewport to iPad or similar
- [ ] Filters show in row layout
- [ ] Tasks have adequate spacing
- [ ] Modals are appropriately sized

### Desktop View (1280px+)
- [ ] Maximize browser window
- [ ] Content is centered with max-width
- [ ] Not too stretched or cramped
- [ ] Good use of white space

### Orientation Change
- [ ] On mobile device, rotate screen
- [ ] Layout adapts to orientation
- [ ] No broken layouts

---

## 13. Edge Cases

### Empty States
- [ ] Delete all tasks
- [ ] "No tasks yet" message appears with icon
- [ ] "Create Task" button in empty state
- [ ] Click button - opens task modal

### Very Long Task Titles
- [ ] Create task with 200-character title
- [ ] Title displays without breaking layout
- [ ] In detail modal, full title is visible

### Many Tags
- [ ] Create task with 10+ tags
- [ ] In list view, shows first 3 tags + "+X more"
- [ ] In detail view, all tags visible

### Concurrent Operations
- [ ] Quickly create multiple tasks
- [ ] All tasks save successfully
- [ ] No errors in console

### Form Validation
- [ ] Open task creation modal
- [ ] Leave title empty
- [ ] Try to submit
- [ ] HTML5 validation prevents submission
- [ ] "Please fill out this field" message

---

## 14. Performance

### Initial Load Time
- [ ] Clear cache and hard reload (Ctrl+Shift+R)
- [ ] Note load time in Network tab
- [ ] Should load in < 2 seconds on good connection

### Large Dataset
- [ ] Import JSON file with 100+ tasks
- [ ] UI remains responsive
- [ ] Scrolling is smooth
- [ ] Search and filter still fast

### Memory Leaks
- [ ] Open task → close modal (repeat 20 times)
- [ ] Open Settings → close (repeat 20 times)
- [ ] Check DevTools → Memory
- [ ] No significant memory growth

---

## 15. Browser Compatibility

Test in multiple browsers:

### Chrome/Edge (Chromium)
- [ ] All features work
- [ ] PWA install available
- [ ] Notifications work

### Firefox
- [ ] All features work
- [ ] PWA install available (Firefox 117+)
- [ ] Notifications work

### Safari (macOS/iOS)
- [ ] All features work
- [ ] Add to Home Screen available
- [ ] Notifications work (macOS 16.4+, iOS)

---

## 16. Security & Privacy

### Local Data Only
- [ ] Open DevTools → Network tab
- [ ] Perform various actions (create, edit, delete)
- [ ] No external network requests
- [ ] All data stays local

### IndexedDB Storage
- [ ] Open DevTools → Application → Storage → IndexedDB
- [ ] Database "TodoPWA" exists
- [ ] Object store "tasks" contains task data
- [ ] Data is readable and structured

### Clear Browser Data
- [ ] Note current task count
- [ ] Clear browser data (DevTools → Application → Clear storage)
- [ ] Refresh page
- [ ] All tasks are gone (as expected)
- [ ] Import previously exported backup
- [ ] Tasks restored

---

## Test Summary

**Date Tested**: ___________  
**Browser**: ___________  
**OS**: ___________  
**Total Tests**: 200+  
**Passed**: ___________  
**Failed**: ___________  
**Notes**: 

---

## Known Limitations (Expected Behavior)

✅ **These are NOT bugs:**

1. **Background Notifications**: Notifications only work when browser tab is open. This is a browser limitation. See README for FCM server-push solution.

2. **Notification Timing**: Reminders check every 60 seconds, so notifications may be delayed by up to 1 minute.

3. **Storage Limits**: IndexedDB has browser-dependent limits (typically 50MB-unlimited). Exceeding will cause quota errors.

4. **iOS Safari Notifications**: On iOS < 16.4, web notifications are not supported at all.

5. **Service Worker Updates**: New versions require a page refresh after download to activate.

---

## Reporting Issues

If you find a bug not listed in Known Limitations:

1. Check browser console for errors
2. Note browser version and OS
3. List steps to reproduce
4. Include screenshots if applicable
5. Note if issue occurs in other browsers