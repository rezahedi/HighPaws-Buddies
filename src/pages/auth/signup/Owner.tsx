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
      <label htmlFor='owner'>Owner Name:</label>
      <input id="owner" name="owner" type='text' value={owner} onChange={e=>updateFields({owner: e.target.value})} required />
      <label htmlFor='email'>Email:</label>
      <input id="email" name="email" type='email' value={email} onChange={e=>updateFields({email: e.target.value})} required />
      <label htmlFor='password'>Password:</label>
      <input id="password" name="password" type='text' value={password} onChange={e=>updateFields({password: e.target.value})} required />
      {!passwordStrength && <p className="text-red-500 text-xs italic">Password must be at least 6 characters</p>}
      <label htmlFor='passwordConfirm'>Password Confirmation:</label>
      <input id="passwordConfirm" name="passwordConfirm" type='text' value={passwordConfirm} onChange={e=>updateFields({passwordConfirm: e.target.value})} required />
      {!passwordMatch && <p className="text-red-500 text-xs italic">Passwords do not match</p>}
    </>
  )
}
