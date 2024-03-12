type sizeOptions = 'bg' | 'base' | 'sm' | 'xs'

const sizeOptionsRem: {[key: string]: string} = {
  bg: '5rem',
  base: '3rem',
  sm: '2.25rem',
  xs: '2rem'
}
const sizeOptionsClass: {[key: string]: string} = {
  bg: 'size-20',
  base: 'size-12',
  sm: 'size-9',
  xs: 'size-8'
}

export default function AvatarImage ({url, name, size='base'} :{url: string, name: string, size?: sizeOptions}) {
  // Name only
  if( url === '' ) return <>{name}</>

  // Image only
  return (
    <img
      src={url}
      alt={name}
      width={sizeOptionsRem[size]}
      height={sizeOptionsRem[size]}
      loading='lazy'
      className={`rounded-full ${sizeOptionsClass[size]}`}
    />
  )
}
