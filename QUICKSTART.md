# yang ga punya WA - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" or select existing project
3. Go to Project Settings (gear icon)
4. Copy your config object with these keys:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### Step 3: Update Firebase Config
Open `src/services/firebase.ts` and replace the `firebaseConfig`:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### Step 4: Create Firestore Collections
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Create two collections by clicking **Start collection**:
   - Collection name: `users` (click `Save`)
   - Collection name: `messages` (click `Save`)

### Step 5: Run the App
```bash
npm run dev
```

App opens at `http://localhost:5173` automatically! 🎉

---

## What To Do Next

1. **Create Account**
   - Enter any username (min 3 characters)
   - Click "Create Account"

2. **Start Chatting**
   - Type message in input field
   - Click send button or press Enter
   - See message appear instantly!

3. **Test Real-Time**
   - Open another browser window/tab
   - Refresh and create another account
   - Send messages - watch them appear in both windows!

---

## Common Commands

```bash
# Development server (with auto-reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Features ✨

✅ **Real-time Chat** - Messages appear instantly  
✅ **User Accounts** - Create unique username  
✅ **Session Persistence** - Stay logged in after refresh  
✅ **Beautiful UI** - Built with Vuetify  
✅ **TypeScript** - Type-safe code  
✅ **Firebase Backend** - Scalable database  

---

## File Structure

```
src/
├── views/          ← Chat pages (CreateAccount, Chat)
├── stores/         ← Global state (auth, messages)
├── services/       ← Firebase & session logic
├── router/         ← Navigation & route protection
├── types/          ← TypeScript definitions
├── App.vue         ← Root component
└── main.ts         ← App startup
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm install` fails | Delete `node_modules`, run again |
| "Firebase config error" | Check API keys in `firebase.ts` |
| Messages don't load | Check Firestore collections exist |
| Can't send message | Check Firebase/internet connection |
| Session not saving | Check if localStorage enabled |

---

## Next Steps

Read more detailed docs:
- **SETUP.md** - Detailed setup instructions
- **DEVELOPMENT.md** - Architecture & development guide
- **README.md** - Features & API reference

---

## Need Help?

1. Check browser console: `F12` → Console tab
2. Check Firebase Console for errors: https://console.firebase.google.com
3. Read DEVELOPMENT.md for debugging tips

---

**Happy chatting! 💬**
