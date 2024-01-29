import { atom, useAtom } from "jotai"
import { useState, useEffect } from "react"

export const userAtom = atom(null)
export const theUserRead = atom(async (get) => get(userAtom))

export const theUser = atom(async (get) => {
  const response = await fetch("/api/user")
  const theUser = await response.json()
  console.log("jotai user data", theUser)
  return theUser.user
})

export function StartUp() {
  const [user, setUser] = useAtom(userAtom)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const theUser = await response.json()
        console.log("After checkUser in useEffect", theUser.user)
        setUser(theUser.user)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    console.log("checking user in StartUp")
    checkUser()
  }, [])
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  return null
}

