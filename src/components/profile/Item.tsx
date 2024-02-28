import { Link } from 'react-router-dom'
import { DocumentReference } from "firebase/firestore"

type followerProp = {
  id: DocumentReference
  name: string
  avatar: string
}

export default function Item( {user}: {user: followerProp} ) {
  return (
    <div className='flex'>
      <Link to={`/${user.id.id}`} className='flex-grow flex gap-2 items-center'>
        <img src={user.avatar} alt={user.name} className='size-9 rounded-full' />
        {user.name}
      </Link>
      <button>Action</button>
    </div>
  )
}
