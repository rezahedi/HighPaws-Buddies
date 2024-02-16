import { Link } from 'react-router-dom'
import { DocumentReference } from "firebase/firestore"

type followerProp = {
  id: DocumentReference
  name: string
  avatar: string
}

export default function Item( {user}: {user: followerProp} ) {
  return (
    <Link to={`/${user.id.id}`}>
      <img src={user.avatar} alt={user.name} />
      {user.name}
    </Link>
  )
}
