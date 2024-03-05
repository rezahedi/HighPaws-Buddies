import { Link } from 'react-router-dom'
import { Group, Home, Message, Money, Notification, Pen, Profile, Search } from '@/components/icons'
import { useAuth } from '@/providers/auth'

export default function SidebarNav({setShowModal}: {setShowModal: (value: boolean) => void}) {
  const { profile } = useAuth()

  return (
    <nav className='sidebar'>
      <ul>
        <li>
          <Link to='/' title='Home'>
            <Home />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to='/discover' title='Discover'>
            <Search />
            <span>Discover</span>
          </Link>
        </li>
        <li>
          <a href='#' title='For Sale & Free' className='disabled'>
            <Money />
            <span>For Sale & Free</span>
          </a>
        </li>
        <li>
          <a href='#' title='Packs' className='disabled'>
            <Group />
            <span>Packs</span>
          </a>
        </li>
        <li>
          <a href='/notifications' title='Notifications'>
            <Notification />
            <span>Notifications</span>
          </a>
        </li>
        <li>
          <a href='#' title='Messages' className='disabled'>
            <Message />
            <span>Messages</span>
          </a>
        </li>
        <li>
          <a href={`/${profile?.id}`} title='Profiles'>
            <Profile />
            <span>Profiles</span>
          </a>
        </li>
        <li>
          <button onClick={()=>setShowModal(true)} title='Post' className='primary'>
            <Pen />
            <span>Post</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
