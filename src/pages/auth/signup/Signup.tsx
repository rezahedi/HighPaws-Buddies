import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth"
import { Link, useNavigate } from "react-router-dom"
import '@/styles/auth/global.css'
import { newProfileProp } from "@/types/firestore"
import { useMultiStepForm } from "@/utils"
import { Buddy, Owner } from "@/pages/auth/signup"

// TODO: Make Signup form multi-step registration, first with buddy info, then owner name, email/pass or google signup.

type DataProps = {
  name: string,
  gender: string,
  age: string,
  breed: string,
  weight: string,
  location: string,
  characteristcs: string[],
  owner: string,
  email: string,
  password: string,
  passwordConfirm: string,
}

const INITIAL_DATA: DataProps = {
  name: '',
  gender: '',
  age: '',
  breed: '',
  weight: '',
  location: '',
  characteristcs: [],
  owner: '',
  email: '',
  password: '',
  passwordConfirm: '',
}

export default function Signup() {

  const [data, setData] = useState(INITIAL_DATA)
  const {steps, currentStepIndex, step, previous, next, isFirstStep, isLastStep} = useMultiStepForm([
    <Buddy {...data} updateFields={updateFields} />,
    <Owner {...data} updateFields={updateFields} />,
  ]);
	const { profile, loading, error, signup, signupWithGoogle } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if( profile !== null )
      navigate( `/${profile.id}` )
  }, [profile])

  function updateFields(fields: Partial<DataProps>) {
    setData((prev) => ({...prev, ...fields}));
  }

  function resetForm() {
    setData(INITIAL_DATA);
  }

  async function signupWithEmailPassword( e: React.FormEvent<HTMLFormElement> )
  {
    e.preventDefault();

    if (!isLastStep)
      return next();

    if( !data.name || !data.breed || !data.owner ) return;

    // Signup with email and password
    if( !data.email || !data.password || data.password !== data.passwordConfirm )
      return;

    // TODO: Repeated code, should be in a function
    const newProfile: newProfileProp = {
      name: data.name,
      owner: data.owner,
      avatars: {
        buddy: '',
        owner: ''
      },
      gender: data.gender,
      age: data.age,
      breed: data.breed,
      weight: data.weight,
      location: data.location,
      characteristics: [],
      stats: {
        followers: 0,
        following: 0,
        posts: 0
      },
      public: true,
    }
    await signup(data.email, data.password, newProfile)
  }

  async function signupWithGoogleAccount( e: React.MouseEvent<HTMLButtonElement> ) {
    e.preventDefault();

    if( !data.name || !data.breed ) return;

    // TODO: Repeated code, should be in a function
    const newProfile: newProfileProp = {
      name: data.name,
      owner: data.owner,
      avatars: {
        buddy: '',
        owner: ''
      },
      gender: data.gender,
      age: data.age,
      breed: data.breed,
      weight: data.weight,
      location: data.location,
      characteristics: [],
      stats: {
        followers: 0,
        following: 0,
        posts: 0
      },
      public: true,
    }
    await signupWithGoogle(newProfile)
  }

  return (
    <div className="authCard signup">
      <div className="authMain">
        <div className="header">
          <Link to="/">
            <img src="./logo.png" alt="HighPaws Logo" loading="lazy" width="80" height="80" decoding="async" />
          </Link>
          <h3>Sign in to HighPaws</h3>
          <p>Start your journey with us</p>
        </div>
        <form onSubmit={signupWithEmailPassword}>
          <div className='step'>{currentStepIndex + 1} / {steps.length}</div>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {isLastStep &&
          <>
            <button onClick={signupWithGoogleAccount} disabled={loading} className="google primary">Sign Up With Google</button>
            <p>or</p>
          </>}
          {step}
          <div className='actions'>
            <button type='button' onClick={resetForm}>Reset</button>
            {!isFirstStep && <button type='button' onClick={previous}>Previous</button>}
            <button type='submit' className="primary">{!isLastStep ? `Next` : `Signup`}</button>
          </div>
          <p>Already have an account? <Link to="/login">Log In</Link></p>
        </form>
      </div>
      <div className="banner">
        <p>Photo by <a href="https://unsplash.com/@dynamicwang?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" target="_blank">Dynamic Wang</a></p>
      </div>
    </div>
  );
}