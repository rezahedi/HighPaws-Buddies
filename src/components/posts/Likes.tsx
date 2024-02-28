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
    <Modal onClose={onClose} className="ListInModal">
      <h3>Likes</h3>
      <div>
        {loading && <p>Loading...</p>}
        {likes.map(like => (
          <div key={like.id.id} className='item'>
            <Link to={`/${like.id.id}`}>
              <img src={like.avatar} alt={like.name} width="36" height="36" loading='lazy' />
              {like.name}
            </Link>
            <button>Some Action</button>
          </div>
        ))}
      </div>
    </Modal>
  )
}
