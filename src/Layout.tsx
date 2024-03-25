import { ReactNode, Suspense, useState } from 'react';
import { Outlet } from "react-router-dom"
import { Header, SidebarNav, SidebarBanners, Modal, NewPost } from "@/components"
import { Toaster } from "sonner";

export default function Layout({sidebar}: {sidebar?: ReactNode}) {
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  return (
    <>
      <Header />
      <div className='main'>
        {sidebar && sidebar}
        {!sidebar && <SidebarNav setShowModal={setShowNewPostModal} />}
        {showNewPostModal &&
          <Modal onClose={()=>setShowNewPostModal(false)}>
            <NewPost onCancel={()=>setShowNewPostModal(false)} />
          </Modal>
        }
        <main className='wall'>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <SidebarBanners />
      </div>
      <Toaster />
    </>
  )
}
