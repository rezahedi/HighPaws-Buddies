import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProfileSkeleton() {
  return (
    <>
      <section className="avatar">
        <Skeleton circle width={96} height={96} />
        <Skeleton height={20} width={100} />
      </section>
      <section className="stats">
        <Skeleton width={100} />
        <Skeleton width={100} />
        <Skeleton width={80} />
      </section>
      <section className="detail">
        <Skeleton width={100} />
        <Skeleton width={100} />
        <Skeleton width={100} />
        <Skeleton width={100} />
      </section>
    </>
  )
}
