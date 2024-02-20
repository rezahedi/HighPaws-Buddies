import { useState, useEffect } from 'react'
import { db } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { commentProp, returnCommentProp } from '@/types/firestore'
import { Link, useLocation } from 'react-router-dom'
import '@/styles/Comments.css'
import { NewComment } from '@/components';

export default function Comments({postId, profileId}: {postId: string, profileId: string}) {

  const [comments, setComments] = useState<commentProp[]>([])
  const [loading, setLoading] = useState(true);
  const location = useLocation()
  const commentFragmentIdentifier = location.hash

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profileId}/posts/${postId}/comments`),
        orderBy('created_at', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const docs: commentProp[] = snapshot.docs.map(doc => returnCommentProp(doc));
        setComments(docs);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if( commentFragmentIdentifier === '' ) return
    const comment = document.getElementById(commentFragmentIdentifier.substring(1))
    if( comment === null ) return
    comment.scrollIntoView({behavior: "smooth"})
    comment.classList.add('highlight')
  }, [comments])

  return (
    <>
      {loading && <p>Fetching comments ...</p>}
      {comments.map((comment, index) =>
        <div key={index} className='comment' id={comment.id}>
          <Link to={`/${comment.profile_id.id}`}>
            <img src={comment.avatar} alt={comment.name} />
            {comment.name}
          </Link>
          <p>{comment.comment}</p>
          <time>
            <a href={`#${comment.id}`}>
              {comment.created_at.toDate().toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
            </a>
          </time>
        </div>
      )}
      {!loading &&
        <NewComment postId={postId} profileId={profileId} />
      }
    </>
  )
}
