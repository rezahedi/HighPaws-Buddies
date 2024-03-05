import { Suspense, useState } from 'react';
import { Outlet } from "react-router-dom"
import { Header, SidebarNav, SidebarBanners, Modal, NewPost } from "@/components"

export default function Layout() {
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  return (
    <>
      <Header />
      <div className='main'>
        <SidebarNav setShowModal={setShowNewPostModal} />
        {showNewPostModal &&
          <Modal onClose={()=>setShowNewPostModal(false)}>
            <NewPost onCancel={()=>setShowNewPostModal(false)} />
          </Modal>
        }
        <main className='wall'>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
          <div className='h-24'></div>
        </main>
        <SidebarBanners />
      </div>
    </>
  )
}
