import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth"
import { db } from "@/firebase"
import { onSnapshot, doc, writeBatch } from 'firebase/firestore';
import { profileProp } from "@/types/firestore";

export default function FollowRequest( {to}: {to: profileProp} ) {

  const [loading, setLoading] = useState<boolean>(false)
  const [followed, setFollowed] = useState<boolean>(false)
  const { profile } = useAuth()

  // TODO: Check if open profile is the same as the logged in user

  // TODO: Check if following already, if so, show unfollow button
  useEffect(() => {
    if( profile === null ) return

    // TODO: Should I attach a listener to every small things? isn't this too much?
    // Check if profile is following to.id
    const unsubscribe = onSnapshot(doc(db, `profiles/${profile.id}/following/${to.id}`), (doc) => {
      if ( doc.exists() ) {
        setFollowed(true)
      } else {
        setFollowed(false)
      }
    })
    return () => unsubscribe()
  }, [profile])

  const handleFollowRequest = async () => {

    // TODO: Redirect to login page or open login modal dialog
    if ( profile === null )
      return console.log('You must be logged in to send a follow request')

    setLoading(true)
    console.log(`Send follow request from ${profile.name} to ${to.name}`)

    // TODO: This following write/updates should be in a cloud function
    const batch = writeBatch(db)
    // Add followed user to currentUser's following list
    batch.set( doc(db, `profiles/${profile.id}/following/${to.id}`), {
      name: to.name,
      avatar: to.avatars.buddy,
    })
    // Add currentUser to user's followers list
    batch.set( doc(db, `profiles/${to.id}/followers/${profile.id}`), {
      name: profile.name,
      avatar: profile.avatars.buddy,
    })
    await batch.commit()

    setLoading(false)
  }

  const handleUnfollow = async () => {
    if ( profile === null ) return
    setLoading(true)

    // TODO: This following write/updates should be in a cloud function
    const batch = writeBatch(db)
    // Delete user from currentUser's following list
    batch.delete( doc(db, `profiles/${profile.id}/following/${to.id}`) )
    // Delete from user's followers list
    batch.delete( doc(db, `profiles/${to.id}/followers/${profile.id}`) )
    await batch.commit()
    
    setLoading(false)
  }

  return (
    <>
      {loading && <p>following ...</p>}
      {followed &&
        <button onClick={handleUnfollow} disabled={loading}>Unfollow</button>
      }
      {!followed &&
        <button onClick={handleFollowRequest} disabled={loading}>Follow Request</button>
      }
    </>
  )
}
