# Chat Feature Implementation Guide

## Overview
A real-time chat application built with Vue 3, Vuetify, Pinia, and Firebase. Users can register with a username, login, and chat with other users in a shared chat room.

## Architecture & Flow

### 1. **Authentication Flow**

#### First-Time User (Registration)
```
User Access → Create Account Page
   ↓
Enter Username (min 3 chars)
   ↓
Check if Username Exists
   ↓ (No) Create User in Firebase
   ↓ (Yes) Show Error
Generate UUID (userId)
   ↓
Save Session to localStorage
   ↓ (username, userId)
Redirect to Chat Page
```

#### Returning User (Login)
```
User Access → Create Account Page
   ↓
Switch to Login Mode
   ↓
Enter Username
   ↓
Find User in Firebase
   ↓ (Found) Load User Data
   ↓ (Not Found) Show Error
Save Session to localStorage
   ↓ (username, userId)
Redirect to Chat Page
```

#### Session Validation
```
User Access App
   ↓
Check localStorage for session
   ↓ (Found) Valid Session
      ↓
      Redirect to Chat Page
   ↓ (Not Found) No Session
      ↓
      Redirect to Create Account Page
```

### 2. **Data Structure**

#### Firebase Collections

**`users` Collection**
```typescript
{
  id: string,           // UUID generated on registration
  username: string,     // Unique username
  createdAt: number     // Timestamp
}
```

**`messages` Collection**
```typescript
{
  id: string,           // UUID for each message
  userId: string,       // User's UUID
  username: string,     // User's username (for display)
  content: string,      // Message text
  timestamp: number     // Message timestamp
}
```

#### localStorage (Session)
```typescript
{
  username: string,     // Current user's username
  userId: string        // Current user's UUID
}
```

### 3. **Key Components**

#### **CreateAccount.vue**
- Toggle between Register and Login modes
- Validates username (min 3 characters)
- Prevents duplicate usernames on registration
- Handles both registration and login logic
- Automatically saves session and redirects on success

#### **Chat.vue**
- Displays all chat messages in real-time
- Shows username and timestamp for each message
- Different styling for sent vs received messages
- Message input with send button
- Auto-scroll to latest messages
- User info chip showing current logged-in user
- Logout button to clear session

#### **Stores (Pinia)**

**authStore**
- Manages current user state
- Initializes from localStorage on app load
- Handles user login/logout
- Manages loading and error states

**chatStore**
- Manages chat messages array
- Handles real-time subscriptions
- Manages loading and error states
- Unsubscribe cleanup on logout

#### **Services**

**firebase.ts**
- `createUser()` - Create new user account
- `getUserByUsername()` - Look up user by username
- `sendMessage()` - Send a new message
- `getMessages()` - Fetch all messages
- `subscribeToMessages()` - Real-time message listener

**session.ts**
- `saveSession()` - Save to localStorage
- `getSession()` - Retrieve from localStorage
- `clearSession()` - Delete on logout
- `hasSession()` - Check if valid session exists

### 4. **User Flow Diagram**

```
┌─────────────────────┐
│  Open Application   │
└──────────┬──────────┘
           │
           ▼
    ┌──────────────┐
    │ Check Device │
    │  Session?    │
    └──────┬───────┘
           │
     ┌─────┴─────┐
     │           │
    Yes          No
     │           │
     ▼           ▼
  ┌────┐    ┌──────────────┐
  │Chat│    │Register/Login│
  └────┘    └──────┬───────┘
              │
        ┌─────┴────────┐
        │              │
      New User    Existing User
        │              │
        ▼              ▼
    ┌────────┐    ┌────────┐
    │Register│    │ Login  │
    └────┬───┘    └───┬────┘
         │            │
         └──┬─────┬───┘
            │     │
            ▼     ▼
    ┌─────────────────┐
    │ Save Session    │
    │ (UUID + User)   │
    └────────┬────────┘
             │
             ▼
        ┌─────────┐
        │ Chat    │
        │ Page    │
        └────┬────┘
             │
        ┌────┴────────┐
        │             │
        ▼             ▼
    ┌────────┐    ┌────────┐
    │ Send   │    │ Logout │
    │Message │    │        │
    └────┬───┘    └───┬────┘
         │            │
         └────┬───┬───┘
              │   │
              ▼   ▼
        ┌─────────────┐
        │Firebase     │
        │(Realtime)   │
        └─────────────┘
```

### 5. **Features**

✅ **User Management**
- Easy registration with just username
- Simple login with username lookup
- Automatic session creation with UUID
- Session persistence across browser sessions

✅ **Real-time Chat**
- Send and receive messages instantly
- Firebase real-time listeners
- Message history preserved
- Auto-scroll to latest message

✅ **Session Management**
- localStorage-based session
- Automatic validation on app load
- Auto-redirect based on session state
- Clean logout with session clearing

✅ **User Experience**
- Responsive Material Design UI (Vuetify)
- Loading states during async operations
- Error handling with user-friendly messages
- Message timestamps and sender identification
- Message sent/received visual distinction

### 6. **How to Use**

#### Register
1. Visit the app
2. Click "Create Account" form
3. Enter a username (min 3 characters)
4. Click "Create Account"
5. Automatically logged in and redirected to chat

#### Login
1. Visit the app
2. Click "Login Instead" link
3. Enter your username
4. Click "Login"
5. Chat history loads automatically

#### Chat
1. Type message in input field
2. Click send button or press Enter
3. Message appears in chat instantly
4. All users see the same messages in real-time

#### Logout
1. Click logout button (top-right icon)
2. Session cleared
3. Redirected to login page

### 7. **Testing Checklist**

- [ ] First-time user registration works
- [ ] Username validation prevents duplicates
- [ ] Session saves to localStorage
- [ ] Refreshing page maintains session
- [ ] Login with existing username works
- [ ] Chat messages display correctly
- [ ] Real-time message updates from other users
- [ ] Message timestamps format correctly
- [ ] Logout clears session properly
- [ ] Auto-redirect works correctly
- [ ] Error messages display appropriately

### 8. **Firebase Configuration**

The Firebase config is already set up in `src/services/firebase.ts`:
```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCl7pE5FI-z_3sc4Lxpl4VhJjAlhoiSJlo",
  authDomain: "chitchut-2b9e2.firebaseapp.com",
  projectId: "chitchut-2b9e2",
  storageBucket: "chitchut-2b9e2.firebasestorage.app",
  messagingSenderId: "497752442910",
  appId: "1:497752442910:web:5de089fbcc4cc77bde460f"
};
```

**Required Firebase Firestore Rules:**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for all users
    match /users/{document=**} {
      allow read, write: if true;
    }
    match /messages/{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 9. **Environment Setup**

**Dependencies already installed:**
- `vue` - UI Framework
- `vuetify` - Material Design Components
- `pinia` - State Management
- `vue-router` - Client-side Routing
- `firebase` - Backend Services
- `uuid` - UUID Generation

**Run the project:**
```bash
npm install
npm run dev
```

## Summary

The chat application is now fully functional with:
- ✅ User registration and login
- ✅ Session management with localStorage
- ✅ Real-time chat with Firebase
- ✅ Message persistence
- ✅ Auto-redirect based on session state
- ✅ User-friendly UI with Vuetify
