import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function NotificationsSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div className='notificationItem seen' key={i}>
          <div>
            <Skeleton circle width={36} height={36} />
            <p>
              <Skeleton width={220} />
              <Skeleton width={70} />
            </p>
          </div>
          <Skeleton width={80} height={30} />
        </div>
      ))}
    </>
  )
}
