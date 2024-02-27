import { Link } from 'react-router-dom'

export default function SidebarNav() {
  return (
    <nav className='sidebar border bg-white w-[275px] mt-5 p-5 sticky h-fit top-5 space-y-5'>
      <ul className='space-y-2 text-xl'>
        <li><Link to='/'>Home</Link></li>
        <li>Discover</li>
        <li>Lost & Found</li>
        <li>For Sale & Free</li>
        <li>Packs</li>
        <li>Notifications</li>
        <li>Messages</li>
        <li>Profiles</li>
      </ul>
      <button className='primary w-full'>+ Post</button>
    </nav>
  )
}
