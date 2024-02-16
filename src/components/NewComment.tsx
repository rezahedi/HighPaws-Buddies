import { db } from '@/firebase';
import { newCommentProp } from '@/types/firestore';
import { collection, doc, addDoc, Timestamp, updateDoc, increment } from 'firebase/firestore';
import '@/styles/NewComment.css'
import { useRef } from 'react'
import { useAuth } from '@/providers/auth';

export default function NewComment({postId}: {postId: string}) {
  const formRef = useRef<HTMLFormElement>(null)

  // TODO: Add comments only to public posts or to following only!
  const { profile } = useAuth()
  if(!profile) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: Sanitize data
    const formData: FormData = new FormData(e.currentTarget)

    const newComment: newCommentProp = {
      comment: formData.get('comment') as string,
      profile: {
        avatar: profile.avatars.buddy,
        name: profile.name,
        id: doc(db, `profiles/${profile.id}`)
      },
      created_at: Timestamp.fromDate( new Date() )
    }

    const docRef = await addDoc(collection(db, `posts/${postId}/comments`), newComment)

    if( !docRef.id ) {
      // TODO: Handle error show toast message to try agaim!
      return console.error('Error adding document: ', docRef.id)
    }

    // TODO: if comment added or removed, +1 or -1 to post.stats.comments count
    // TODO: +1 or -1 is easier to do on the cloud function that listens to the comments collection for add or remove doc
    const postRef = doc(db, `posts/${postId}`)
    await updateDoc(postRef, { "stats.comments": increment(1) })

    formRef.current!.reset()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} ref={formRef}>
      <div>
        <img src={profile.avatars.buddy} alt={profile.name} />
        {profile.name}
      </div>
      <textarea name="comment" placeholder="Write your comment ..."></textarea>
      <button type="submit">Post</button>
    </form>
  )
}
