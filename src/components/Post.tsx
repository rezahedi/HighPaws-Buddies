import '@/styles/Post.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postProp } from '@/types/firestore'
import { db } from '@/firebase';
import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/providers/auth';

// TODO: Lazy load the Comments component when user clicks to show comments
import { Comments } from '@/components'

export default function Post({ post }: { post: postProp }) {
  const { profile } = useAuth()
  const [liked, setLiked] = useState<number>(0)
  const [showComments, setShowComments] = useState<boolean>(false)

  useEffect(() => {
    // TODO: check if loggedin user has liked the post
    if (post.liked) setLiked(1)

    // Actually, We can save liked state in the posts in the feed subcollection for each user
    // ex: /profiles/:profileId/feed/:postId { liked: true/false } means :profileId has liked the post or not
  }, [])

  // TODO: Pass the profile details that I have from the post
  // To create profile page until profile's data is fetched
  // Create the below state and send as Link's state : <Link to='/:profileID' state={{profile: passingProfileState}}>
  // const passingProfileState = { ...post, profile_id: post.profile_id.path }

  useEffect(() => {
    if (profile === null) return
    if (liked === 0) return
    // To prevent running liking logic if post liked before: post:{liked: true}
    if (liked === 1 && post.liked) return
    
    // TODO: Should prevent below code from running if liked state set by post.liked value
    // TODO: Following code should run only if user clicks like/unlike button

    (async () => {
      // TODO: Like/Unlike the post
      const originalDocRef = doc(db, `profiles/${post.profile_id.id}/posts/${post.id}/likes/${profile.id}`)
      const feedDocRef = doc(db, `profiles/${profile.id}/feed/${post.id}`)
      if( liked === 1 ) {
        const newLike = {
          avatar: profile.avatars.buddy,
          name: profile.name,
          id: doc(db, `profiles/${profile.id}`)
        }
        await setDoc(originalDocRef, newLike)
        // Update /profiles/:currentUserId/feed/:postId { liked: true }
        await updateDoc(feedDocRef, { liked: true })
      } else {
        await deleteDoc(originalDocRef)
        await updateDoc(feedDocRef, { liked: false })
      }
    })()
  }, [liked])

  const handleLike = () => {
    if (liked === 0) return setLiked(1)
    setLiked( -(liked) )
  }

  const addLikeClass = () => {
    return liked === 1 ? 'liked' : liked === -1 ? 'unliked' : ''
  }

  const handleComments = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setShowComments(true)
  }

  return (
    <article className={`post ${addLikeClass()}`}>
      <header>
        {post.profile_detail &&
          <Link className='user' to={`/${post.profile_id.id}`}>
            <img src={post.profile_detail.avatar_url} alt={post.profile_detail.name} />
            {post.profile_detail.name}
          </Link>
        }
        <h3>{post.title}</h3>
      </header>
      <div>
        <figure>
          <div>
            <p>{post.published_at.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}</p>
            <p>{post.location}</p>
          </div>
          <img src={post.media_url} alt={post.title} onDoubleClick={handleLike} />
        </figure>
      </div>
      <footer>
        {liked} {post.liked && `🩷`} <a href='#'>{post.stats.likes} likes</a>
        <a href='#' onClick={handleComments}>{post.stats.comments} comments</a>
      </footer>
      {showComments &&
        <Comments postId={post.id} profileId={post.profile_id.id} />
      }
    </article>
  )
}
