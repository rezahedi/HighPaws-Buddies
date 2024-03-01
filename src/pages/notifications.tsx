import { Header, SidebarBanners, SidebarNav } from '@/components'
import { useAuth } from '@/providers/auth'

export default function Notifications() {
  const { profile } = useAuth()

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav />
        <main className="wall">
          <div className='post'>Notifications</div>
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
