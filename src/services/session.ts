import type { SessionData } from '@/types'

const SESSION_KEY = 'ygpw_session'

export function saveSession(session: SessionData): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getSession(): SessionData | null {
  const session = localStorage.getItem(SESSION_KEY)
  if (!session) return null
  try {
    return JSON.parse(session) as SessionData
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

export function hasSession(): boolean {
  return getSession() !== null
}
