import { useEffect, useState } from 'react';
import { Header, Post, SidebarNav, SidebarBanners } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { NewPostBlock } from '@/components/feed';

export default function Feed() {

  const navigate = useNavigate()
  const { profile, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if( authLoading ) return
    if( profile === null ) return navigate('/login')

    // snapshot listener to get real-time updates from the firestore posts collection with where filter for public posts
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${profile.id}/feed`),
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
  }, [profile]);

  if( profile === null ) return navigate('/login')

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav />
        <main className='wall'>
          <NewPostBlock profile={profile} />
          {loading && <p>Loading...</p>}
          {posts.map((post) =>
            <Post key={post.id} post={post} />
          )}
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
