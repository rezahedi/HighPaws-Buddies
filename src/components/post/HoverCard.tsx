import * as RadixHoverCard from '@radix-ui/react-hover-card';
import '@/components/post/HoverCard.style.css'
import { useEffect, useState } from 'react';
import { profileProp, returnProfileProp } from '@/types/firestore';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import AvatarImage from '@/components/post/AvatarImage';
import { Link } from 'react-router-dom';
import { FollowRequest } from '@/components/profile'
import { useAuth } from '@/providers/auth'

// https://www.radix-ui.com/primitives/docs/components/hover-card

export default function HoverCard({profileId, children}: {profileId: string, children: React.ReactNode}) {
  const [profile, setProfile] = useState<profileProp | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { profile: authProfile } = useAuth()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = onSnapshot(doc(db, `profiles/${profileId}`), (doc) => {
      const res: profileProp | null = returnProfileProp(doc)
      setProfile(res)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [profileId])

  return (
    <RadixHoverCard.Root>
      <RadixHoverCard.Trigger asChild>
        {children}
      </RadixHoverCard.Trigger>
      <RadixHoverCard.Portal>
        <RadixHoverCard.Content className='HoverCardContent min-w-96' sideOffset={5}>
          <div>
            {loading && <p>Loading...</p>}
            {profile &&
              <div className='flex items-start'>
                <Link to={`/${profileId}`}>
                  <AvatarImage url={profile.avatars.buddy} name={profile.name} size='big' />
                </Link>
                <div className='flex-1 space-y-2'>
                  <h2 className='font-semibold'>
                    <Link to={`/${profileId}`}>
                      {profile.name} ({profile.owner})
                    </Link>
                  </h2>
                  <p className='flex gap-1 flex-wrap'>
                    <span>🎂 {profile.age}</span>
                    <span>⚖️ {profile.weight}</span>
                    <span>🐶 {profile.breed}</span>
                    <span>📌 {profile.location}</span>
                  </p>
                  <p className='text-gray-600 space-x-2'>
                    <span><b className='text-black'>{profile.stats.followers}</b> followers{' '}</span>
                    <span><b className='text-black'>{profile.stats.following}</b> following</span>
                  </p>
                  {authProfile && authProfile.id !== profileId && <FollowRequest from={authProfile} to={profile} className='px-3 py-1 primary' />}
                </div>
              </div>
            }
          </div>

          <RadixHoverCard.Arrow className='HoverCardArrow' />
        </RadixHoverCard.Content>
      </RadixHoverCard.Portal>
    </RadixHoverCard.Root>
  )
}
