// TODO: Create api endpoint to create a new post
// TODO: Handle file upload to CDN on the server
// TODO: Data validation

import { newPostProp } from "@/types/firestore"
import { doc, addDoc, collection, Timestamp } from 'firebase/firestore'
import { db, storage } from '@/firebase'
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage'
import '@/styles/New.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { Header } from "@/components"
import { useEffect, useState, useCallback } from "react"

export default function New() {

  const navigate = useNavigate()
  const { profile } = useAuth()
  const [image, setImage] = useState<{name: string, blob: string} | undefined>()
  const maxSize2MB = 2097152

  useEffect(() => {
    if( profile === null ) return navigate('/login')
  }, [profile])

  useEffect(() => {
    console.log("image:", image)
  }, [image])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if( profile === null ) return null

    const formData: FormData = new FormData(e.currentTarget)
    let imageURL = ''

    // TODO: Handle image resize and compression in the client

    // Handle image upload to Firebase Storage
    if ( image !== undefined ){
      // TODO: Upload image blob `image` to Firebase Storage with a randon hash as filename
      const storageRef = ref(storage, 'images/' + image.name)
      // const snapshot = await uploadBytes(storageRef, Buffer.from(image.blob))
      const snapshot = await uploadString(storageRef, image.blob, 'data_url')
      
      await getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
        imageURL = downloadURL
      });
    }

    // TODO: Sanitize data
    const newPost: newPostProp = {
      title: formData.get('title') as string,
      media_url: imageURL,
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
      liked: false,
      private: false
    }

    const docRef = await addDoc(collection(db, `profiles/${profile.id}/posts`), newPost)
    console.log( "post created:", docRef )
    navigate('/')
  }

  const onDrop = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const acceptedFiles = e.target.files

    if(acceptedFiles && acceptedFiles.length > 0) {
      let file = acceptedFiles[0]
      if( !file ) return

      if ( file.size > maxSize2MB ) {
        console.error("File size too big (max 2MB)");
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImage({
            name: file.name,
            blob: event.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }, [])

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
          <div>File Upload:</div>
          <input type="file" onChange={(e) => onDrop(e)} />
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
