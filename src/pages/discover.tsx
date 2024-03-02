import { Header, SidebarBanners, SidebarNav } from '@/components'
import { useAuth } from '@/providers/auth'

export default function Discover() {
  const { profile } = useAuth()

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
