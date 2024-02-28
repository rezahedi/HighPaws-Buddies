import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth"
import { db } from "@/firebase"
import { onSnapshot, query, collection, limit, DocumentReference } from "firebase/firestore"
import Modal from "@/components/Modal"
import { Link } from "react-router-dom"

type followerProp = {
  id: DocumentReference
  name: string
  avatar: string
}

export default function Following({profileId, onClose}: {profileId: string, onClose: () => void}) {
  const { profile } = useAuth()
  const [followers, setFollowers] = useState<followerProp[]>([])
  const [loading, setLoading] = useState(true)

  // TODO: if `profileId` followed by current user, give access to list of followers
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profileId}/following`),
        limit(30)
      ),
      (snapshot) => {
        const docs: followerProp[] = snapshot.docs.map(doc => {
          if(!doc.exists()) return {} as followerProp;
          return {
            id: doc.ref,
            name: doc.data().name,
            avatar: doc.data().avatar
          }
        });
        setFollowers(docs);
        setLoading(false);
      }
    )
    return () => unsubscribe()
  }, [profile])

  return (
    <Modal onClose={onClose} className="ListInModal">
      <h3>Following</h3>
      <div>
        {loading && <p>Loading...</p>}
        {followers.map((follower) =>
          <div key={follower.id.id} className='item'>
            <Link to={`/${follower.id.id}`}>
              <img src={follower.avatar} alt={follower.name} width="36" height="36" loading='lazy' />
              {follower.name}
            </Link>
            <button>Some Action</button>
          </div>
        )}
      </div>
    </Modal>
  )
}
