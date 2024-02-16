import { useAuth } from '@/providers/auth'
import { useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthError } from "firebase/auth"

export default function Login() {
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)
	const { login } = useAuth()
	const [error, setError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
    if(!emailRef.current || !passwordRef.current) return;

		try {
			setError("")
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value)
			navigate("/")
		} catch (e) {
      const error = e as AuthError;
      // TODO: Handle error codes and display user-friendly error messages
      setError(error.code);
			console.error(error.code)
		}

		setLoading(false)
	}

  return (
    <div className='login'>
      <h2>Log In</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type='email' ref={emailRef} required />
        </label>
        <label>
          Password
          <input type='password' ref={passwordRef} required />
        </label>
        <button disabled={loading} type='submit'>
          Log In
        </button>
      </form>
      <Link to="/forgot-password">Forgot Password?</Link>
			<div>
				Need an account? <Link to="/signup">Sign Up</Link>
			</div>
    </div>
  )
}
