// TODO: Create api endpoint to create a new post
// TODO: Handle file upload to CDN on the server
// TODO: Data validation

import { postProp } from "@/types/firestore"
import { getFirestore, doc, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { app } from '@/firebase'
import '@/styles/New.css'
import { redirect } from 'react-router-dom'

const db = getFirestore(app);

export default function New() {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData: FormData = new FormData(e.currentTarget)
    const newPost: postProp = {
      id: '',
      title: formData.get('title') as string,
      media_url: formData.get('media_url') as string,
      location: formData.get('location') as string,
      profile_detail: {
        avatar_url: formData.get('profile_detail_avatar') as string,
        name: formData.get('profile_detail_name') as string
      },
      profile_id: doc(db, formData.get('profile_id') as string),
      published_at: Date.now(),
      stats: {
        likes: parseInt(formData.get('stats_likes') as string),
        comments: parseInt(formData.get('stats_comments') as string)
      },
      private: false
    }
    console.log( newPost )

    const docRef = await addDoc(collection(db, 'posts'), {
      ...newPost,
      published_at: serverTimestamp()
    })
    console.log( "post created:", docRef )
    redirect('/')
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="newpost">
      <label>
        <div>Title:</div>
        <input name="title" type="text" placeholder="Title" />
      </label>
      <label>
        <div>Media URL:</div>
        <input name="media_url" type="text" defaultValue="https://fakeimg.pl/400x250/C4B8E4?text=Max" />
      </label>
      <label>
        <div>Location:</div>
        <input name="location" type="text" placeholder="Location" />
      </label>
      <label>
        <div>Profile Detail Avatar URL:</div>
        <input name="profile_detail_avatar" type="text" defaultValue="https://fakeimg.pl/50x50/FFD3E0?text=Max" />
      </label>
      <label>
        <div>Profile Detail Name:</div>
        <input name="profile_detail_name" type="text" placeholder="Name" />
      </label>
      <label>
        <div>Profile ID:</div>
        <input name="profile_id" type="text" placeholder="/profiles/xyz" />
      </label>
      <div>
        <div>Bjorn: /profiles/8gx3nLgpa75dVxo8q6dy</div>
        <div>Max: /profiles/iYg91wGJlbQQpoQGn6Ys</div>
      </div>
      <label>
        <div>Stats Likes:</div>
        <input name="stats_likes" type="text" defaultValue={0} />
      </label>
      <label>
        <div>Stats Comments:</div>
        <input name="stats_comments" type="text" defaultValue={0} />
      </label>

      <button type="submit">Submit</button>
    </form>
  )
}
