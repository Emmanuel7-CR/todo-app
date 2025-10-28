# TODO PWA - Quick Start Guide

Get your TODO app running in 5 minutes!

## 🚀 Fastest Setup (3 steps)

### 1. Create Project Structure

```bash
mkdir todo-pwa
cd todo-pwa
mkdir icons
```

### 2. Copy Files

Copy these files into your `todo-pwa` directory:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `app.js`
- ✅ `service-worker.js`
- ✅ `manifest.json`

### 3. Generate Icons (Choose One Method)

**Option A - Online Tool (Easiest)**
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 icon (or create one quickly at https://www.canva.com)
3. Download ZIP and extract to `/icons/` folder

**Option B - Use Placeholders (Testing Only)**
```bash
# Quick placeholder icons
for size in 72 96 128 144 152 192 384 512; do
  curl "https://via.placeholder.com/${size}/3B82F6/FFFFFF?text=TODO" \
    -o "icons/icon-${size}.png"
done
```

**Option C - ImageMagick (Best Quality)**
```bash
# Create a simple 512x512 source icon first, then:
convert source.png -resize 72x72 icons/icon-72.png
convert source.png -resize 96x96 icons/icon-96.png
convert source.png -resize 128x128 icons/icon-128.png
convert source.png -resize 144x144 icons/icon-144.png
convert source.png -resize 152x152 icons/icon-152.png
convert source.png -resize 192x192 icons/icon-192.png
convert source.png -resize 384x384 icons/icon-384.png
convert source.png -resize 512x512 icons/icon-512.png
```

### 4. Start Local Server

**Python** (Recommended):
```bash
python -m http.server 8000
# OR
python3 -m http.server 8000
```

**Node.js**:
```bash
npx http-server -p 8000
```

**PHP**:
```bash
php -S localhost:8000
```

### 5. Open in Browser

```
http://localhost:8000
```

**That's it!** Your TODO PWA is running! 🎉

---

## ✅ First Actions Checklist

Once the app is running:

1. **Grant Notification Permission**
   - Click Settings (⚙️) icon
   - Toggle "Enable Notifications" ON
   - Click "Allow" in browser prompt

2. **Create Your First Task**
   - Click "Add Task" button (or press `N`)
   - Enter a title
   - Set due date 2 minutes in future
   - Click "Add Task"

3. **Test Offline Mode**
   - Open DevTools (F12)
   - Go to Network tab → Check "Offline"
   - Refresh page (F5)
   - App still works! ✓

4. **Install as PWA**
   - Look for install banner or browser prompt
   - Click "Install App"
   - App installs to your device

5. **Test Notification**
   - Wait for your task to become due
   - Browser notification pops up
   - In-app badge shows alert

---

## 📁 Final File Structure

```
todo-pwa/
├── index.html              # Main app HTML
├── styles.css              # All styles
├── app.js                  # Application logic
├── service-worker.js       # Offline support
├── manifest.json           # PWA configuration
├── icons/                  # App icons
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
├── README.md               # Full documentation
├── TESTING-CHECKLIST.md    # Acceptance tests
└── ICONS-GUIDE.md          # Icon generation guide
```

---

## 🎯 Quick Feature Tour

### Keyboard Shortcuts
- `N` - New task
- `/` - Focus search
- `Esc` - Close modal

### Creating Tasks
1. Click "Add Task" or press `N`
2. Fill in details (only title required)
3. Save → Task appears instantly

### Organizing Tasks
- **Search**: Type in search box (instant results)
- **Filter**: Status (All/Complete/Incomplete/Overdue)
- **Priority**: Filter by High/Medium/Low
- **Sort**: By date, alphabetical, or priority

### Theming
- Click 🌙/☀️ icon to toggle dark/light
- Settings → Choose accent color (Blue/Purple/Green)
- Theme persists across sessions

### Data Management
- **Export**: Settings → Export Data (JSON file)
- **Import**: Settings → Import Data (restore from JSON)
- **Clear**: Settings → Clear All Data (with confirmation)

---

## 🔧 Troubleshooting

### App Won't Load
- ✅ Using `http://localhost` or `https://`? (NOT `file://`)
- ✅ Check browser console for errors (F12)
- ✅ Try different browser

### Service Worker Not Working
```bash
# Clear cache and hard reload
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

### Notifications Not Showing
- ✅ Permission granted in browser?
- ✅ Notifications enabled in Settings?
- ✅ Task due date in future?
- ✅ Browser tab open when task becomes due?

### Icons Not Appearing
- ✅ Files exist in `/icons/` folder?
- ✅ Filenames match manifest.json?
- ✅ Try reinstalling PWA

### Database Errors
```javascript
// Open browser console and run:
indexedDB.deleteDatabase('TodoPWA');
// Then refresh page
```

---

## 📱 Testing on Mobile

### iOS (Safari)
1. Open app URL in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Open from home screen

### Android (Chrome)
1. Open app URL in Chrome
2. Tap menu (⋮)
3. "Install app" or "Add to Home screen"
4. Open from app drawer

---

## 🚀 Next Steps

1. **Read Full Documentation**: Check `README.md` for all features
2. **Run Tests**: Use `TESTING-CHECKLIST.md` to verify everything works
3. **Customize Icons**: See `ICONS-GUIDE.md` for professional icon creation
4. **Deploy**: Host on GitHub Pages, Netlify, or Vercel (all free!)

---

## 📦 Production Deployment

### GitHub Pages (Free)

```bash
# 1. Create repo on GitHub
# 2. Push your code
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/todo-pwa.git
git push -u origin main

# 3. Enable GitHub Pages
# Go to repo Settings → Pages → Source: main branch → Save
# Your app will be at: https://yourusername.github.io/todo-pwa/
```

### Netlify (Free)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --dir=. --prod

# Follow prompts - gets custom URL like: https://your-app.netlify.app
```

### Vercel (Free)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# Follow prompts - gets custom URL
```

**Important for Production:**
- ✅ Update `start_url` in `manifest.json` to your domain
- ✅ Update `scope` in `manifest.json`
- ✅ Use HTTPS (required for service workers)
- ✅ Replace placeholder icons with professional ones

---

## 🎨 Customization Ideas

### Change App Name
1. Edit `manifest.json` → Change `name` and `short_name`
2. Edit `index.html` → Change `<title>` and `.app-title`

### Change Theme Color
1. Edit `:root` in `styles.css`
2. Update `--primary` color variable
3. Update `theme_color` in `manifest.json`

### Add Custom Features
- 📁 File attachments (store file paths in tasks)
- 🔗 Link tasks together (parent/child relationships)
- 📊 Statistics dashboard (completed rate, overdue count)
- 🎯 Task categories/projects
- 👥 Multiple user profiles (switch between accounts)
- 🔄 Cloud sync (add Firebase or your backend)

---

## 📚 Learning Resources

**PWAs:**
- [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev - PWA](https://web.dev/progressive-web-apps/)

**IndexedDB:**
- [MDN - IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

**Service Workers:**
- [MDN - Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

**Notifications:**
- [MDN - Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

---

## 💡 Pro Tips

1. **Backup Often**: Export your data regularly
2. **Test Offline**: Verify offline functionality works before sharing
3. **Mobile First**: Always test on actual mobile devices
4. **Accessibility**: Use keyboard shortcuts, test with screen readers
5. **Performance**: Keep task count reasonable (< 1000 for best performance)

---

## 🤝 Contributing Ideas

Want to enhance this app? Ideas:
- 🔍 Advanced search with filters
- 🏷️ Tag-based organization
- 📅 Calendar view
- 🔔 Recurring tasks
- 🎨 Custom themes
- 📈 Productivity analytics
- 🌐 Multi-language support
- ♿ Enhanced accessibility

---

## ❓ Common Questions

**Q: Can I use this commercially?**
A: Yes! This is open source. Use however you like.

**Q: Does it work without internet?**
A: Yes! After first load, works 100% offline.

**Q: Where is my data stored?**
A: Locally in your browser (IndexedDB). Never sent to any server.

**Q: Can I sync across devices?**
A: Not by default. See README for optional cloud sync setup.

**Q: Will I get notifications when browser is closed?**
A: No, this requires a server push mechanism (see FCM section in README).

**Q: What browsers are supported?**
A: Chrome 90+, Firefox 90+, Safari 16.4+, Edge 90+

**Q: Is it secure?**
A: Yes - all data stays local, no external requests, no tracking.

**Q: Can I change the design?**
A: Absolutely! Edit `styles.css` freely.

---

## 🎉 You're All Set!

Your TODO PWA is now running. Enjoy organizing your tasks with a modern, offline-capable web app!

**Need help?** Check the detailed README.md for comprehensive documentation.

**Found a bug?** Use TESTING-CHECKLIST.md to verify expected behavior.

**Want better icons?** See ICONS-GUIDE.md for professional icon creation.

---

**Happy task managing! 📝✨**