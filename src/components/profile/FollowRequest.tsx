import { useEffect, useState } from "react"
import { db } from "@/firebase"
import { onSnapshot, doc, writeBatch, getDoc } from 'firebase/firestore';
import { tidyProfileProp } from "@/types/firestore";

export default function FollowRequest( {from, to, className=''}: {from:tidyProfileProp, to: tidyProfileProp, className?: string} ) {

  const [loading, setLoading] = useState<boolean>(false)
  const [followStatus, setFollowStatus] = useState<boolean | null>(null)
  const [isFollowBack, setIsFollowBack] = useState<boolean>(false)

  // TODO: Check if open profile is the same as the logged in user

  // TODO: Check if following already, if so, show unfollow button
  useEffect(() => {
    // TODO: Should I attach a listener to every small things? isn't this too much?
    // Check if profile is following to.id
    const docRef = doc(db, `profiles/${from.id}/followers/${to.id}`)
    const unsubscribe = onSnapshot(doc(db, `profiles/${from.id}/following/${to.id}`), async (doc) => {
      if ( doc.exists() ) {
        setFollowStatus(true)
      } else {
        // Check if to is following from to show follow back button
        const res = await getDoc( docRef )
        if ( res.exists() ) {
          setIsFollowBack(true)
        } else {
          setIsFollowBack(false)
        }
        setFollowStatus(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // TODO: Should I attach a listener to every small things? isn't this too much?
    // Check if profile is following to.id
    const unsubscribe = onSnapshot(doc(db, `profiles/${from.id}/followers/${to.id}`), (doc) => {
      if ( doc.exists() ) {
        setIsFollowBack(true)
      } else {
        setIsFollowBack(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const handleFollow = async () => {

    setLoading(true)
    console.log(`Send follow request from ${from.name} to ${to.name}`)

    // TODO: This following write/updates should be in a cloud function
    const batch = writeBatch(db)
    // Add followed user to currentUser's following list
    batch.set( doc(db, `profiles/${from.id}/following/${to.id}`), {
      name: to.name,
      avatar: to.avatar,
    })
    // Add currentUser to user's followers list
    batch.set( doc(db, `profiles/${to.id}/followers/${from.id}`), {
      name: from.name,
      avatar: from.avatar,
    })
    await batch.commit()

    setLoading(false)
  }

  const handleUnfollow = async () => {
    setLoading(true)

    // TODO: This following write/updates should be in a cloud function
    const batch = writeBatch(db)
    // Delete user from currentUser's following list
    batch.delete( doc(db, `profiles/${from.id}/following/${to.id}`) )
    // Delete from user's followers list
    batch.delete( doc(db, `profiles/${to.id}/followers/${from.id}`) )
    await batch.commit()
    
    setLoading(false)
  }

  if(from.id === to.id) return;

  return (
    <>
      {followStatus===true &&
        <button onClick={handleUnfollow} disabled={loading} className={className}>
          {loading ? 'Following ...' : 'Unfollow'}
        </button>
      }
      {followStatus===false &&
        <button onClick={handleFollow} disabled={loading} className={className}>
          {loading ? 'Unfollowing ...' : (isFollowBack ? 'Follow Back' : 'Follow Request')}
        </button>
      }
    </>
  )
}
