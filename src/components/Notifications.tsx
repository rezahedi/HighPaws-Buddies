import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { collection, doc, orderBy, limit, startAfter, onSnapshot, query, updateDoc, where, DocumentSnapshot } from 'firebase/firestore';
import { notificationProp, returnNotificationProp } from '@/types/firestore';
import { Modal } from '@/components';
import { NotificationsSkeleton } from '@/components/skeletons';
import { Archive, Notification } from '@/components/icons';

export default function Notifications( { profileId, onClose }: { profileId: string, onClose: () => void } ) {

  const [notifications, setNotifications] = useState<notificationProp[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const scrollableContainer = useRef<HTMLDivElement>(null)
  const itemsPerLoad = 8
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  const navigate = useNavigate()

  // Scroll event listener
  useEffect(() => {
    if(loadingMore === null) return
    const container = scrollableContainer.current
    if(!container) return

    const handleScroll = () => {
      if(container.scrollTop + container.clientHeight >= container.scrollHeight-20) {
        console.log('loading more')
        setLoadingMore(true)
      }
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadingMore])

  useEffect(() => {
    if(!loadingMore || !profileId) return

    setLoading(true);
    let q = query(
      collection(db, `profiles/${profileId}/notifications`),
      where('archived', '==', false),
      orderBy('published_at', 'desc'),
      limit(itemsPerLoad)
    )
    if(lastDoc !== null) {
      q = query(
        collection(db, `profiles/${profileId}/notifications`),
        where('archived', '==', false),
        orderBy('published_at', 'desc'),
        startAfter(lastDoc),
        limit(itemsPerLoad)
      )
    }
    const unsubscribe = onSnapshot(
      q, (snapshot) => {
        const docs: notificationProp[] = snapshot.docs.map(doc => returnNotificationProp(doc));

        if( docs.length == itemsPerLoad ) {
          setLastDoc( snapshot.docs[snapshot.docs.length - 1] );
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setNotifications([...notifications, ...docs])
        setLoading(false);
      }
    )
    return () => unsubscribe()
  }, [profileId, loadingMore])

  const handleSeenAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profileId}/notifications/${notification.id}`)
    updateDoc(docRef, { seen: true })
    navigate(notification.link)
  }

  const handleArchiveAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profileId}/notifications/${notification.id}`)
    updateDoc(docRef, { archived: true })
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
                <time>
                  {notification.published_at.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
                </time>
              </p>
            </div>
            <button onClick={()=>handleArchiveAction(notification)} className='flex gap-2 items-center px-2'>
              <Archive className='size-5' />
              <span className='hidden sm:inline'>Archive</span>
            </button>
          </div>
        )}
        {loading && <NotificationsSkeleton count={itemsPerLoad} />}
        {!loading && notifications.length === 0 &&
          <div className='flex flex-col items-center gap-2 my-14 mx-10 text-center'>
            <Notification className='size-28 text-gray-300' />
            This area will light up with new notifications<br /> once there's activity related to you.
          </div>
        }
      </div>
      <div className='flex  justify-center my-1 mx-auto'>
        <Link to={`/notifications`} className='py-2 inline-block px-4 border rounded-md'>See all the notifications</Link>
      </div>
    </Modal>
  )
}
