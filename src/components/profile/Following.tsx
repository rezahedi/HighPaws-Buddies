import { useState, useEffect } from "react"
import { useAuth } from "@/providers/auth"
import { db } from "@/firebase"
import { onSnapshot, query, collection, limit, DocumentReference } from "firebase/firestore"
import { Item } from "@/components/profile"
import Modal from "@/components/Modal"

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
        console.log(snapshot.docs);
        setLoading(false);
      }
    )
    return () => unsubscribe()
  }, [profile])

  return (
    <Modal onClose={onClose} className="w-full sm:w-96 space-y-2">
      <h3 className="text-lg font-semibold text-center">Following</h3>
      <div className="space-y-2">
        {loading && <p>Loading...</p>}
        {followers.map((follower, index) =>
          <Item key={index} user={follower} />
        )}
      </div>
    </Modal>
  )
}
