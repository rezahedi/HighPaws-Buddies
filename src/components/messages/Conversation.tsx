import { conversationProp } from '@/types/firestore';
import { Link } from 'react-router-dom';
import Avatar from '../post/Avatar';
import { formatRelativeDate } from '@/utils';

export default function Conversation({doc}: {doc: conversationProp}) {
  return (
    <Link to={`/messages/${doc.id}`} className={`flex items-center gap-2 p-3 ${doc.new_messages>0 && 'bg-gray-100'}`}>
      <Avatar profileId={doc.with.id} url={doc.with.avatar} name={doc.with.name} linked={false} size='sm' />
      <div className='flex-1'>
        <b>{doc.with.name}</b>
        <div>{doc.last_message}</div>
      </div>
      <div className='flex flex-col items-end gap-2'>
        <time dateTime={doc.modified_at.toDate().toISOString()} className='text-xs opacity-70 italic'>{formatRelativeDate(doc.modified_at.toDate())}</time>
        {doc.new_messages>0 && <span className='bg-primary bg-[#d56a34] text-black text-xs px-2 py-1 rounded-full'>{doc.new_messages}</span>}
      </div>
    </Link>
  )
}
