import { useRef, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link } from "react-router-dom"
import '@/styles/auth/global.css'

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const { loading, error, resetPassword } = useAuth()
  const [message, setMessage] = useState<string>("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!emailRef.current) return

    setMessage("")
    await resetPassword(emailRef.current.value)
    setMessage("Check your inbox for further instructions")
  }

  return (
    <div className="login authCard">
      <div className='main'>
        <div className="header">
          <Link to="/">
            <img src="./logo.png" alt="HighPaws Logo" loading="lazy" width="80" height="80" decoding="async" />
          </Link>
          <h3>Password Reset</h3>
          <p>Enter your email to reset your password</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}
          {message && <p>{message}</p>}
          <label>
            Email:
            <input type="email" ref={emailRef} required />
          </label>
          <div className="actions">
            <button disabled={loading} type="submit" className="primary">Reset Password</button>
          </div>
          <p>Go back to <Link to="/login">Login Page</Link></p>
        </form>
      </div>
    </div>
  )
}