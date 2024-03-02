
export default function SidebarBanners() {
  return (
    <nav className='w-[275px] mt-5 sticky h-fit top-5 space-y-5 hidden lg:block'>
      <div className="card rounded-xl overflow-hidden bg-white">
        <img src="https://fakeimg.pl/260x150/61A97E/000" alt="Any Banner" width="100%" />
        <div className="p-5">
          Informative Banner
        </div>
      </div>
      <div className="card rounded-xl overflow-hidden bg-white">
        <img src="https://fakeimg.pl/260x150/fcba03/000" alt="Local Business" width="100%" />
        <div className="p-5 space-y-2">
          <h3 className="text-lg font-semibold">Own a local business?</h3>
          <p>Create a business page to connect with neighbors, post updates in the feed, and gain new customers.</p>
          <button className="w-full">Create Page</button>
        </div>
      </div>
    </nav>
  )
}
