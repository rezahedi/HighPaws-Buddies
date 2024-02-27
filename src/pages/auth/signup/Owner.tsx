import { useState, useEffect } from "react"

type Props = {
  owner: string,
  email: string,
  password: string,
  passwordConfirm: string,
  updateFields: (fields: Partial<Props>) => void,
}


export default function Owner(
  { owner, email, password, passwordConfirm, updateFields }: Props
) {

  const [passwordStrength, setPasswordStrength] = useState<boolean>(true)
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true)

  const handlePasswordChange = (
    field: Partial<Props>
  ) => {

    updateFields(field)
  }

  useEffect(() => {
    // Check password strength
    if(password.length == 0)
      setPasswordStrength(true)
    else if (password.length < 6) {
      setPasswordStrength(false)
    } else {
      setPasswordStrength(true)
    }

    // Check password confirmation
    if(passwordConfirm === password)
      setPasswordMatch(true)
    else
      setPasswordMatch(false)
  }, [password, passwordConfirm])

  return (
    <>
      <label>
        Owner Name (required):
        <input name="owner" type='text' value={owner} onChange={e=>updateFields({owner: e.target.value})} required />
      </label>
      <label>
        Email (required):
        <input name="email" type='email' value={email} onChange={e=>updateFields({email: e.target.value})} required />
      </label>
      <label>
        Password (required):
        <input name="password" type='password' value={password} onChange={e=>updateFields({password: e.target.value})} required />
        {!passwordStrength && <p className="error">Password must be at least 6 characters</p>}
      </label>
      <label>
        Confirm Password:
        <input name="passwordConfirm" type='password' value={passwordConfirm} onChange={e=>updateFields({passwordConfirm: e.target.value})} required />
        {!passwordMatch && <p className="error">Passwords do not match</p>}
      </label>
    </>
  )
}
