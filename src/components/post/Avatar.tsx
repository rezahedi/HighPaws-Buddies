import { useState, lazy } from 'react'
import { Link } from 'react-router-dom'
import AvatarImage from '@/components/post/AvatarImage'
const HoverCard = lazy(() => import('@/components/post/HoverCard'))

type sizeOptions = 'big' | 'base' | 'small'

export default function Avatar({
  profileId,
  name,
  url = '',
  size = 'base',
  className = ''
}: {
  profileId: string,
  name: string,
  url?: string,
  size?: sizeOptions,
  className?: string
}) {
  const [hover, setHover] = useState<boolean>(false)

  if(hover)
    return (
      <HoverCard profileId={profileId}>
        <Link to={`/${profileId}`} className={className} onMouseOver={()=>setHover(true)}>
          <AvatarImage url={url} name={name} size={size} />
        </Link>
      </HoverCard>
    )
  
  return (
    <Link to={`/${profileId}`} className={className} onMouseOver={()=>setHover(true)}>
      <AvatarImage url={url} name={name} size={size} />
    </Link>
  )
}
