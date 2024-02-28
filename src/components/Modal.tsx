import { useEffect } from "react"

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
    <div className='overlay z-10 fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center'>
      <div className='modal bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-full sm:w-auto'>
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  )
}
