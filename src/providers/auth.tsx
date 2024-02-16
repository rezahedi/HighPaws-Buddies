import { useState, useEffect, useContext, createContext } from "react"
import { auth } from "@/firebase"
import {
  User, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile
} from "firebase/auth"

const AuthContext = createContext(
  {} as {
    user: User | null
    loading: boolean
    error: string | null
    signup: (email: string, password: string, name: string) => Promise<User>
    login: (email: string, password: string) => Promise<User>
    logout: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
  }
)

export function useAuth()
{
  return useContext(AuthContext)
}

export default function AuthProvider({children}: {children: React.ReactNode})
{
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
  // TODO: Should I handle errors here? or in auth pages /src/pages/auth/*
  const [error, setError] = useState<string | null>(null)

  async function signup(email: string, password: string, name: string) {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    // if (auth.currentUser) {
    //   await updateProfile(auth.currentUser, { displayName: name });
    // }
    await updateProfile(res.user, { displayName: name });
    return res.user;
  }

  async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

	async function logout() {
		return await signOut(auth)
	}

	async function resetPassword(email: string) {
		const actionCodeSettings = {
			// URL to redirect to after a user has set the password.
			url: import.meta.env.VITE_BASE_COMPLETE_URL
		};
		return await sendPasswordResetEmail(auth, email, actionCodeSettings)
	}

  useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			setUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
