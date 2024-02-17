// TODO: Create api endpoint to create a new post
// TODO: Handle file upload to CDN on the server
// TODO: Data validation

import { newPostProp } from "@/types/firestore"
import { doc, addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '@/firebase'
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if( profile === null ) return null

    // TODO: Sanitize data
    const formData: FormData = new FormData(e.currentTarget)
    const newPost: newPostProp = {
      title: formData.get('title') as string,
      media_url: formData.get('media_url') as string,
      location: formData.get('location') as string,
      profile_detail: {
        avatar_url: profile.avatars.buddy ?? '',
        name: profile.name ?? ''
      },
      profile_id: doc(db, `profile/${profile.id}`),
      published_at: Timestamp.fromDate( new Date() ),
      stats: {
        likes: 0,
        comments: 0
      },
      private: false
    }

    const docRef = await addDoc(collection(db, 'posts'), newPost)
    console.log( "post created:", docRef )
    navigate('/')
  }

  return (
    <>
      <Header />
      {profile &&
      <form onSubmit={(e) => handleSubmit(e)} className="newpost">
        <label>
          <div>Title:</div>
          <input name="title" type="text" placeholder="Title" />
        </label>
        <label>
          <div>Media URL:</div>
          <input name="media_url" type="text" defaultValue={`https://fakeimg.pl/400x250/C4B8E4?text=${profile.name}`} />
        </label>
        <label>
          <div>Location:</div>
          <input name="location" type="text" placeholder="Location" />
        </label>
        <button type="submit">Submit</button>
      </form>}
    </>
  )
}
