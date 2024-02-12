import '@styles/Post.css'
import { useState } from 'react'

export default function Post({ post }) {
  const [liked, setLiked] = useState<number>(0)

  const handleLike = () => {
    console.log('liked', liked)
    if (liked === 0) return setLiked(1)
    setLiked( -(liked) )
  }

  const addLikeClass = () => {
    return liked === 1 ? 'liked' : liked === -1 ? 'unliked' : ''
  }

  return (
    <article className={`post ${addLikeClass()}`}>
      <header>
        <a className='user' href={`/${post.user.slug}`}>
          <img src={post.user.avatar} alt={post.user.name} />
          {post.user.name}
        </a>
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
