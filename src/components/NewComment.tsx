import { app } from '@/firebase';
import { commentProp } from '@/types/firestore';
import { getFirestore, collection, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import '@/styles/NewComment.css'

const db = getFirestore(app);


export default function NewComment({postId}: {postId: string}) {

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

    const newComment: commentProp = {
      id: '',
      comment: formData.get('comment') as string,
      profile: {
        avatar: user.avatar,
        name: user.name,
        id: doc(db, `profiles/${user.id}`)
      },
      created_at: 0,
    }

    const docRef = await addDoc(collection(db, `posts/${postId}/comments`), {
      ...newComment,
      created_at: serverTimestamp()
    })

    // TODO: if added +1 to post.stats.comments count
    // +1 could be done here or in the cloud function that listens to the comments collection

    if( !docRef.id ) {
      // TODO: Handle error show toast message to try agaim!
      return console.error('Error adding document: ', docRef.id)
    }
    
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div>
        <img src={user.avatar} alt={user.name} />
        {user.name}
      </div>
      <textarea name="comment" placeholder="Write your comment ..."></textarea>
      <button type="submit">Post</button>
    </form>
  )
}
