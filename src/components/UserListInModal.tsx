import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth"
import { db } from "@/firebase"
import { onSnapshot, query, collection, limit, DocumentReference } from "firebase/firestore"
import { Modal } from '@/components'
import { Link } from "react-router-dom"
import { UserListInModalSkeleton } from '@/components/skeletons'

type docProp = {
  id: DocumentReference,
  name: string,
  avatar: string
}

export default function UserListInModal(
  { title, collectionRef, count, onClose }: {
    title:         string,
    collectionRef: string,
    count?:         number,
    onClose:       () => void,
  }
) {
  const { profile } = useAuth()
  const [userList, setUserList] = useState<docProp[]>([])
  const [loading, setLoading] = useState(false)
  const MaxSkeletonCount = 5

  count = Math.min(count || Infinity, MaxSkeletonCount)

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, collectionRef),
        limit(30)
      ),
      (snapshot) => {
        const docs: docProp[] = snapshot.docs.map(doc => {
          if(!doc.exists()) return {} as docProp;
          return {
            id: doc.ref,
            name: doc.data().name,
            avatar: doc.data().avatar
          }
        });
        setLoading(false);
        setUserList(docs);
      }
    )
    return () => unsubscribe()
  }, [profile])

  return (
    <Modal onClose={onClose} className="ListInModal">
      <h3>{title}</h3>
      <div>
        {loading && <UserListInModalSkeleton count={count} />}
        {userList.map((user) =>
          <div key={user.id.id} className='item'>
            <Link to={`/${user.id.id}`}>
              <img src={user.avatar} alt={user.name} width="36" height="36" loading='lazy' />
              {user.name}
            </Link>
            <button>Some Action</button>
          </div>
        )}
      </div>
    </Modal>
  )
}
