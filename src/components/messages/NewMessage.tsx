import { db } from '@/firebase';
import { messageProp } from '@/types/firestore';
import { collection, doc, addDoc, Timestamp, getDoc, setDoc } from 'firebase/firestore';
import { useRef } from 'react'
import { useAuth } from '@/providers/auth';
import { toast } from 'sonner';

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
    formRef.current!.reset()
    formRef.current!.querySelector('input')?.focus()

    const conversationRef = doc(db, `profiles/${profileId}/conversations/${conversationId}`)
    const res = await getDoc(conversationRef)
    if( !res.exists() ) {

      // get with profile data
      const withProfileRef = doc(db, `profiles/${conversationId}`)
      const withProfile = await getDoc(withProfileRef)
      if( !withProfile.exists() )
        return toast.error('User does not exist!')

      // create conversation doc
      setDoc(conversationRef, {
        with: {
          id: withProfileRef,
          name: withProfile.data().name,
          avatar: withProfile.data().avatars.buddy
        },
        last_message: newMessage.message,
        new_messages: 0,
        archived: false,
        published_at: Timestamp.fromDate( new Date() ),
        modified_at: Timestamp.fromDate( new Date() )
      })
      
      setDoc(doc(db, `profiles/${conversationId}/conversations/${profileId}`), {
        with: {
          id: profile.id,
          name: profile.name,
          avatar: profile.avatars.buddy
        },
        last_message: newMessage.message,
        new_messages: 1,
        archived: false,
        published_at: Timestamp.fromDate( new Date() ),
        modified_at: Timestamp.fromDate( new Date() )
      })
    }
    const docRef = await addDoc(collection(db, `profiles/${profileId}/conversations/${conversationId}/messages`), newMessage)

    if( !docRef.id )
      return toast.error('Issue with sending message, try again!')
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} ref={formRef} className='flex items-center gap-2 text-sm p-3'>
      <img src={profile.avatars.buddy} alt={profile.name} className='rounded-full size-9' />
      <input name='message' maxLength={500} required autoComplete='off' placeholder='Write your message ...' className='flex-1 p-2 border rounded-md border-gray-300 resize-y' />
      <button type="submit">Send</button>
    </form>
  )
}
