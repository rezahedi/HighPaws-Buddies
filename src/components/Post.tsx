import '@/styles/Post.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postProp } from '@/types/firestore'

export default function Post({ post }: { post: postProp }) {
  const [liked, setLiked] = useState<number>(0)

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
            <p>{new Date(post.published_at * 1000).toLocaleDateString("en-US")}</p>
            <p>{post.location}</p>
          </div>
          <img src={post.media_url} alt={post.title} onClick={handleLike} />
        </figure>
      </div>
      <footer>
        <a href='#'>{post.stats.likes} likes</a>
        <a href='#'>{post.stats.comments} comments</a>
      </footer>
    </article>
  )
}
