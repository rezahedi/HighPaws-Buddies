import { messageProp } from "@/types/firestore"
import Avatar from "@/components/post/Avatar"
import { formatRelativeDate } from "@/utils"

type withProfileProp = {
  id: string,
  name: string,
  avatar: string
}

export default function Message({msg, from}: {msg: messageProp, from: withProfileProp}) {
  const left = msg.direction=='in' ? true : false

  return (
    <div className={
      left
      ? 'text-left'
      : 'text-right'
    }>
      <div className={
        left
        ? 'flex gap-2 flex-row'
        : 'flex gap-2 flex-row-reverse'
      }>
        {left &&
          <Avatar profileId={from.id} url={from.avatar} name={from.name} size='sm' className="size-9 inline-block" />
        }
        <div className={
          left
          ? 'max-w-[65vw] bg-[#d56a34]    text-white rounded-tl-none sm:max-w-sm md:max-w-md flex flex-col gap-1 px-4 py-2 rounded-xl'
          : 'max-w-[80vw] bg-[#d56a34]/20 text-black rounded-tr-none sm:max-w-sm md:max-w-md flex flex-col gap-1 px-4 py-2 rounded-xl'
        }>
          <span className="text-left">{msg.message}</span>
          <time
            dateTime={msg.published_at.toDate().toISOString()}
            className='text-xs opacity-70 italic'
          >
            {formatRelativeDate(msg.published_at.toDate())}
          </time>
        </div>
      </div>
    </div>
  )
}
