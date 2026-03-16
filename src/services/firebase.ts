import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import type { User, Message } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { getRandomAnimal } from '@/utils/animals'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl7pE5FI-z_3sc4Lxpl4VhJjAlhoiSJlo",
  authDomain: "chitchut-2b9e2.firebaseapp.com",
  projectId: "chitchut-2b9e2",
  storageBucket: "chitchut-2b9e2.firebasestorage.app",
  messagingSenderId: "497752442910",
  appId: "1:497752442910:web:5de089fbcc4cc77bde460f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

// Users Collection Functions
export async function createUser(username: string, selectedAnimal?: string): Promise<User> {
  const userId = uuidv4()
  const newUser: User = {
    id: userId,
    username,
    animal: selectedAnimal || getRandomAnimal(),
    createdAt: Date.now(),
  }

  try {
    await addDoc(collection(db, 'users'), newUser)
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export async function updateUserUuid(userId: string, username: string): Promise<User> {
  try {
    // Find the document with this userId
    const q = query(collection(db, 'users'), where('id', '==', userId))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      // If not found by id, search by username
      const q2 = query(collection(db, 'users'), where('username', '==', username))
      const querySnapshot2 = await getDocs(q2)
      
      if (querySnapshot2.empty) {
        throw new Error('User not found')
      }
      
      const doc = querySnapshot2.docs[0]
      const userData = doc.data() as User
      return userData
    }

    const doc = querySnapshot.docs[0]
    const userData = doc.data() as User
    return userData
  } catch (error) {
    console.error('Error updating user UUID:', error)
    throw error
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return null
    }

    const doc = querySnapshot.docs[0]
    return doc.data() as User
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

export async function deleteUserByUsername(username: string): Promise<void> {
  try {
    const q = query(collection(db, 'users'), where('username', '==', username))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.warn('User not found for deletion:', username)
      return
    }

    const docRef = querySnapshot.docs[0].ref
    await deleteDoc(docRef)
    console.log('User deleted:', username)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

// Messages Collection Functions
export async function sendMessage(
  userId: string,
  username: string,
  animal: string,
  content: string
): Promise<Message> {
  const newMessage: Message = {
    id: uuidv4(),
    userId,
    username,
    animal,
    content,
    timestamp: Date.now(),
  }

  try {
    await addDoc(collection(db, 'messages'), newMessage)
    return newMessage
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

export async function getMessages(): Promise<Message[]> {
  try {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as Message)
  } catch (error) {
    console.error('Error getting messages:', error)
    throw error
  }
}

export function subscribeToMessages(callback: (messages: Message[]) => void): () => void {
  try {
    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'asc'),
      limit(100)
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => doc.data() as Message)
      callback(messages)
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to messages:', error)
    throw error
  }
}

// Users Collection Functions for counting
export async function getUsers(): Promise<User[]> {
  try {
    const q = query(collection(db, 'users'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data() as User)
  } catch (error) {
    console.error('Error getting users:', error)
    throw error
  }
}

export function subscribeToUsers(callback: (users: User[]) => void): () => void {
  try {
    const q = query(collection(db, 'users'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const users = querySnapshot.docs.map((doc) => doc.data() as User)
      callback(users)
    })

    return unsubscribe
  } catch (error) {
    console.error('Error subscribing to users:', error)
    throw error
  }
}
