import { useAuth } from '@/providers/auth'
import { useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '@/styles/auth/global.css'

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
    <div className='login authCard'>
      <div className='authMain'>
        <div className="header">
          <Link to="/">
            <img src="./logo.png" alt="HighPaws Logo" loading="lazy" width="80" height="80" decoding="async" />
          </Link>
          <h3>Login to HighPaws</h3>
          <p>Check out what your friends are up to</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          {loading && <p>Loading...</p>}
          <button onClick={loginWithGoogle} disabled={loading} className='google primary'>Sign In With Google</button>
          <p>or</p>
          <label>
            Email:
            <input type='email' ref={emailRef} required />
          </label>
          <label>
            Password:
            <input type='password' ref={passwordRef} required />
          </label>
          <div className='actions'>
            <Link to="/forgot-password">Forgot Password?</Link>
            <button disabled={loading} type='submit' className='primary'>Log In</button>
          </div>
          <p>Need an account? <Link to="/signup">Sign Up</Link></p>
        </form>
      </div>
    </div>
  )
}
