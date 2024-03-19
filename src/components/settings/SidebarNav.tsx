import { NavLink } from 'react-router-dom'
import { Back, Notification, Profile } from '@/components/icons'

export default function SidebarNav() {

  return (
    <nav className='sidebar'>
      <h3 className='font-semibold text-xl text-center mb-4 hidden xl:block'>Settings</h3>
      <ul>
        <li className='mobile order-1'>
          <NavLink to='/settings/account' title='Profiles'>
            <Profile />
            <span>Account</span>
          </NavLink>
        </li>
        <li className='mobile order-2'>
          <NavLink to='/settings/notifications' title='Notifications'>
            <Notification />
            <span>Notifications</span>
          </NavLink>
        </li>
        <li className='mobile order-3'>
          <NavLink to='/' title='Back to Home'>
            <Back />
            <span>Back <span className='hidden sm:inline'>to Home</span></span>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
