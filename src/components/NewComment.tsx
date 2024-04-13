import { db } from '@/firebase';
import { newCommentProp } from '@/types/firestore';
import { collection, doc, addDoc, Timestamp } from 'firebase/firestore';
import { useRef } from 'react'
import { useAuth } from '@/providers/auth';

export default function NewComment({postId, profileId}: {postId: string, profileId: string}) {
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
      profile_id: doc(db, `profiles/${profile.id}`),
      avatar: profile.avatars.buddy,
      name: profile.name,
      created_at: Timestamp.fromDate( new Date() )
    }

    const docRef = await addDoc(collection(db, `profiles/${profileId}/posts/${postId}/comments`), newComment)

    if( !docRef.id ) {
      // TODO: Handle error show toast message to try agaim!
      return console.error('Error adding document: ', docRef.id)
    }

    formRef.current!.reset()
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      ref={formRef}
      className='flex items-stretch justify-center gap-3 my-3 text-sm'
    >
      <img
        src={profile.avatars.buddy} alt={profile.name}
        className='rounded-full size-9'
      />
      <textarea
        name="comment" maxLength={500} rows={1} required placeholder="Write your comment ..."
        className='flex-grow p-2 rounded-md border border-gray-300 resize-none w-max resize-y'
      ></textarea>
      <button type="submit" className='text-gray-500'>Comment</button>
    </form>
  )
}
