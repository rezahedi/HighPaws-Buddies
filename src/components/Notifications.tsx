import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { collection, doc, orderBy, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { notificationProp, returnNotificationProp } from '@/types/firestore';
import { Modal } from '@/components';
import { NotificationsSkeleton } from '@/components/skeletons';
import { Archive, Notification } from '@/components/icons';
import { formatRelativeDate } from '@/utils'

export default function Notifications( { profileId, onClose }: { profileId: string, onClose: () => void } ) {

  const [notifications, setNotifications] = useState<notificationProp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const scrollableContainer = useRef<HTMLDivElement>(null)
  const itemsPerLoad = 6
  const skeletonItemsPerLoad = 3
  const [limitCount, setLimitCount] = useState<number>(itemsPerLoad)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  const navigate = useNavigate()

  // Scroll event listener
  useEffect(() => {
    if(loadingMore === null) return
    const container = scrollableContainer.current
    if(!container) return

    const handleScroll = () => {
      if(container.scrollTop + container.clientHeight >= container.scrollHeight-20) {
        setLimitCount( limitCount + itemsPerLoad )
        setLoadingMore(true)
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadingMore])

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profileId}/notifications`),
        where('archived', '==', false),
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
        setNotifications(docs)
      }
    )
    return () => unsubscribe()
  }, [profileId, loadingMore])

  const handleSeenAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profileId}/notifications/${notification.id}`)
    updateDoc(docRef, { seen: true })
    onClose()
    navigate(notification.link)
  }

  const handleArchiveAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profileId}/notifications/${notification.id}`)
    updateDoc(docRef, { archived: true })
  }

  const handleLinkToAllNotifications = () => {
    onClose()
    navigate(`/notifications`)
  }

  return (
    <Modal onClose={onClose} className='ListInModal'>
      <h3>Notifications</h3>
      <div ref={scrollableContainer}>
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
            <button onClick={()=>handleArchiveAction(notification)} className='flex gap-2 items-center px-2'>
              <Archive className='size-5' />
              <span className='hidden sm:inline'>Archive</span>
            </button>
          </div>
        )}
        {loading && <NotificationsSkeleton count={skeletonItemsPerLoad} />}
        {!loading && notifications.length === 0 &&
          <div className='flex flex-col items-center gap-2 my-14 mx-10 text-center'>
            <Notification className='size-28 text-gray-300' />
            This area will light up with new notifications<br /> once there's activity related to you.
          </div>
        }
      </div>
      <div className='flex  justify-center my-1 mx-auto'>
        <button onClick={handleLinkToAllNotifications} className='py-2 inline-block px-4 border rounded-md'>See all the notifications</button>
      </div>
    </Modal>
  )
}
