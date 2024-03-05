import { useAuth } from '@/providers/auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Notifications } from '@/components';
import '@/styles/Header.css'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Logout, Notification } from '@/components/icons';

export default function Header() {

  const { authUser, profile, loading, logout } = useAuth()
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
    setShowNotifications(!showNotifications)
  }

  return (
    <header className='nav bg-gray-100 p-1 border-b border-b-gray-300'>
      <div className='container w-full sm:max-w-7xl'>
        <h1>
          <Link to='/' className='flex items-center gap-2 text-2xl font-bold text-[#d56a34]'>
            <img src="/logo.png" alt="HighPaws Logo" width="50" height="50" />
            HighPaws
          </Link>
        </h1>
        Something Here
        <div className='user'>
          {loading && <Skeleton width={100} />}
          {profile && !loading &&
          <>
            <Link to={`/${profile.id}`} className='flex gap-2 items-center'>
              {profile.name}
              <img src={profile.avatars.buddy} alt={profile.name} className='size-9 rounded-full' width={36} height={36} />
            </Link>

            <button onClick={handleNotifications} className='relative p-2'>
              <Notification className='size-5' />
              {notificationStats > 0 && <sup className='absolute -top-1 -right-1 rounded-full size-3 bg-[#d56a34] -indent-20 overflow-hidden'>&nbsp;</sup>}
            </button>
            {showNotifications && 
            <Notifications profileId={profile.id} onClose={()=>setShowNotifications(false)} />}

            <button onClick={logout} className='p-2'><Logout className='size-5' /></button>
          </>}
          {!profile && !loading && 
          <>
            <Link to="/login" className='border rounded-full px-3 py-1'>Login</Link>{' '}
            <Link to="/signup" className='border rounded-full px-3 py-1 bg-[#d56a34]'>Signup</Link>
          </>}
        </div>
      </div>
    </header>
  )
}
