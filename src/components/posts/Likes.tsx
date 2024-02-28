import { postProp } from '@/types/firestore'
import { useEffect, useState } from 'react'
import { db } from "@/firebase"
import { onSnapshot, query, collection, limit, DocumentReference } from "firebase/firestore"
import Modal from '@/components/Modal'
import { Link } from 'react-router-dom'

type likeProp = {
  id: DocumentReference,
  name: string,
  avatar: string
}

export default function Likes({post, onClose}: {post: postProp, onClose: () => void}) {
  const [likes, setLikes] = useState<likeProp[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${post.profile_id.id}/posts/${post.id}/likes`),
        limit(30)
      ),
      (snapshot) => {
        const docs: likeProp[] = snapshot.docs.map(doc => {
          if(!doc.exists()) return {} as likeProp;
          return {
            id: doc.ref,
            name: doc.data().name,
            avatar: doc.data().avatar
          }
        });
        setLikes(docs);
        setLoading(false);
      }
    )
    return () => unsubscribe()
  }, [])
    

  return (
    <Modal onClose={onClose} className="w-full sm:w-96 space-y-4">
      <h3 className="text-lg font-semibold text-center">Likes</h3>
      <div className="space-y-3">
        {loading && <p>Loading...</p>}
        {likes.map(like => (
          <div key={like.id.id} className='flex justify-between'>
            <Link to={`/${like.id.id}`} className='flex gap-1 items-center'>
              <img src={like.avatar} alt={like.name} width="36" height="36" className='size-9 rounded-full' />
              <span>{like.name}</span>
            </Link>
            <button>Some Action</button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
