import { Header, SidebarBanners, SidebarNav } from '@/components'
import { useAuth } from '@/providers/auth'
import { notificationProp, returnNotificationProp } from '@/types/firestore'
import { db } from '@/firebase'
import { onSnapshot, query, collection, orderBy, limit, updateDoc, doc  } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NotificationsSkeleton } from '@/components/skeletons'
import { useNavigate } from 'react-router-dom'
import { Archive, Notification } from '@/components/icons'

export default function Notifications() {
  const { profile } = useAuth()
  const [notifications, setNotifications] = useState<notificationProp[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (profile === null) return

    setLoading(true)
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profile.id}/notifications`),
        orderBy('published_at', 'desc'),
        limit(10)
      ), (snapshot) => {
        const docs: notificationProp[] = snapshot.docs.map(doc => returnNotificationProp(doc));
        setNotifications(docs);
        setLoading(false);
    })
    return () => unsubscribe()
  }, [profile])

  const handleSeenAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profile?.id}/notifications/${notification.id}`)
    updateDoc(docRef, { seen: true })
    navigate(notification.link)
  }

  const handleArchiveAction = (notification: notificationProp) => {
    const docRef = doc(db, `profiles/${profile?.id}/notifications/${notification.id}`)
    updateDoc(docRef, { archived: true })
  }

  if( profile === null ){
    navigate('/login')
    return null
  } 

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav />
        <main className="wall">
          <div className='post'><h3 className='font-semibold text-center text-lg'>Notifications</h3></div>
          <div className='space-y-2 p-2'>
            {loading && <NotificationsSkeleton count={8} />}
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
                {notification.archived && <p className='text-xs text-gray-500'>Archived</p>}
                {!notification.archived && 
                  <button onClick={()=>handleArchiveAction(notification)} className='flex gap-2 items-center px-2'>
                    <Archive className='size-5' />
                    <span className='hidden sm:inline'>Archive</span>
                  </button>}
              </div>
            )}
            {!loading && notifications.length === 0 &&
              <div className='flex flex-col items-center gap-2 my-14 mx-10 text-center'>
                <Notification className='size-28 text-gray-300' />
                This area will light up with new notifications<br /> once there's activity related to you.
              </div>
            }
          </div>
          <div className='h-24'></div>
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
