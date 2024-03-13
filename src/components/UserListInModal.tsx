import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/providers/auth"
import { db } from "@/firebase"
import { onSnapshot, query, collection, orderBy, limit, startAfter, DocumentSnapshot } from "firebase/firestore"
import { Modal } from '@/components'
import { UserListInModalSkeleton } from '@/components/skeletons'
import Avatar from '@/components/post/Avatar'
import { FollowRequest } from "@/components/profile"
import { makeProfilePrepTidy, returnTidyProfileProp, tidyProfileProp } from "@/types/firestore"

export default function UserListInModal(
  { title, collectionRef, count, onClose }: {
    title:         string,
    collectionRef: string,
    count?:        number,
    onClose:       () => void,
  }
) {
  const scrollableContainer = useRef<HTMLDivElement>(null)
  const { profile } = useAuth()
  const [userList, setUserList] = useState<tidyProfileProp[]>([])
  const [loading, setLoading] = useState<boolean | null>(false)
  const itemsPerLoad = 15
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  count = Math.min(count || Infinity, itemsPerLoad)

  // Scroll event listener
  useEffect(() => {
    if(loadingMore === null) return
    const container = scrollableContainer.current
    if(!container) return

    const handleScroll = () => {
      if(container.scrollTop + container.clientHeight >= container.scrollHeight-20) {
        setLoadingMore(true)
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadingMore])

  useEffect(() => {
    if(!loadingMore || !profile) return

    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, collectionRef),
        orderBy('name', 'asc'),
        startAfter(lastDoc),
        limit(itemsPerLoad),
      ),
      (snapshot) => {
        const docs: tidyProfileProp[] = snapshot.docs.map(doc => returnTidyProfileProp(doc));

        if( docs.length == itemsPerLoad ) {
          setLastDoc( snapshot.docs[snapshot.docs.length - 1] );
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setUserList([...userList, ...docs])
        setLoading(false);
      }
    )
    return () => unsubscribe()
  }, [profile, loadingMore])

  return (
    <Modal onClose={onClose} title={title} className="ListInModal">
      <div ref={scrollableContainer}>
        {userList.map((user) =>
          <div key={user.id} className='item'>
            <div className="flex gap-1 items-center">
              <Avatar profileId={user.id} url={user.avatar} name={user.name} withName size='sm' className="flex gap-1 items-center font-semibold" />
            </div>
            {profile && profile.id !== user.id && 
              <FollowRequest from={makeProfilePrepTidy(profile)} to={user} className="py-1 px-3" />
            }
          </div>
        )}
        {loading && <UserListInModalSkeleton count={count} />}
      </div>
    </Modal>
  )
}
