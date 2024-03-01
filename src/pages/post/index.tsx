import { useParams } from "react-router-dom"
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { postProp, returnPostProp } from "@/types/firestore";
import { Header, Post, SidebarBanners, SidebarNav } from "@/components";
import { PostSkeleton } from "@/components/skeletons";

export default function PostPage() {
  const { userHandler, postId } = useParams()
  const [post, setPost] = useState<postProp | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setPost(null)
    setDataLoading(true)
    const docRef = doc(db, `profiles/${userHandler}/posts/${postId}`)
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if ( !doc.exists() )
        return setError('Post not found!')

      const res: postProp | null = returnPostProp(doc)
      setPost(res)
    });
    setDataLoading(false)

    return () => unsubscribe()
  }, [userHandler, postId])

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav />
        <main className="wall">
          {dataLoading && <PostSkeleton />}
          {error && <p>{error}</p>}
          {post && <Post post={post} showComment />}
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
