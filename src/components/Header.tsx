import { useAuth } from '@/providers/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Notifications } from '@/components';
import '@/styles/Header.css'

export default function Header() {

  const { authUser, profile, error, loading, logout } = useAuth()
  const [notificationStats, setNotificationStats] = useState<number>(0)
  const [showNotifications, setShowNotifications] = useState<boolean>(false)

  useEffect(() => {
    if( !authUser || !profile ) return

    const notificationStatsDocRef = doc(db, `profiles/${profile.id}/notifications/stats`)
    const unsubscribe = onSnapshot(notificationStatsDocRef, (doc) => {
      // get notification stats { unseen: number }
      if( !doc.exists() ) return setNotificationStats(0)
      setNotificationStats( doc.data().unseen || 0 )
    })
    return () => unsubscribe()
  }, [profile, authUser])

  const handleNotifications = () => {
    if (notificationStats == 0) return
    setShowNotifications(!showNotifications)
  }

  return (
    <header className='nav'>
      <h1>
        <Link to='/' className='flex items-center gap-2 text-2xl font-bold'>
          <img src="./logo.png" alt="HighPaws Logo" width="50" height="50" />
          HighPaws
        </Link>
      </h1>
      {authUser && <Link to="/new">New Post</Link>}
      <div>
        {loading && <p>Loading...</p>}
        {!loading &&
          <>
            {error && <p>{error}</p>}
            {profile && <>
              <Link to={`/${profile.id}`}>{profile.name}</Link><br />
              <div className='notification'>
                <button onClick={handleNotifications}>
                  Notifications <sup>{notificationStats}</sup>
                </button>
                {showNotifications && <Notifications profileId={profile.id} />}
              </div>
              {authUser?.email}<br />
              <button onClick={logout}>Logout</button>
            </>}
            {!authUser && 
            <>
              <Link to="/login">Login</Link>{' '}
              <Link to="/signup">Signup</Link>
            </>}
          </>
        }
      </div>
    </header>
  )
}
