import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import '@/styles/Profile.css'
import { Header, Post } from "@/components"
import { db } from '@/firebase';
import { collection, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { postProp, profileProp, returnPostProp, returnProfileProp } from '@/types/firestore';
import { Followers, Following, FollowRequest } from '@/components/profile';
import { useAuth } from '@/providers/auth';

export default function Profile() {
  
  // TODO: Get state passed by Link to make a profile page until profile's data is fetched
  // const { state } = useLocation() or
  // const { state } = props.location
  const { profile: loggedInProfile } = useAuth()
  const [profile, setProfile] = useState<profileProp | null>(null)
  const [posts, setPosts] = useState<postProp[]>([])
  const [profileLoading, setProfileLoading] = useState<boolean>(true)
  const [postsLoading, setPostsLoading] = useState<boolean>(true)
  const [switched, setSwitched] = useState<boolean>(false)
  const [showFollowers, setShowFollowers] = useState<boolean>(false)
  const [showFollowing, setShowFollowing] = useState<boolean>(false)
  const { userHandler } = useParams()

  // Get user profile from /profiles/:userHandler
  useEffect(() => {
    // TODO: Change doc id to a readable user handler like /bjorn
    const unsubscribe = onSnapshot(doc(db, `profiles/${userHandler}`), (doc) => {
      // TODO: if doc doesn't exist, redirect to 404 page
      const res: profileProp | null = returnProfileProp(doc)
      setProfile( res )
      setProfileLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Get user posts from /profiles/:userHandler/posts
  useEffect(() => {
    // get user posts from /profiles/:userHandler/posts
    const unsubscribe = onSnapshot(query(
      collection(db, `profiles/${userHandler}/posts`),
      orderBy('published_at', 'desc'),
      limit(10)
    ), (snapshot) => {
      const docs: postProp[] = snapshot.docs.map( doc => returnPostProp(doc) )
      setPosts(docs)
      setPostsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleAvatarSwitch = () => {
    setSwitched(!switched)
  }

  const handleFollowers = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowFollowers(true)
  }

  const handleFollowing = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setShowFollowing(true)
  }

  return (
    <>
      <Header />
      <div className="profile">
        {profileLoading && <p>Loading profile skeleton ...</p>}
        {profile &&
        <>
        <section className="avatar">
          <figure onClick={handleAvatarSwitch} className={switched?`switched`:``}>
            <img className="pet" src={profile.avatars.buddy} alt={profile.name} />
            <img className="owner" src={profile.avatars.owner} alt={profile.owner} />
          </figure>
          <h2>{profile.name}</h2>
          {loggedInProfile && loggedInProfile.id !== profile.id && <FollowRequest to={profile} />}
        </section>
        <section className="stats">
          <a href="#" onClick={handleFollowers}>{profile.stats.followers} followers</a>
          <a href="#" onClick={handleFollowing}>{profile.stats.following} following</a>
          <a href="#">{profile.stats.posts} posts</a>
          {showFollowers && <Followers profileId={profile.id} onClose={()=>setShowFollowers(false)} />}
          {showFollowing && <Following profileId={profile.id} onClose={()=>setShowFollowing(false)} />}
        </section>
        <section className="detail">
          <div>🎂 {profile.age}</div>
          <div>⚖️ {profile.weight}</div>
          <div>🐶 {profile.breed}</div>
          <div>📌 {profile.location}</div>
        </section>
        <section className="tags">
          {profile.characteristics.map((element, index) => (
            <a key={index} href="#">{element}</a>
          ))}
        </section>
        </>
        }
        <div className='feed'>
          {postsLoading && <p>Loading posts skeleton ...</p>}
          {posts && posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
