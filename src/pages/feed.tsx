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
  const [loading, setLoading] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( authProfile === null ) return

    // snapshot listener to get real-time updates from the firestore posts collection with where filter for public posts
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${authProfile.id}/feed`),
        where('private', '==', false),
        orderBy('published_at', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const docs: postProp[] = snapshot.docs.map(doc => returnPostProp(doc));
        setPosts(docs);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [authProfile]);

  return (
    <>
      {authProfile && <NewPostBlock profile={authProfile} onClick={setShowNewPostModal} />}
      {showNewPostModal &&
        <Modal onClose={()=>setShowNewPostModal(false)}>
          <NewPost onCancel={()=>setShowNewPostModal(false)} />
        </Modal>
      }
      {loading && <PostSkeleton count={3} />}
      {posts.map((post) =>
        <Post key={post.id} post={post} />
      )}
      {posts.length === 0 && !loading && <EmptyFeed />}
    </>
  )
}
