// TODO: Create api endpoint to create a new post
// TODO: Handle file upload to CDN on the server
// TODO: Data validation
import { NewPost } from "@/components"
import '@/styles/New.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { Header } from "@/components"
import { useEffect } from "react"

export default function New() {

  const navigate = useNavigate()
  const { profile } = useAuth()

  useEffect(() => {
    if( profile === null ) return navigate('/login')
  }, [profile])

  if( profile === null ) return null

  return (
    <>
      <Header />
      <NewPost />
    </>
  )
}
