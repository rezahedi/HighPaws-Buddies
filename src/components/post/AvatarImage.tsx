type sizeOptions = 'big' | 'base' | 'small'

const sizeOptionsRem: {[key: string]: string} = {
  big: '5rem',
  base: '3rem',
  small: '2.25rem'
}
const sizeOptionsClass: {[key: string]: string} = {
  big: 'size-20',
  base: 'size-12',
  small: 'size-9'
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
