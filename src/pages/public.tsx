import { useEffect, useState } from 'react';
import { EmptyFeed, Post } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';
import { PostSkeleton } from '@/components/skeletons';

export default function Public() {

  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const itemsPerLoad = 10
  const skeletonItemsPerLoad = 4
  const [limitCount, setLimitCount] = useState<number>(itemsPerLoad)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)

  useEffect(() => {

    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts'),
        where('private', '==', false),
        orderBy('published_at', 'desc'),
        limit(limitCount)
      ),
      (snapshot) => {
        const docs: postProp[] = snapshot.docs.map(doc => returnPostProp(doc));

        if( docs.length == limitCount ) {
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setLoading(false);
        setPosts(docs);
      }
    );
    return () => unsubscribe();
  }, [loadingMore]);

  return (
    <>
      {posts.map((post, index) =>
        <Post key={index} post={post} />
      )}
      {loading && <PostSkeleton count={skeletonItemsPerLoad} />}
      {posts.length === 0 && !loading && <EmptyFeed />}
      {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount+itemsPerLoad);setLoadingMore(true)}}>Load more posts</button></div>}
    </>
  )
}
