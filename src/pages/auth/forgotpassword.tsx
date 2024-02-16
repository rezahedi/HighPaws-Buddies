import { useRef, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link } from "react-router-dom"
import { AuthError } from "firebase/auth"

export default function ForgotPassword() {
  const emailRef = useRef<HTMLInputElement | null>(null)
  const { resetPassword } = useAuth()
  const [error, setError] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!emailRef.current) return

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch (e) {
      const error = e as AuthError;
      // TODO: Handle error codes and display user-friendly error messages
      setError(error.code);
			console.error(error.code)
    }

    setLoading(false)
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