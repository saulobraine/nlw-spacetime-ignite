import { cookies } from 'next/headers'
import decode from 'jwt-decode'

interface User {
  sub: string
  name: string
  avatarUrl: string
}

export function getToken() {
  const token = cookies().get('token')?.value

  if (!token) {
    throw new Error('Unauthenticated.')
  }

  return token
}

export function isUserAuthenticated() {
  const isUserAuthenticated = cookies().has('token')

  return isUserAuthenticated
}

export function getUser(): User {
  const token = getToken()

  const user: User = decode(token)

  return user
}
