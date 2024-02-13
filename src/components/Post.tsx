import '@/styles/Post.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Post({ post }) {
  const [liked, setLiked] = useState<number>(0)

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

  return (
    <article className={`post ${addLikeClass()}`}>
      <header>
        {post.user &&
          <Link className='user' to={post.user.slug}>
            <img src={post.user.avatar} alt={post.user.name} />
            {post.user.name}
          </Link>
        }
        <h3>{post.title}</h3>
      </header>
      <div>
        <figure>
          <div>
            <p>{post.date}</p>
            <p>{post.location}</p>
          </div>
          <img src={post.imageUrl} alt={post.title} onClick={handleLike} />
        </figure>
      </div>
      <footer>
        <a href='#'>{post.likesCount} likes</a>
        <a href='#'>{post.commentsCount} comments</a>
      </footer>
    </article>
  )
}
