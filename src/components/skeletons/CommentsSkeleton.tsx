import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function CommentsSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="comment border-gray-200">
          <a>
            <Skeleton circle width={36} height={36} />
            <Skeleton width={60} />
          </a>
          <p>
            <Skeleton width={'90%'} />
            <Skeleton width={'70%'} />
          </p>
          <time>
            <Skeleton width={80} />
          </time>
        </div>
      ))}
    </>
  )
}
