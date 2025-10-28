# TODO PWA - Complete Progressive Web Application

A fully-featured, offline-capable TODO application built with vanilla JavaScript, HTML5, and CSS3. No frameworks, no build tools—just modern web standards.

## Features

✅ **Core Functionality**
- Create, Read, Update, Delete tasks
- Task properties: title, description, due date/time, priority, tags
- Mark tasks as complete/incomplete
- Search across title and description (debounced)
- Filter by status (All/Complete/Incomplete/Overdue) and priority
- Sort by due date, creation date, or alphabetically
- Visual overdue indicators

✅ **Persistence & Offline**
- IndexedDB storage for scalability
- Service Worker with cache-first strategy
- Works completely offline after first load
- All data stored locally (privacy-first)

✅ **PWA Features**
- Installable on desktop and mobile
- Custom install button with beforeinstallprompt handling
- Full manifest.json with icons
- Offline-ready service worker

✅ **Notifications & Reminders**
- Browser notifications when tasks become due
- In-app badge alerts
- Optional notification sound (toggle in settings)
- Automatic checking every 60 seconds
- **Note**: Background notifications when browser is closed require server push (see limitations below)

✅ **UX Enhancements**
- Light/Dark theme with system preference detection
- Three accent color schemes (Blue, Purple, Green)
- Empty state screens
- Undo delete with snackbar (5-second window)
- Smooth CSS animations
- Keyboard shortcuts (see below)
- Responsive mobile-first design

✅ **Data Management**
- Export tasks as JSON
- Import tasks from JSON
- Clear all data (with confirmation)
- Settings panel

## File Structure

```
todo-pwa/
├── index.html              # Main application HTML
├── styles.css              # All styles (CSS variables, responsive)
├── app.js                  # Application logic (modular architecture)
├── service-worker.js       # Offline support and caching
├── manifest.json           # PWA manifest
├── icons/                  # PWA icons (various sizes)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
└── README.md               # This file
```

## How to Run Locally

### Option 1: Python Simple Server (Recommended)

```bash
# Python 3.x
cd todo-pwa
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js http-server

```bash
# Install globally (once)
npm install -g http-server

# Run in project directory
cd todo-pwa
http-server -p 8000
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"

### Option 4: PHP Built-in Server

```bash
cd todo-pwa
php -S localhost:8000
```

**Important**: You MUST use a local server (not `file://` protocol) for service workers and notifications to work properly.

## Installing as PWA

1. Open the app in a supported browser (Chrome, Edge, Safari 16.4+)
2. Click the **"Install App"** button in the header (or use browser's install prompt)
3. The app will be installed as a standalone application
4. Launch from your home screen (mobile) or app launcher (desktop)

## Keyboard Shortcuts

- `n` or `N` - Create new task
- `/` - Focus search bar
- `Escape` - Close modal/dialog
- `Enter` - Submit form (when in form)
- `Tab` - Navigate between elements
- `Space` - Toggle checkboxes

## Browser Compatibility

- **Chrome/Edge 90+**: Full support
- **Firefox 90+**: Full support
- **Safari 16.4+**: Full support (iOS/macOS)
- **Service Workers**: Required for offline functionality
- **Notifications API**: Required for due date alerts
- **IndexedDB**: Required for data storage

## Data Storage

This app uses **IndexedDB** for task storage instead of localStorage for several reasons:

### Why IndexedDB?

1. **Scalability**: Handles thousands of tasks efficiently (localStorage has ~5-10MB limit)
2. **Structured Data**: Native support for objects, dates, and complex data types
3. **Asynchronous**: Non-blocking operations keep UI responsive
4. **Indexing**: Fast queries and searches on multiple fields
5. **Transactions**: ACID-compliant data integrity

### Data Schema

```javascript
{
  id: "uuid-v4",                    // Unique identifier
  title: "string",                  // Required
  description: "string",            // Optional
  completed: boolean,               // Default false
  priority: "low|medium|high",      // Default "medium"
  dueDate: ISO8601 string,          // Optional
  createdAt: ISO8601 string,        // Auto-generated
  tags: ["string"],                 // Optional array
  notified: boolean                 // Track if reminder sent
}
```

## Important Limitations & Notes

### Background Notifications (When Browser/Tab is Closed)

⚠️ **Browser Limitation**: Browsers cannot reliably deliver notifications when completely closed without a server push mechanism.

**Current Implementation**:
- ✅ Notifications work when the app tab is open
- ✅ Notifications work when tab is in background (browser open)
- ❌ Notifications DO NOT work when browser is fully closed

**Why?** Browsers suspend JavaScript execution when no tabs are open for battery/performance reasons.

**Solution**: Implement server-side push notifications using Firebase Cloud Messaging (FCM) or Web Push API with your own server. See "Optional: FCM Integration" section below.

### Privacy & Security

- **All data is stored locally** in your browser (IndexedDB)
- **No data is sent to any server** (100% client-side)
- **No tracking or analytics**
- **No external dependencies** (except notification sounds stored as data URIs)
- Clearing browser data will delete all tasks (use Export feature for backups!)

### Service Worker Updates

When a new version is deployed:
1. Service worker detects the update
2. New SW installs in the background
3. On next page load, new version activates
4. Hard refresh (Ctrl+Shift+R) forces immediate update

## Acceptance Test Checklist

Run through these tests to verify functionality:

### Basic Operations
- [ ] **Create Task**: Click "Add Task" → fill form → save → task appears
- [ ] **Reload Persistence**: Refresh page → task still exists
- [ ] **Edit Task**: Click task → click "Edit" button → modify → save → changes persist after reload
- [ ] **Delete Task**: Click task → "Delete" → confirm → task removed
- [ ] **Undo Delete**: Delete task → click "Undo" in snackbar within 5 seconds → task restored

### Completion & Filtering
- [ ] **Mark Complete**: Click checkbox on task → visual change (strikethrough, opacity)
- [ ] **Reload After Complete**: Refresh → completed state persists
- [ ] **Filter Complete**: Select "Completed" filter → only completed tasks show
- [ ] **Filter Incomplete**: Select "Incomplete" filter → only incomplete tasks show

### Search & Sort
- [ ] **Search**: Type in search box → matching tasks display instantly (debounced)
- [ ] **Search Multiple Fields**: Search matches both title and description
- [ ] **Clear Search**: Clear search → all tasks return
- [ ] **Sort by Due Date**: Change sort → tasks reorder correctly
- [ ] **Sort Alphabetically**: Sort A-Z → tasks in alphabetical order

### Due Dates & Notifications
- [ ] **Set Due Date**: Create task with due date 2 minutes in future → save
- [ ] **Overdue Visual**: Set due date in past → task shows red "Overdue" badge
- [ ] **Overdue Filter**: Click "Overdue" filter → only overdue tasks show
- [ ] **Notification Permission**: Grant notification permission when prompted
- [ ] **Due Notification**: Wait until task becomes due (tab open) → browser notification appears + in-app badge
- [ ] **Sound Alert**: Enable sound in settings → notification plays sound (if enabled)

### Themes & Settings
- [ ] **Dark Mode**: Toggle dark/light theme → changes apply
- [ ] **Theme Persists**: Refresh page → theme preference saved
- [ ] **System Preference**: Clear settings → app respects OS dark mode preference
- [ ] **Accent Color**: Change accent color → UI updates (buttons, badges)
- [ ] **Color Persists**: Refresh → accent color saved

### PWA Features
- [ ] **Offline Loading**: Load app → go offline (disable network) → refresh → app still loads
- [ ] **Install Button**: "Install App" button visible in supported browsers
- [ ] **Install Flow**: Click "Install App" → browser install prompt appears
- [ ] **Installed App**: Install app → launch from home screen/app launcher → works standalone

### Data Management
- [ ] **Export**: Click Settings → Export Data → JSON file downloads
- [ ] **Import**: Click Settings → Import Data → select JSON file → tasks load correctly
- [ ] **Import Merges**: Import doesn't delete existing tasks (merges by ID)
- [ ] **Clear All Data**: Click "Clear All Data" → confirm → all tasks deleted

### Accessibility & UX
- [ ] **Keyboard Shortcuts**: Press `n` → new task modal opens, `/` → search focuses, `Esc` → modal closes
- [ ] **Tab Navigation**: Use Tab key → all interactive elements focusable in logical order
- [ ] **Screen Reader**: Test with screen reader → announcements for dynamic changes
- [ ] **Mobile Responsive**: Open on phone → layout adapts, buttons large enough to tap
- [ ] **Empty State**: Delete all tasks → "No tasks yet" message appears

## Optional: FCM Integration for Background Notifications

To enable notifications when the browser is closed, you need server-side push notifications.

### Prerequisites

1. Firebase account (free tier sufficient)
2. Firebase Cloud Messaging (FCM) enabled
3. VAPID keys for Web Push

### Setup Steps

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Create new project
   - Enable Cloud Messaging

2. **Get Configuration**
   - Project Settings → General → Web App
   - Copy `firebaseConfig` object
   - Project Settings → Cloud Messaging → Web Push certificates
   - Generate VAPID key pair

3. **Update manifest.json**
   ```json
   {
     "gcm_sender_id": "YOUR_SENDER_ID"
   }
   ```

4. **Update service-worker.js**
   Add Firebase imports and push event listener:
   ```javascript
   importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
   importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

   firebase.initializeApp({
     apiKey: "YOUR_API_KEY",
     projectId: "YOUR_PROJECT_ID",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   });

   const messaging = firebase.messaging();

   messaging.onBackgroundMessage((payload) => {
     const notificationTitle = payload.notification.title;
     const notificationOptions = {
       body: payload.notification.body,
       icon: '/icons/icon-192.png',
       badge: '/icons/icon-96.png'
     };
     return self.registration.showNotification(notificationTitle, notificationOptions);
   });
   ```

5. **Update app.js**
   Add FCM token registration:
   ```javascript
   // After service worker registration
   const messaging = firebase.messaging();
   messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' }).then((token) => {
     console.log('FCM Token:', token);
     // Send token to your server to store
   });
   ```

6. **Server-Side Scheduling**
   - Store FCM tokens on your server
   - Implement cron job to check due dates
   - Send push notifications via FCM Admin SDK when tasks become due

### Alternative: Web Push API (No Firebase)

You can also use the standard Web Push API with your own server:
- Generate VAPID keys: `npx web-push generate-vapid-keys`
- Subscribe users with `PushManager.subscribe()`
- Send notifications from server using `web-push` library (Node.js)

**Note**: Both approaches require a backend server. This is a browser limitation, not an app limitation.

## Icon Generation

Icons are required in the following sizes: 72, 96, 128, 144, 152, 192, 384, 512.

### Quick Icon Generation

1. **Using Online Tool**:
   - Create a 512x512 PNG source icon
   - Use https://www.pwabuilder.com/imageGenerator
   - Upload source → generates all sizes

2. **Using ImageMagick** (command line):
   ```bash
   convert icon-512.png -resize 72x72 icon-72.png
   convert icon-512.png -resize 96x96 icon-96.png
   convert icon-512.png -resize 128x128 icon-128.png
   convert icon-512.png -resize 144x144 icon-144.png
   convert icon-512.png -resize 152x152 icon-152.png
   convert icon-512.png -resize 192x192 icon-192.png
   convert icon-512.png -resize 384x384 icon-384.png
   ```

3. **Using Node.js sharp** (script):
   ```javascript
   const sharp = require('sharp');
   const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
   
   sizes.forEach(size => {
     sharp('icon-source.png')
       .resize(size, size)
       .toFile(`icons/icon-${size}.png`);
   });
   ```

### Placeholder Icons

For testing, you can use placeholder icons from:
- https://via.placeholder.com/512/3B82F6/FFFFFF?text=TODO
- Download and resize using methods above

## Troubleshooting

### Service Worker Not Updating
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Clear site data: DevTools → Application → Clear storage
- Unregister old SW: DevTools → Application → Service Workers → Unregister

### Notifications Not Showing
- Check permission: DevTools → Application → Notifications
- Ensure HTTPS or localhost (required for notifications)
- Check browser notification settings (system level)
- Verify service worker is active

### IndexedDB Errors
- Check browser support: All modern browsers support IndexedDB
- Clear IndexedDB: DevTools → Application → IndexedDB → Delete
- Check for quota exceeded errors (rare, only with thousands of tasks)

### PWA Not Installing
- Requires HTTPS (or localhost for testing)
- Manifest must be valid JSON
- All icon URLs must be accessible
- Service worker must be registered successfully

## Development

### Code Structure

The app uses a modular architecture:

```javascript
// app.js structure
- DB Module: IndexedDB operations (CRUD)
- State Module: Application state management
- UI Module: DOM manipulation and rendering
- Modal Module: Dialog management
- Notification Module: Reminders and alerts
- Theme Module: Theme switching logic
- PWA Module: Service worker and install prompt
- Storage Module: Export/import functionality
- Init Module: App initialization
```

### Adding New Features

1. **New Task Property**: Update DB schema version in `openDatabase()`
2. **New Filter**: Add to `FILTERS` object and update `filterTasks()`
3. **New Theme**: Add to CSS variables and `THEMES` object
4. **New Keyboard Shortcut**: Add to `handleKeyboardShortcuts()`

## Performance Notes

- Debounced search (300ms) prevents excessive filtering
- Virtual scrolling NOT implemented (add if >1000 tasks needed)
- IndexedDB queries are indexed for fast lookups
- Service worker caches all assets for instant loading
- CSS animations use `transform` and `opacity` for GPU acceleration

## License

This is a demonstration project. Feel free to use, modify, and distribute.

## Support

For issues, questions, or contributions, this is a standalone demonstration app. Modify as needed for your use case.

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Tested On**: Chrome 120+, Firefox 120+, Safari 17+