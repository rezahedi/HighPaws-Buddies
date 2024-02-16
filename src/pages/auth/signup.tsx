import { useRef, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link, useNavigate } from "react-router-dom"
import { db } from "@/firebase"
import { setDoc, doc } from "firebase/firestore"
import { AuthError, /*AuthErrorCodes*/ } from "firebase/auth"
import '@/styles/auth/signup.css'

export default function Signup() {
  const ownerNameRef = useRef<HTMLInputElement | null>(null)
  const buddyNameRef = useRef<HTMLInputElement | null>(null)
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)
	const passwordConfirmRef = useRef<HTMLInputElement | null>(null)
	const { signup } = useAuth()
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
    if(!emailRef.current || !passwordRef.current || !passwordConfirmRef.current || !ownerNameRef.current || !buddyNameRef.current) return;

		if (passwordRef.current.value !== passwordConfirmRef.current.value) {
			return setError("Passwords do not match")
		}

		try {
			setError("")
			setLoading(true)
			const user = await signup(emailRef.current.value, passwordRef.current.value, ownerNameRef.current.value)
			await setDoc(doc(db, "users", user.uid), {
				name: ownerNameRef.current.value,
        buddy: buddyNameRef.current.value,
				authProvider: "local",
				email: user.email,
				rule:'new'
			});
			navigate("/")


} catch (e) {
  const error = e as AuthError;
  // TODO: Handle error codes and display user-friendly error messages
  // error.code === AuthErrorCodes.EMAIL_EXISTS && setError("Email already exists")
  setError(error.code);
  console.error(error.code);
}

setLoading(false);
	}

  return (
    <form onSubmit={handleSubmit} className="signup">
      <h2>Sign Up</h2>
      {error && <p>{error}</p>}
      <label>
        Buddy Name
        <input type="text" ref={buddyNameRef} />
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