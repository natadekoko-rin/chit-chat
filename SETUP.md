# yang ga punya WA - Setup & Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing project
3. Go to **Project Settings** → Copy your config
4. Update `src/services/firebase.ts`:

Replace the `firebaseConfig` object:
```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id"
}
```

### 3. Create Firestore Collections

In Firebase Console:
1. Go to **Firestore Database**
2. Create two collections:
   - **users** - for storing user accounts
   - **messages** - for storing chat messages

### 4. Set Firestore Rules (Development)

Go to **Firestore** → **Rules** and set:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING:** This rule allows full access. For production, set proper security rules!

### 5. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Architecture

### Stores (Pinia)

**authStore.ts** - User authentication
- `user` - Current user object
- `isLoading` - Loading state
- `error` - Error messages
- Methods: `initializeAuth()`, `setUser()`, `logout()`, `isAuthenticated()`

**chatStore.ts** - Chat messages
- `messages` - Array of messages
- `isLoading` - Loading state
- `error` - Error messages
- Methods: `setMessages()`, `addMessage()`, `setUnsubscribe()`

### Services

**firebase.ts**
- `createUser(username)` - Create new user
- `getUserByUsername(username)` - Find user by username
- `sendMessage(userId, username, content)` - Send a message
- `getMessages()` - Get all messages
- `subscribeToMessages(callback)` - Real-time message subscription

**session.ts**
- `saveSession(session)` - Save to localStorage
- `getSession()` - Get from localStorage
- `clearSession()` - Delete from localStorage
- `hasSession()` - Check if session exists

### Router

- `/` - Redirects to `/chat`
- `/create-account` - User registration page
- `/chat` - Main chat page (requires authentication)

Route guard redirects:
- If not authenticated: → Create Account
- If authenticated: → Chat

## Features Explained

### Real-Time Updates
- Uses Firebase `onSnapshot()` listener
- Messages update instantly without refresh
- Unsubscribes on component unmount

### Session Persistence
- Stored in localStorage as `ygpw_session`
- Contains: username & UUID
- Validates on app load
- Persists across browser restarts

### Message Display
- Sent messages align right (blue background)
- Received messages align left (white background)
- Shows username & timestamp
- Auto-scrolls to latest message

## Troubleshooting

### Firebase Connection Error
**Error:** "Could not connect to Cloud Firestore backend"
- ✅ Check internet connection
- ✅ Verify Firebase config in `firebase.ts`
- ✅ Check Firebase project is active

### "Username already taken"
- This is expected! Choose a different username
- Each user must have a unique username

### Messages not loading
- ✅ Verify Firestore collections exist
- ✅ Check Firestore security rules allow reading
- ✅ Check browser console for errors

### Session not persisting
- ✅ Check if localStorage is enabled
- ✅ Check browser's privacy mode (disables storage)
- ✅ Try a different browser

### Icons not showing
- ✅ Clear browser cache
- ✅ Check if @mdi/js is installed (`npm install`)
- ✅ Restart dev server

## Development Tips

### Debug Firebase Calls
Add console logs in `firebase.ts`:
```typescript
console.log('Creating user:', username)
// ... operation ...
console.log('User created:', result)
```

### Monitor State Changes
Use Vue DevTools to inspect Pinia stores:
- Watch `authStore` for session changes
- Watch `chatStore` for message updates

### Test Real-Time Updates
1. Open app in 2 browser windows
2. Send message in first window
3. Watch for instant update in second window

## File Structure Explained

```
src/
├── views/          # Full page components
│   ├── CreateAccount.vue    # Registration UI
│   └── Chat.vue             # Main chat interface
├── stores/         # Pinia state management
│   ├── authStore.ts         # User session state
│   └── chatStore.ts         # Message state
├── services/       # Business logic
│   ├── firebase.ts          # Firebase operations
│   └── session.ts           # LocalStorage operations
├── types/          # TypeScript interfaces
│   └── index.ts             # Type definitions
├── router/         # Vue Router
│   └── index.ts             # Route definitions & guards
├── App.vue         # Root component
└── main.ts         # App initialization
```

## Next Steps for Production

1. **Security Rules:** Set proper Firestore rules
2. **Environment Variables:** Use `.env` for sensitive data
3. **Authentication:** Add Firebase Auth (email/password)
4. **Data Validation:** Add more input validation
5. **Error Handling:** Improve error messages
6. **Tests:** Add unit & integration tests
7. **Deployment:** Deploy to Vercel, Netlify, or Firebase Hosting

## Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vuetify 3 Components](https://vuetifyjs.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
