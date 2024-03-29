import { profileProp } from "@/types/firestore"

export default function NewPostBlock(
  {profile, onClick: setShowModal}:
  {profile: profileProp | null, onClick: (value: boolean) => void}
) {

  const handleClick = () => {
    setShowModal(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if( e.key === 'Enter' || e.key === ' '){
      e.preventDefault()
      setShowModal(true)
    }
  }

  return (
    <div className="flex gap-2 p-5 bg-white cursor-pointer" onClick={handleClick} onKeyDown={handleKeyDown} tabIndex={0} role="button">
      <img src={profile?.avatars.buddy} alt="avatar" className="size-12 rounded-full" />
      <div className="flex-grow flex items-center p-2 cursor-text text-gray-500 rounded-md border border-gray-300 bg-gray-100 hover:border-gray-500">What's happening?!</div>
    </div>
  )
}
