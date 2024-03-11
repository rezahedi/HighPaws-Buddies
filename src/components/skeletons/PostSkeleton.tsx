import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function PostSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div className='post' key={i}>
          <header className='flex gap-5 items-center'>
            <Skeleton circle width={50} height={50} />
            <div>
              <Skeleton width={100} />
              <Skeleton width={150} />
            </div>
          </header>
          <div>
            <Skeleton width={'80%'} />
            <Skeleton width={'70%'} />
          </div>
          <div>
            <Skeleton height={300} />
          </div>
          <footer className='flex gap-2 items-center'>
            <Skeleton width={100} />
            <div className='flex-grow'></div>
            <Skeleton width={90} />
            <Skeleton width={120} />
          </footer>
        </div>
      ))}
    </>
  )
}
