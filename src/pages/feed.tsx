import { useEffect, useState } from 'react';
import { Post, EmptyFeed, NewPost, Modal } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { NewPostBlock } from '@/components/feed';
import { PostSkeleton } from '@/components/skeletons';

export default function Feed() {

  const navigate = useNavigate()
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false)
  const itemsPerLoad = 10
  const skeletonItemsPerLoad = 4
  const [limitCount, setLimitCount] = useState<number>(itemsPerLoad)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${authProfile.id}/feed`),
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
        setPosts(docs)
      }
    );
    return () => unsubscribe();
  }, [authProfile, loadingMore]);

  return (
    <>
      {authProfile && <NewPostBlock profile={authProfile} onClick={setShowNewPostModal} />}
      {showNewPostModal &&
        <Modal onClose={()=>setShowNewPostModal(false)}>
          <NewPost onCancel={()=>setShowNewPostModal(false)} />
        </Modal>
      }
      {posts.map((post) =>
        <Post key={post.id} post={post} />
      )}
      {loading && <PostSkeleton count={skeletonItemsPerLoad} />}
      {posts.length === 0 && !loading && <EmptyFeed />}
      {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount+itemsPerLoad);setLoadingMore(true)}}>Load more posts</button></div>}
    </>
  )
}
