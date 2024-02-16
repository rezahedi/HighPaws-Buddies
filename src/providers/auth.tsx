import { useState, useEffect, useContext, createContext } from "react"
import { auth, db } from "@/firebase"
import {
  User, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut
} from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { returnProfileProp, profileProp, newProfileProp } from "@/types/firestore"

const AuthContext = createContext(
  {} as {
    authUser: User | null
    profile: profileProp | null
    loading: boolean
    error: string | null
    signup: (email: string, password: string, profile: newProfileProp) => Promise<User>
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
  console.log('auth.currentUser:', auth.currentUser)
	const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<profileProp | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
  // TODO: Should I handle errors here? or in auth pages /src/pages/auth/*
  const [error, setError] = useState<string | null>(null)

  async function signup(email: string, password: string, profile: newProfileProp) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    // TODO: Using .then() to handle create profile document promise
    // TODO: Error catch!
    // Create profile document
    const profileRef = doc(db, 'profiles', userCredential.user.uid)
    profile.owner = userCredential.user.displayName || ''
    profile.avatars.owner = userCredential.user.photoURL || `https://fakeimg.pl/400x400/282828/?text=${profile.owner}`
    await setDoc(profileRef, profile)

    // if (auth.currentUser) {
    //   await updateProfile(auth.currentUser, { displayName: name });
    // }
    // await updateProfile(userCredential.user, { displayName: name });
    return userCredential.user;
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
		const unsubscribe = auth.onAuthStateChanged(async user => {

      // User is signed in
      if ( user) {
        // Get user profile
        const profileRef = doc(db, 'profiles', user.uid)
        const profileSnap = await getDoc(profileRef)
        if ( profileSnap.exists() ) {
          setProfile( returnProfileProp(profileSnap) )
          setAuthUser(user)
        } else {
          setError("No such Profile!")
        }
        
      // User is signed out
      } else {
        setAuthUser(null)
        setProfile(null)
      }

			setLoading(false)
		})

		return unsubscribe
	}, [])

  const value = {
    authUser,
    profile,
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
