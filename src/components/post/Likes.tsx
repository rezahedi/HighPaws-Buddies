import { postProp, returnTidyProfileProp } from '@/types/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/firebase'
import { query, collection, limit, getDocs } from 'firebase/firestore'
import Avatar from '@/components/post/Avatar'
import { tidyProfileProp } from '@/types/firestore'

export default function Likes(
  {post, onClick}:
  {post: postProp, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void}
) {
  const [docs, setDocs] = useState<tidyProfileProp[]>([])
  const groupSize = 5

  useEffect(() => {
    (async () => {
      const q = query(collection(db, `profiles/${post.profile_id.id}/posts/${post.id}/likes`), limit(groupSize))
      const querySnapshot = await getDocs(q)
      const docs: tidyProfileProp[] = querySnapshot.docs.map(doc => returnTidyProfileProp(doc));
      setDocs(docs)
    })()
  }, [post])

  return (
    <>
      {docs.length > 0 && <>
        <button onClick={onClick} className={`group flex items-center gap-2 border-0 rounded-md px-2 py-1 hover:text-red-600 ${post.liked && `text-red-600`}`}>
          <div className='flex items-center -space-x-5 group-hover:-space-x-3'>
            {docs.map((doc, i) => (
              <Avatar key={i} profileId={doc.id} url={doc.avatar} name={doc.name} size='xs' linked={false} className='transition-all duration-100' />
            ))}
          </div>
          <span className='hidden sm:inline'>liked</span>
        </button>
      </>}
      {docs.length === 0 && 'Be the first to like'}
    </>
  )
}
