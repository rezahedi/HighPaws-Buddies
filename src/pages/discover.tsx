import { useEffect } from 'react';
import { Header, SidebarBanners, SidebarNav } from '@/components'
import { useAuth } from '@/providers/auth'
import { useNavigate } from 'react-router-dom'

export default function Discover() {
  const { profile: authProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav />
        <main className="wall">
          <div className="post">Map of local places</div>
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
