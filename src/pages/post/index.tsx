import { useNavigate, useParams } from "react-router-dom"
import { db } from '@/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { postProp, returnPostProp } from "@/types/firestore";
import { Post } from "@/components";
import { PostSkeleton } from "@/components/skeletons";
import { useAuth } from "@/providers/auth";

export default function PostPage() {
  const { userHandler, postId } = useParams()
  const [post, setPost] = useState<postProp | null>(null)
  const [dataLoading, setDataLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean | null>(null)
  const { profile: authProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setPost(null)
    setDataLoading(true)
    const docRef = doc(db, `profiles/${userHandler}/posts/${postId}`)
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if ( !doc.exists() )
        return setError(true)

      const res: postProp | null = returnPostProp(doc)
      setPost(res)
    });
    setDataLoading(false)

    return () => unsubscribe()
  }, [userHandler, postId])

  useEffect(() => {
    // If post doesn't exist
    if ( post === null ) return
    // If post is public show it
    if ( post.private === false ) return
    
    // PRIVATE POST
    // If user is not logged in
    if ( authProfile === null && authLoading === false ) return navigate('/login')
    // If user is the post's owner
    if ( userHandler === authProfile?.id ) return
    // If logged in user is following the post's owner
    (async () => {
      const followingDocRef = doc(db, `profiles/${authProfile?.id}/following/${userHandler}`)
      const res = await getDoc(followingDocRef)
      if ( !res.exists() ) return navigate('/login')
    })()
  }, [post, authProfile, authLoading]);

  return (
    <>
      {dataLoading && <PostSkeleton />}
      {error && <div className="post flex flex-col items-center gap-2 my-14 mx-10 text-center"><h3 className="text-7xl font-semibold">404</h3>It seems the post does not exist!</div>}
      {post && <Post post={post} showComment />}
    </>
  )
}
