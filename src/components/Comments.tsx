import { useState, useEffect } from 'react'
import { db } from '@/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { commentProp, postProp, returnCommentProp } from '@/types/firestore'
import { Link, useLocation } from 'react-router-dom'
import '@/styles/Comments.css'
import { NewComment } from '@/components';
import { CommentsSkeleton } from '@/components/skeletons';
import { formatRelativeDate } from '@/utils'

export default function Comments({post}: {post: postProp}) {

  const itemsPerLoad = 8
  const skeletonItemsPerLoad = 3
  const [limitCount, setLimitCount] = useState<number>(itemsPerLoad)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  const [comments, setComments] = useState<commentProp[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation()
  const commentFragmentIdentifier = location.hash

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${post.profile_id.id}/posts/${post.id}/comments`),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      ),
      (snapshot) => {
        const docs: commentProp[] = snapshot.docs.map(doc => returnCommentProp(doc));

        if( docs.length == limitCount ) {
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setLoading(false);
        setComments(docs);
      }
    );
    return () => unsubscribe();
  }, [limitCount]);

  useEffect(() => {
    if( commentFragmentIdentifier === '' ) return
    const comment = document.getElementById(commentFragmentIdentifier.substring(1))
    if( comment === null ) return
    comment.scrollIntoView({behavior: "smooth"})
    comment.classList.add('highlight')
  }, [comments])

  return (
    <>
      {comments.length>0 && comments.map((comment, index) =>
        <div
          key={index} id={comment.id}
          className='bg-gray-100 flex gap-3 px-3 py-2 rounded-lg text-sm'
        >
          <Link to={`/${comment.profile_id.id}`}>
            <img src={comment.avatar} alt={comment.name} width={36} height={36} className='size-9 rounded-full' />
          </Link>
          <div className='flex-1'>
            <Link to={`/${comment.profile_id.id}`} className='font-semibold'>{comment.name}</Link>
            {' '}•{' '}
            <Link className='inline' to={`/${post.profile_id.id}/${post.id}#${comment.id}`}>
              <time dateTime={comment.created_at.toDate().toISOString()} className='text-xs'>
                {formatRelativeDate(comment.created_at.toDate())}
              </time>
            </Link>
            <p className='pt-1'>{comment.comment}</p>
          </div>
        </div>
      )}
      {loading && <CommentsSkeleton count={limitCount===itemsPerLoad ? (post.stats.comments < skeletonItemsPerLoad ? post.stats.comments : skeletonItemsPerLoad) : skeletonItemsPerLoad} />}
      {!loading && loadingMore!==null &&
        <button onClick={()=>{setLimitCount(limitCount+itemsPerLoad);setLoadingMore(true)}} className='text-blue-600 text-sm hover:underline p-1 pt-0 w-fit border-0'>See more comments</button>
      }
      <NewComment postId={post.id} profileId={post.profile_id.id} />
    </>
  )
}
