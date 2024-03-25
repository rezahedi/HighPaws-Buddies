import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function MessagesSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2 text-sm">
          <a>
            <Skeleton circle width={36} height={36} />
          </a>
          <div className='flex-1'>
            <Skeleton width={80} />
            <p>
              <Skeleton width='70%' />
            </p>
          </div>
          <Skeleton width={60} />
        </div>
      ))}
    </>
  )
}
