export function getBuddyAvatar() {
  const randomNumber = Math.floor(Math.random() * 40) + 1
  return `${import.meta.env.VITE_BASE_COMPLETE_URL}/buddies/${randomNumber.toString().padStart(2, '0')}.jpg`
}

export function getOwnerAvatar() {
  const randomNumber = Math.floor(Math.random() * 17) + 1
  return `${import.meta.env.VITE_BASE_COMPLETE_URL}/people/${randomNumber.toString().padStart(2, '0')}.jpg`
}