

export default function EmptyFeed({children}: {children?: React.ReactNode}) {
  return (
    <div className="post sm:p-20 bg-orange-100">
      {children && children}
      {!children &&
        <>
          <b>Wall is Empty! 🤷‍♂️</b>
          Post the first one by clicking on the 'What's happening?!' above. 👆<br />
          Or start following people to see their posts here. 🤩
        </>
      }
    </div>
  )
}
