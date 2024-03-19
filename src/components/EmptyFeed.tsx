import { LatestJoined } from "@/components";


export default function EmptyFeed({children}: {children?: React.ReactNode}) {
  return (
    <div className="post sm:p-20 bg-orange-100">
      {children && children}
      {!children &&
        <>
          <h3 className='text-xl font-bold'>Feed is Empty! 🤷‍♂️</h3>
          Post your first one by clicking on the 'Post' button in the sidebar. 👈<br />
          Or start following people to see their posts in your wall.
          <LatestJoined />
        </>
      }
    </div>
  )
}
