import { useState, lazy } from 'react'
import { Link } from 'react-router-dom'
import AvatarImage from '@/components/post/AvatarImage'
const HoverCard = lazy(() => import('@/components/post/HoverCard'))

type sizeOptions = 'bg' | 'base' | 'sm' | 'xs'

export default function Avatar({
  profileId,
  name,
  withName = false,
  url = '',
  size = 'base',
  linked = true,
  className = ''
}: {
  profileId: string,
  name: string,
  withName?: boolean,
  url?: string,
  size?: sizeOptions,
  linked?: boolean,
  className?: string
}) {
  const [hover, setHover] = useState<boolean>(false)

  if(hover)
    return (
      <HoverCard profileId={profileId}>
        {linked
        ?
          <Link to={`/${profileId}`} className={className}>
            <AvatarImage url={url} name={name} size={size} />
            {withName && <span>{name}</span>}
          </Link>
        :
          <div>
            <AvatarImage url={url} name={name} size={size} />
            {withName && <span>{name}</span>}
          </div>
      }
      </HoverCard>
    )
  
  return (
    <>
      {linked
      ?
        <Link to={`/${profileId}`} className={className} onMouseOver={()=>setHover(true)}>
          <AvatarImage url={url} name={name} size={size} />
          {withName && <span>{name}</span>}
        </Link>
      :
        <div onMouseOver={()=>setHover(true)}>
          <AvatarImage url={url} name={name} size={size} />
          {withName && <span>{name}</span>}
        </div>
      }
    </>
  )
}
