import { useEffect, useState } from 'react';
import { Header, Post } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';

export default function Public() {

  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // snapshot listener to get real-time updates from the firestore posts collection with where filter for public posts
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts'),
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
  }, []);

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
