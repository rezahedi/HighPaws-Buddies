import { useAuth } from '@/providers/auth'
import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
	const emailRef = useRef<HTMLInputElement | null>(null)
	const passwordRef = useRef<HTMLInputElement | null>(null)
	const { profile, loading, error, login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // TODO: Navigate to callback/prev URL if available or to home
    if( profile !== null )
      navigate('/')
  }, [profile])

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
    if(!emailRef.current || !passwordRef.current) return;

    await login(emailRef.current.value, passwordRef.current.value)
	}

  return (
    <div className='login'>
      <h2>Log In</h2>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      <button onClick={loginWithGoogle} disabled={loading}>Sign In With Google</button>
      <p>or</p>
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
