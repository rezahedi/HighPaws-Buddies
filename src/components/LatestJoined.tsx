import { useEffect, useState } from 'react'
import { profileProp, returnProfileProp, } from '@/types/firestore'
import { query, collection, where, limit, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import Avatar from '@/components/post/Avatar'
import { useAuth } from '@/providers/auth'

export default function LatestJoined() {
  const { profile: authProfile } = useAuth()
  const [docs, setDocs] = useState<(profileProp)[]>([])
  const docsLimit = 5

  useEffect(() => {
    (async () => {
      // where doc id is not equal to authProfile id
      const q = query(
        collection(db, `profiles`), 
        where('__name__', '!=', authProfile?.id),
        limit(docsLimit)
      )
      const querySnapshot = await getDocs(q)
      const docs: (profileProp | null)[] = querySnapshot.docs.map(doc => returnProfileProp(doc));
      const filteredDocs = docs.filter(doc => doc !== null) as profileProp[]
      setDocs(filteredDocs)
    })()
  }, [])


  return (
    <div className='space-y-4 mt-4'>
      <h3 className='text-lg font-bold'>Latest joined users:</h3>
      <div className='flex gap-4 justify-center flex-wrap'>
        {docs.map((doc, i) => 
          <Avatar key={i}
            profileId={doc.id}
            url={doc.avatars.buddy}
            name={doc.name} withName
            size='bg'
            linked={true}
            className='flex flex-col gap-1 items-center font-semibold'
          />
        )}
      </div>
    </div>
  )
}
