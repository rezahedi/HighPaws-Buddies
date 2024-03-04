import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function UserListInModalSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div className='item' key={i}>
          <a>
            <Skeleton circle width={36} height={36} />
            <Skeleton width={100} />
          </a>
          <Skeleton width={80} height={30} />
        </div>
      ))}
    </>
  )
}
