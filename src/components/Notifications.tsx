import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { collection, doc, orderBy, limit, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { notificationProp, returnNotificationProp } from '@/types/firestore';
import { Modal } from '@/components';
import '@/styles/Notifications.css';

export default function Notifications( { profileId }: { profileId: string } ) {

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
    <Modal>
      <div className='notificationsList'>
        {loading && <p>Loading notifications ...</p>}
        {notifications.map((notification, index) =>
          <div key={index} className={`item ${notification.seen ? `seen` : ``}`}>
            <div onClick={()=>handleSeenAction(notification)}>
              <p>{notification.message}</p>
              <time>
                {notification.published_at.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
              </time>
            </div>
            <button onClick={()=>handleArchiveAction(notification)}>Archive</button>
          </div>
        )}
      </div>
    </Modal>
  )
}
