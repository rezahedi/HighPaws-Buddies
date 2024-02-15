import { useState, useEffect } from 'react'
import { app } from '@/firebase';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { commentProp, returnCommentProp } from '@/types/firestore'
import { Link } from 'react-router-dom'
import '@/styles/Comments.css'
import { NewComment } from '@/components';

const db = getFirestore(app);

export default function Comments({postId}: {postId: string}) {

  const [comments, setComments] = useState<commentProp[]>([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, `posts/${postId}/comments`),
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

  return (
    <>
      {loading && <p>Fetching comments ...</p>}
      {comments.map((comment, index) =>
        <div key={index} className='comment'>
          <Link to={`/${comment.profile.id.id}`}>
            <img src={comment.profile.avatar} alt={comment.profile.name} />
            {comment.profile.name}
          </Link>
          <p>{comment.comment}</p>
          <time>{new Date(comment.created_at.seconds * 1000).toLocaleString([], {dateStyle: 'short'})}</time>
        </div>
      )}
      {!loading &&
        <NewComment postId={postId} />
      }
    </>
  )
}