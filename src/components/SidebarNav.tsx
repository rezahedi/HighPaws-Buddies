import { NavLink } from 'react-router-dom'
import { Group, Home, Message, Money, Notification, Pen, Profile, Search, Setting } from '@/components/icons'
import { useAuth } from '@/providers/auth'

export default function SidebarNav({setShowModal}: {setShowModal: (value: boolean) => void}) {
  const { profile } = useAuth()

  return (
    <nav className='sidebar'>
      <ul>
        <li className='mobile order-1'>
          <NavLink to='/' title='Home'>
            <Home />
            <span>Home</span>
          </NavLink>
        </li>
        <li className='mobile order-2'>
          <NavLink to='/discover' title='Discover'>
            <Search />
            <span>Discover</span>
          </NavLink>
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
        <li className='mobile order-4'>
          <NavLink to='/notifications' title='Notifications'>
            <Notification />
            <span>Notifications</span>
          </NavLink>
        </li>
        <li>
          <a href='#' title='Messages' className='disabled'>
            <Message />
            <span>Messages</span>
          </a>
        </li>
        <li>
          <NavLink to='/settings' title='Settings'>
            <Setting />
            <span>Settings</span>
          </NavLink>
        </li>
        <li className='mobile order-5'>
          <NavLink to={`/${profile?.id}`} title='Profiles'>
            <Profile />
            <span>Profiles</span>
          </NavLink>
        </li>
        <li className='mobile order-3'>
          <button onClick={()=>setShowModal(true)} title='Post' className='primary'>
            <Pen />
            <span>Post</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
