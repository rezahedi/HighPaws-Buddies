import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link, useNavigate } from "react-router-dom"
import '@/styles/auth/signup.css'
import { newProfileProp } from "@/types/firestore"

// TODO: Make Signup form multi-step registration, first with buddy info, then owner name, email/pass or google signup.

export default function Signup() {
  const ownerNameRef = useRef<HTMLInputElement | null>(null)
  const buddyNameRef = useRef<HTMLInputElement | null>(null)
  const ageRef = useRef<HTMLInputElement | null>(null)
  const genderRef = useRef<HTMLSelectElement | null>(null)
  const breedRef = useRef<HTMLInputElement | null>(null)
  const weightRef = useRef<HTMLInputElement | null>(null)
  const locationRef = useRef<HTMLInputElement | null>(null)
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)
	const passwordConfirmRef = useRef<HTMLInputElement | null>(null)
	const { profile, loading, error, signup, signupWithGoogle } = useAuth()
	const [errorMessage, setErrorMessage] = useState<string>("")
  const navigate = useNavigate()

  useEffect(() => {
    if( profile !== null )
      navigate( `/${profile.id}` )
  }, [profile])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
    if(!emailRef.current || !passwordRef.current || !passwordConfirmRef.current || !ownerNameRef.current || !buddyNameRef.current
      || !genderRef.current || !ageRef.current || !breedRef.current || !weightRef.current || !locationRef.current) return;

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setErrorMessage("Passwords do not match")
		}

    // TODO: Repeated code, should be in a function
    const newProfile: newProfileProp = {
      name: buddyNameRef.current.value,
      owner: ownerNameRef.current.value,
      avatars: {
        buddy: `https://fakeimg.pl/400x400/282828/?text=${buddyNameRef.current.value}`,
        owner: ''
      },
      gender: genderRef.current.value,
      age: ageRef.current.value,
      breed: breedRef.current.value,
      weight: weightRef.current.value,
      location: locationRef.current.value,
      characteristics: [],
      stats: {
        followers: 0,
        following: 0,
        posts: 0
      },
      public: false,
    }
    await signup(emailRef.current.value, passwordRef.current.value, newProfile)
	}

  async function handleSignupWithGoogle() {
    if( !ownerNameRef.current || !buddyNameRef.current || !genderRef.current || !ageRef.current || !breedRef.current || !weightRef.current || !locationRef.current) return;

    // TODO: Repeated code, should be in a function
    const newProfile: newProfileProp = {
      name: buddyNameRef.current.value,
      owner: ownerNameRef.current.value,
      avatars: {
        buddy: `https://fakeimg.pl/400x400/282828/?text=${buddyNameRef.current.value}`,
        owner: ''
      },
      gender: genderRef.current.value,
      age: ageRef.current.value,
      breed: breedRef.current.value,
      weight: weightRef.current.value,
      location: locationRef.current.value,
      characteristics: [],
      stats: {
        followers: 0,
        following: 0,
        posts: 0
      },
      public: false,
    }
    await signupWithGoogle(newProfile)
  }

  return (
    <form onSubmit={handleSubmit} className="signup">
      <h2>Sign Up</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {errorMessage && <p>{errorMessage}</p>}
      <button onClick={handleSignupWithGoogle} disabled={loading}>Sign Up With Google</button>
      <p>or</p>
      <label>
        Buddy Name
        <input type="text" ref={buddyNameRef} />
      </label>
      <label>
        Age
        <input type="text" placeholder="6 months" ref={ageRef} />
      </label>
      <label>
        Gender
        <select ref={genderRef}>
          <option value='Unknown'>Unknown</option>
          <option value='male'>Male</option>
          <option value='Female'>Female</option>
        </select>
      </label>
      <label>
        Breed
        <input type="text" placeholder="Shiba Inu" ref={breedRef} />
      </label>
      <label>
        Weight
        <input type="text" placeholder="5 pounds" ref={weightRef} />
      </label>
      <label>
        Location
        <input type="text" placeholder="Oakland" ref={locationRef} />
      </label>
      <label>
        Owner Name
        <input type="text" ref={ownerNameRef} />
      </label>
      <label>
        Email
        <input type="email" ref={emailRef} required />
      </label>
      <label>
        Password
        <input type="password" ref={passwordRef} required />
      </label>
      <label>
        Password Confirmation
        <input type="password" ref={passwordConfirmRef} required />
      </label>
      <button disabled={loading} type="submit">
        Sign Up
      </button>
      <div>
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </form>
	)
}