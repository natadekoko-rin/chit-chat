export interface User {
  id: string
  username: string
  animal: string
  createdAt: number
}

export interface Message {
  id: string
  userId: string
  username: string
  animal?: string
  content: string
  timestamp: number
}

export interface SessionData {
  username: string
  userId: string
  animal: string
}
