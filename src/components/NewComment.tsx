import { db } from '@/firebase';
import { newCommentProp } from '@/types/firestore';
import { collection, doc, addDoc, Timestamp, updateDoc, increment } from 'firebase/firestore';
import '@/styles/NewComment.css'
import { useRef } from 'react'


export default function NewComment({postId}: {postId: string}) {
  const formRef = useRef<HTMLFormElement>(null)

  // TODO: Get user id from auth context
  const user = {
    id:     '8gx3nLgpa75dVxo8q6dy',
    avatar: 'https://fakeimg.pl/50x50/FFD3E0?text=Max',
    name:   'Bjorn'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: Sanitize data
    const formData: FormData = new FormData(e.currentTarget)

    const newComment: newCommentProp = {
      comment: formData.get('comment') as string,
      profile: {
        avatar: user.avatar,
        name: user.name,
        id: doc(db, `profiles/${user.id}`)
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
        <img src={user.avatar} alt={user.name} />
        {user.name}
      </div>
      <textarea name="comment" placeholder="Write your comment ..."></textarea>
      <button type="submit">Post</button>
    </form>
  )
}
