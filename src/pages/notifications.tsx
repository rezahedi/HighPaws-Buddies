import { useAuth } from '@/providers/auth'
import { notificationProp, returnNotificationProp } from '@/types/firestore'
import { db } from '@/firebase'
import { onSnapshot, query, collection, orderBy, limit, updateDoc, doc  } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NotificationsSkeleton } from '@/components/skeletons'
import { useNavigate } from 'react-router-dom'
import { Archive, Notification } from '@/components/icons'
import { formatRelativeDate } from '@/utils'

export default function Notifications() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [notifications, setNotifications] = useState<notificationProp[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const itemsPerLoad = 15
  const skeletonItemsPerLoad = 8
  const [limitCount, setLimitCount] = useState<number>(itemsPerLoad)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  const navigate = useNavigate()

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if ( !authProfile ) return

    setLoading(true)
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${authProfile.id}/notifications`),
        orderBy('published_at', 'desc'),
        limit(limitCount)
      ), (snapshot) => {
        const docs: notificationProp[] = snapshot.docs.map(doc => returnNotificationProp(doc));

        if( docs.length == limitCount ) {
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setLoading(false);
        setNotifications(docs);
    })
    return () => unsubscribe()
  }, [authProfile, loadingMore])

  const handleSeenAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${authProfile?.id}/notifications/${notification.id}`)
    updateDoc(docRef, { seen: true })
    navigate(notification.link)
  }

  const handleArchiveAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${authProfile?.id}/notifications/${notification.id}`)
    updateDoc(docRef, { archived: true })
  }

  return (
    <>
      <h3 className='font-semibold text-center text-lg p-4'>Notifications</h3>
      <div className='space-y-2 p-2'>
        {notifications.map((notification) =>
          <div key={notification.id} className={`notificationItem ${notification.seen ? `seen` : ``}`}>
            <div onClick={()=>handleSeenAction(notification)}>
              <img src={notification.avatar} alt={notification.name} />
              <p>
                {notification.message}<br />
                <time dateTime={notification.published_at.toDate().toISOString()}>
                  {formatRelativeDate(notification.published_at.toDate())}
                </time>
              </p>
            </div>
            {notification.archived && <p className='text-xs text-gray-500'>Archived</p>}
            {!notification.archived && 
              <button onClick={()=>handleArchiveAction(notification)} className='flex gap-2 items-center px-2'>
                <Archive className='size-5' />
                <span className='hidden sm:inline'>Archive</span>
              </button>}
          </div>
        )}
        {loading && <NotificationsSkeleton count={skeletonItemsPerLoad} />}
        {!loading && notifications.length === 0 &&
          <div className='flex flex-col items-center gap-2 my-14 mx-10 text-center'>
            <Notification className='size-28 text-gray-300' />
            This area will light up with new notifications<br /> once there's activity related to you.
          </div>
        }
        {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount+itemsPerLoad);setLoadingMore(true)}}>Load more</button></div>}
      </div>
    </>
  )
}
