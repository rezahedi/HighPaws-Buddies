import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { collection, doc, orderBy, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { notificationProp, returnNotificationProp } from '@/types/firestore';
import { Modal } from '@/components';
import { NotificationsSkeleton } from '@/components/skeletons';
import { Archive } from '@/components/icons';

export default function Notifications( { profileId, onClose }: { profileId: string, onClose: () => void } ) {

  const [notifications, setNotifications] = useState<notificationProp[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profileId}/notifications`),
        where('archived', '==', false),
        orderBy('published_at', 'desc'),
        limit(10)
      ), (snapshot) => {
        const docs: notificationProp[] = snapshot.docs.map(doc => returnNotificationProp(doc));
        setNotifications(docs);
        setLoading(false);
    })
    return () => unsubscribe()
  }, [profileId])

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
      <div>
        {loading && <NotificationsSkeleton count={5} />}
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
      </div>
      <div className='flex  justify-center my-1 mx-auto'>
        <Link to={`/notifications`} className='py-2 inline-block px-4 border rounded-md'>See all the notifications</Link>
      </div>
    </Modal>
  )
}
