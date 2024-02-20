import { useEffect, useState } from 'react';
import { Header, Post } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"

export default function Feed() {

  const navigate = useNavigate()
  const { profile } = useAuth()
  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <>
      <Header />
      {loading && <p>Loading...</p>}
      {posts.map((post, index) =>
        <Post key={index} post={post} />
      )}
    </>
  )
}
