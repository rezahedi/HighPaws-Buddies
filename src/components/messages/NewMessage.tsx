import { db } from '@/firebase';
import { messageProp } from '@/types/firestore';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRef } from 'react'
import { useAuth } from '@/providers/auth';

export default function NewMessage({conversationId, profileId}: {conversationId: string, profileId: string}) {
  const formRef = useRef<HTMLFormElement>(null)

  // TODO: Add comments only to public posts or to following only!
  const { profile } = useAuth()
  if(!profile) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // TODO: Sanitize data
    const formData: FormData = new FormData(e.currentTarget)

    const newMessage: messageProp = {
      message: formData.get('message') as string,
      direction: 'out',
      published_at: Timestamp.fromDate( new Date() ),
      seen: true,
    }

    const docRef = await addDoc(collection(db, `profiles/${profileId}/conversations/${conversationId}/messages`), newMessage)

    if( !docRef.id ) {
      // TODO: Handle error show toast message to try again!
      return console.error('Error adding document: ', docRef.id)
    }

    formRef.current!.reset()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} ref={formRef} className='flex items-center gap-2 text-sm m-2'>
      <img src={profile.avatars.buddy} alt={profile.name} className='rounded-full size-9' />
      <input name="message" maxLength={500} required placeholder="Write your message ..." className='flex-1 p-2 border rounded-md border-gray-300 resize-y' />
      <button type="submit">Send</button>
    </form>
  )
}
