import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function PostSkeleton({count = 1}: {count?: number}) {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div className='post' key={i}>
          <header>
            <Skeleton circle width={50} height={50} />
            <div>
              <Skeleton width={350} />
              <Skeleton width={300} />
            </div>
          </header>
          <div>
            <Skeleton height={300} />
          </div>
          <footer>
            <Skeleton width={100} />
            <Skeleton width={150} />
          </footer>
        </div>
      ))}
    </>
  )
}
