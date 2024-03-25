import { messageProp } from "@/types/firestore"
import Avatar from "@/components/post/Avatar"
import { formatRelativeDate } from "@/utils"

type withProfileProp = {
  id: string,
  name: string,
  avatar: string
}

export default function Message({msg, from}: {msg: messageProp, from: withProfileProp}) {
  return (
    <div className={msg.direction=='in' ? 'text-left' : 'text-right'}>
      <div className={`flex gap-2 ${msg.direction=='in' ? 'flex-row' : 'flex-row-reverse'}`}>
        {msg.direction=='in' &&
          <Avatar profileId={from.id} url={from.avatar} name={from.name} size='sm' />
        }
        <div className={`flex flex-col px-4 py-2 rounded-xl ${msg.direction=='in' ? 'bg-[#d56a34] text-white rounded-tl-none' : 'bg-[#d56a34]/20 text-black rounded-tr-none'}`}>
          <span>{msg.message}</span>
          <time dateTime={msg.published_at.toDate().toISOString()} className='text-xs opacity-70 italic'>{formatRelativeDate(msg.published_at.toDate())}</time>
        </div>
      </div>
    </div>
  )
}
