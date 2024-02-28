import { profileProp } from "@/types/firestore"
import { useState } from "react"
import { Modal, NewPost } from "@/components"

export default function NewPostBlock( {profile}: {profile: profileProp} ) {
  const [showModal, setShowModal] = useState(false)

  if( profile === null ) return null

  const handleClick = () => {
    console.log('Clicked')
    setShowModal(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if( e.key === 'Enter' || e.key === ' '){
      e.preventDefault()
      console.log('Enter key pressed')
      setShowModal(true)
    }
  }

  return (
    <>
      <div className="flex gap-2 p-5 bg-white cursor-pointer" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} role="button">
        <img src={profile.avatars.buddy} alt="avatar" className="size-12 rounded-full" />
        <div className="flex-grow flex items-center p-2 cursor-text text-gray-500 rounded-md border border-gray-300 bg-gray-100">What's happening?!</div>
      </div>
      {showModal && <Modal onClose={()=>setShowModal(false)}><NewPost onCancel={()=>setShowModal(false)} /></Modal>}
    </>
  )
}
