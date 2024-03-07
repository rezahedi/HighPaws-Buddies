import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postProp } from '@/types/firestore'
import { db } from '@/firebase';
import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/providers/auth';

// TODO: Lazy load the Comments component when user clicks to show comments
import { Comments, UserListInModal } from '@/components'
import { Bin, Comment, Like } from '@/components/icons';
import Likes from '@/components/post/Likes'

export default function Post(
  { post, showComment = false, onDelete }:
  { post: postProp, showComment?: boolean, onDelete?: (postId: string) => void}
) {
  const { profile } = useAuth()
  const [liked, setLiked] = useState<number>( post.liked ? 1 : 0 )
  const [showLikes, setShowLikes] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<boolean>(showComment)
  const [deletable, setDeletable] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)

  useEffect(() => {
    if (profile === null) return

    // TODO: check if loggedin user has liked the post
    // TODO: Liked posts other than in user's feed, should get the liked status from the post's likes subcollection
    // But to check each post's likes subcollection for each post in the feed is not efficient

    // Check if the post is loggedin user's post and mark it as deletable
    if (post.profile_id.id === profile.id) setDeletable(true)
  }, [])

  // TODO: Pass the profile details that I have from the post
  // To create profile page until profile's data is fetched
  // Create the below state and send as Link's state : <Link to='/:profileID' state={{profile: passingProfileState}}>
  // const passingProfileState = { ...post, profile_id: post.profile_id.path }

  useEffect(() => {
    if (profile === null) return
    if (liked === 0) return
    
    // TODO: Should prevent below code from running if liked state set by post.liked value
    // TODO: Following code should run only if user clicks like/unlike button

    (async () => {
      // TODO: Like/Unlike the post

      // TODO: It's better to increment feed/:postId stats.likes here for better user experience
      // If I'm going to update post.stats every 1 hour, then I should increment feed/:postId stats.likes
      // TODO: Dont forget that this component used for user /feed and user profile feed or posts too

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
        await updateDoc(feedDocRef, { liked: true, stats: post.stats })
      } else {
        await deleteDoc(originalDocRef)
        await updateDoc(feedDocRef, { liked: false, stats: post.stats })
      }
    })()
  }, [liked])

  const handleLike = () => {
    let value = -1
    if (liked !== 1)
      value = +1
    post.liked = !post.liked
    post.stats.likes = post.stats.likes + value
    setLiked(value)
  }

  const addLikeClass = () => {
    return liked === 1 ? 'liked' : liked === -1 ? 'unliked' : ''
  }

  const handleDeleteAction = async () => {
    if (!deletable) return;
    if ( profile === null ) return;
    if ( profile.id !== post.profile_id.id ) return;

    setDeleting(true)
    if( onDelete ) onDelete(post.id)
    const docRef = doc(db, `profiles/${profile.id}/posts/${post.id}`)
    await deleteDoc(docRef)
  }

  return (
    <article className={`post ${addLikeClass()}`}>
      <header>
        {post.profile_detail &&
          <Link className='user' to={`/${post.profile_id.id}`}>
            <img src={post.profile_detail.avatar_url} alt={post.profile_detail.name} loading='lazy' />
            {post.profile_detail.name}
          </Link>
        }
        <h3>{post.title}</h3>
        {deletable && !deleting &&
          <button onClick={handleDeleteAction} className='flex items-center gap-1 p-2' title='Delete post'>
            <Bin className='size-5' />
            <span className='hidden sm:inline'>Delete</span>
          </button>
        }
        {deleting && <p>Deleting...</p>}
      </header>
      <div>
        <figure>
          <div>
            <p>
              <Link to={`/${post.profile_id.id}/${post.id}`}>
                {post.published_at.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
              </Link>
            </p>
            <p>{post.location}</p>
          </div>
          <img src={post.media_url} alt={post.title} onDoubleClick={handleLike} loading='lazy' />
        </figure>
      </div>
      <footer>
        <Likes post={post} onClick={()=>setShowLikes(true)} />
          <div className='flex-grow'></div>
          <button onClick={handleLike} className={`flex items-center gap-2 border-0 rounded-md px-2 py-1 hover:text-red-600 ${post.liked && `text-red-600`}`}>
            <Like className='size-5' filled={post.liked} />
            {post.stats.likes === 0 ? 'Like' : `${post.stats.likes} likes`}
          </button>
        {post.stats.likes > 0 && showLikes &&
          <UserListInModal
            title="Likes"
            collectionRef={`profiles/${post.profile_id.id}/posts/${post.id}/likes`}
            count={post.stats.likes}
            onClose={()=>setShowLikes(false)}
          />
        }
        <button onClick={()=>setShowComments(true)} className='flex items-center gap-2 border-0 rounded-md px-2 py-1 hover:text-blue-600'>
          <Comment className='size-5' />
          {post.stats.comments === 0 ? 'Comment' : `${post.stats.comments} comments`}
        </button>
      </footer>
      {showComments &&
        <Comments postId={post.id} profileId={post.profile_id.id} />
      }
    </article>
  )
}
