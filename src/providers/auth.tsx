import { useState, useEffect, useContext, createContext } from "react"
import { auth, db } from "@/firebase"
import {
  User, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut,
  GoogleAuthProvider, signInWithPopup, AuthError
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { returnProfileProp, profileProp, newProfileProp } from "@/types/firestore"
import { createProfile } from "@/providers/utils"

const AuthContext = createContext(
  {} as {
    authUser: User | null
    profile: profileProp | null
    loading: boolean
    error: string | null
    signup: (email: string, password: string, profile: newProfileProp) => Promise<boolean>
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    signupWithGoogle: (profile: newProfileProp) => Promise<boolean>
    loginWithGoogle: () => Promise<boolean>
  }
)

export function useAuth()
{
  return useContext(AuthContext)
}

export default function AuthProvider({children}: {children: React.ReactNode})
{
	const [authUser, setAuthUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<profileProp | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
  // TODO: Should I handle errors here? or in auth pages /src/pages/auth/*
  const [error, setError] = useState<string | null>(null)

  async function signupWithGoogle(profileData: newProfileProp) {
    setLoading(true)
    setError(null)

    let result = true;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).then(async (userCredential) => {

      // Create Profile (include uploading avatars and profile document)
      await createProfile(userCredential, profileData)
        .catch((errorMessage: string) => {
          setError(errorMessage)
          result = false
        })

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      result = false;
    })

    setLoading(false)
    return result;
  }

  async function signup(email: string, password: string, profileData: newProfileProp) {
    setLoading(true)
    setError(null)

    let result = true;
    await createUserWithEmailAndPassword(auth, email, password).then( async (userCredential) => {

      // Create Profile (include uploading avatars and profile document)
      await createProfile(userCredential, profileData)
        .catch((errorMessage: string) => {
          setError(errorMessage)
          result = false
        })

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      result = false;
    })

    setLoading(false)
    return result;
  }

  async function loginWithGoogle() {
    setLoading(true)
    setError(null)

    let result = true;
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider).then(async (userCredential) => {

      // TODO: This part is duplicated
      const profileRef = doc(db, 'profiles', userCredential.user.uid)
      const profileSnap = await getDoc(profileRef)
      if ( profileSnap.exists() ) {
        setProfile( returnProfileProp(profileSnap) )
        setAuthUser( userCredential.user )
      } else {
        result = false
        setError("No such Profile, Please sign up first!")
      }

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      result = false;
    })

    setLoading(false)
    return result
  }

  async function login(email: string, password: string) {
    setLoading(true)
    setError(null)

    let result = true;
    await signInWithEmailAndPassword(auth, email, password).then( async (userCredential) => {

      // TODO: This part is duplicated
      const profileRef = doc(db, 'profiles', userCredential.user.uid)
      const profileSnap = await getDoc(profileRef)
      if ( profileSnap.exists() ) {
        setProfile( returnProfileProp(profileSnap) )
        setAuthUser( userCredential.user )
      } else {
        result = false
        setError("No such Profile, Please sign up first!")
      }

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      result = false
    })
    
    setLoading(false)
    return result
  }

	async function logout() {
    setLoading(true)
    setError(null)

		return await signOut(auth).then(() => {
      setAuthUser(null)
      setProfile(null)
      setLoading(false)

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      setLoading(false)
    })
	}

	async function resetPassword(email: string) {
    setLoading(true)
    setError(null)

		const actionCodeSettings = {
			// URL to redirect to after a user has set the password.
			url: import.meta.env.VITE_BASE_COMPLETE_URL + '/login',
		};
		return await sendPasswordResetEmail(auth, email, actionCodeSettings).then(() => {
      setLoading(false)

    }).catch((e) => {
      const error = e as AuthError;
      setError(error.code)
      setLoading(false)
    })
	}

  useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {

      // User is signed in
      if ( user ) {
        // Get user profile
        const profileRef = doc(db, 'profiles', user.uid)
        const profileSnap = await getDoc(profileRef)
        if ( profileSnap.exists() ) {
          setProfile( returnProfileProp(profileSnap) )
          setAuthUser(user)
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

  useEffect(() => {
    if( profile !== null )
      setError(null)
  }, [profile])

  const value = {
    authUser,
    profile,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    signupWithGoogle,
    loginWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
