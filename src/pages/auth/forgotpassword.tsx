import { useRef, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link } from "react-router-dom"

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
    <div>
      <h2>Password Reset</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" ref={emailRef} required />
        </label>
        <button disabled={loading} type="submit">
          Reset Password
        </button>
      </form>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  )
}