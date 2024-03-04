import { useEffect } from "react"
import { Close } from "@/components/icons"

export default function Modal({ onClose: closeModal, className, children }: { onClose: () => void, className?: string, children: React.ReactNode }) {

  useEffect(() => {
    const modal = document.querySelector('.modal')
    const handleKeyDown = (e: KeyboardEvent) => {
      if( e.key === 'Escape' )
        closeModal()
    }
    const handleClickOutside = (e: MouseEvent) => {
      if( modal && !modal.contains(e.target as Node) )
        closeModal()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div className='overlay'>
      <div className='modal'>
        <button className='close' onClick={closeModal}><Close /></button>
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  )
}
