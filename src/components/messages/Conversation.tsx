import { conversationProp } from '@/types/firestore';
import { Link } from 'react-router-dom';
import Avatar from '../post/Avatar';
import { formatRelativeDate } from '@/utils';

export default function Conversation({doc}: {doc: conversationProp}) {
  const unseen = doc.new_messages>0 ? true : false

  return (
    <Link to={`/messages/${doc.id}`} className={`flex items-center gap-2 p-3 hover:no-underline hover:bg-[#d56a34]/20 transition-all duration-200 ${unseen && 'bg-gray-100'}`}>
      <Avatar profileId={doc.with.id} url={doc.with.avatar} name={doc.with.name} linked={false} size='sm' />
      <div className='flex-1'>
        <b>{doc.with.name}</b>
        <div className={`line-clamp-1 ${unseen && 'font-semibold'}`}>{doc.last_message}</div>
      </div>
      <div className='flex flex-col items-end gap-2'>
        <time dateTime={doc.modified_at.toDate().toISOString()} className='text-xs opacity-70 italic'>{formatRelativeDate(doc.modified_at.toDate())}</time>
        {doc.new_messages>0 && <span className='bg-primary bg-[#d56a34] text-black text-xs px-2 py-1 rounded-full'>{doc.new_messages}</span>}
      </div>
    </Link>
  )
}
