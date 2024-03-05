import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import '@/styles/Profile.css'
import { EmptyFeed, Post, UserListInModal } from "@/components"
import { db } from '@/firebase';
import { collection, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { postProp, profileProp, returnPostProp, returnProfileProp } from '@/types/firestore';
import { FollowRequest } from '@/components/profile';
import { useAuth } from '@/providers/auth';
import { PostSkeleton, ProfileSkeleton } from '@/components/skeletons';
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  
  // TODO: Get state passed by Link to make a profile page until profile's data is fetched
  // const { state } = useLocation() or
  // const { state } = props.location
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<profileProp | null>(null)
  const [posts, setPosts] = useState<postProp[]>([])
  const [profileLoading, setProfileLoading] = useState<boolean>(false)
  const [postsLoading, setPostsLoading] = useState<boolean>(false)
  const [switched, setSwitched] = useState<boolean>(false)
  const [showFollowers, setShowFollowers] = useState<boolean>(false)
  const [showFollowing, setShowFollowing] = useState<boolean>(false)
  const { userHandler } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading])

  // Get user profile from /profiles/:userHandler
  useEffect(() => {
    setSwitched(false)
    setShowFollowers(false)
    setShowFollowing(false)
    setProfile(null)
    setProfileLoading(true)
    // TODO: Change doc id to a readable user handler like /bjorn
    const unsubscribe = onSnapshot(doc(db, `profiles/${userHandler}`), (doc) => {
      // TODO: if doc doesn't exist, redirect to 404 page
      const res: profileProp | null = returnProfileProp(doc)
      setProfile(res)
      setProfileLoading(false)
    })
    return () => unsubscribe()
  }, [userHandler])

  // Get user posts from /profiles/:userHandler/posts
  useEffect(() => {
    setPosts([])
    setPostsLoading(true)
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
  }, [userHandler])

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
      <div className='profile'>
        {profileLoading && <ProfileSkeleton />}
        {profile &&
        <>
        <section className="avatar">
          <figure onClick={handleAvatarSwitch} className={switched?`switched`:``}>
            <img className="pet" src={profile.avatars.buddy} alt={profile.name} />
            <img className="owner" src={profile.avatars.owner} alt={profile.owner} />
          </figure>
          <h2>{profile.name}</h2>
          {authProfile && authProfile.id !== profile.id && <FollowRequest to={profile} />}
        </section>
        <section className="stats">
          <a href="#" onClick={handleFollowers}>{profile.stats.followers} followers</a>
          <a href="#" onClick={handleFollowing}>{profile.stats.following} following</a>
          <a href="#">{profile.stats.posts} posts</a>
          {showFollowers &&
            <UserListInModal
              title='Followers'
              collectionRef={`profiles/${profile.id}/followers`}
              count={profile.stats.followers}
              onClose={()=>setShowFollowers(false)}
            />
          }
          {showFollowing &&
            <UserListInModal
              title='Following'
              collectionRef={`profiles/${profile.id}/following`}
              count={profile.stats.following}
              onClose={()=>setShowFollowing(false)}
            />
          }
        </section>
        <section className="detail">
          <div>🎂 {profile.age}</div>
          <div>⚖️ {profile.weight}</div>
          <div>🐶 {profile.breed}</div>
          <div>📌 {profile.location}</div>
        </section>
        {profile.characteristics.length > 0 &&
          <section className="tags">
            {profile.characteristics.map((element, index) => (
              <a key={index} href="#">{element}</a>
            ))}
          </section>
        }
        </>
        }
      </div>
      {postsLoading && <PostSkeleton count={3} />}
      {posts && posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {posts.length === 0 && !postsLoading && <EmptyFeed>You haven't post anything yet! 😏</EmptyFeed>}
    </>
  )
}
