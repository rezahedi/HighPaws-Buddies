import '@/styles/Post.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postProp } from '@/types/firestore'

// TODO: Lazy load the Comments component when user clicks to show comments
import { Comments } from '@/components'

export default function Post({ post }: { post: postProp }) {
  const [liked, setLiked] = useState<number>(0)
  const [showComments, setShowComments] = useState<boolean>(false)

  // TODO: Get user id from auth context
  const user = {
    id:     '8gx3nLgpa75dVxo8q6dy',
    avatar: 'https://fakeimg.pl/50x50/FFD3E0?text=Max',
    name:   'Bjorn'
  }

  useEffect(() => {
    // TODO: check if loggedin user has liked the post
    // But this way with each post, it will make a request to check if user has liked the post
  }, [])

  // TODO: Pass the profile details that I have from the post
  // To create profile page until profile's data is fetched
  // Create the below state and send as Link's state : <Link to='/:profileID' state={{profile: passingProfileState}}>
  // const passingProfileState = { ...post, profile_id: post.profile_id.path }

  useEffect(() => {
    if (liked === 0) return

    // TODO: Send a request to like/unlike the post
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
          <img src={post.media_url} alt={post.title} onClick={handleLike} />
        </figure>
      </div>
      <footer>
        <a href='#'>{post.stats.likes} likes</a>
        <a href='#' onClick={handleComments}>{post.stats.comments} comments</a>
      </footer>
      {showComments &&
        <Comments postId={post.id} />
      }
    </article>
  )
}
