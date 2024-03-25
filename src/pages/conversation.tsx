import { useEffect, useState, useRef } from 'react';
import { db } from '@/firebase';
import { onSnapshot, query, collection, orderBy, limit, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from "@/providers/auth";
import { messageProp, returnMessageProp } from '@/types/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { Message, NewMessage } from '@/components/messages';
import { Back, Loading } from '@/components/icons';
import Avatar from '@/components/post/Avatar';

type withProfileProp = {
  id: string,
  name: string,
  avatar: string
}

export default function Conversation() {
  const { conversationId } = useParams()
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<messageProp[]>([]);
  const [withProfile, setWithProfile] = useState<withProfileProp | null>(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(true);
  const ITEMS_PER_LOAD = 8
  const [limitCount, setLimitCount] = useState<number>(ITEMS_PER_LOAD)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)
  const chat = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    (async () => {
      const docRef = doc(db, `profiles/${conversationId}`)
      const res = await getDoc(docRef)
      if ( !res.exists() ) return navigate('/messages')
      setWithProfile({
        id: res.id,
        name: res.data().name,
        avatar: res.data().avatars.buddy
      })

      // Mark conversation as seen
      const conversationRef = doc(db, `profiles/${authProfile.id}/conversations/${conversationId}`)
      updateDoc(conversationRef, {
        new_messages: 0
      })
    })()
  }, [authProfile]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${authProfile.id}/conversations/${conversationId}/messages`),
        orderBy('published_at', 'desc'),
        limit(limitCount)
      ),
      (snapshot) => {        
        const docs: messageProp[] = snapshot.docs.map(doc => returnMessageProp(doc));

        // Reverse the order for UI, so the latest message is at the bottom
        docs.reverse()

        if( docs.length == limitCount ) {
          setLoadingMore(false);

        } else {
          // Null means no more data to load
          setLoadingMore(null);
        }
        setLoading(false);
        setMessages(docs)
      }
    );
    return () => unsubscribe();
  }, [withProfile, loadingMore]);

  // Scroll to bottom of chat on each new message if user is already at the bottom
  useEffect(() => {
    if (chat.current && chat.current.scrollTop > chat.current.scrollHeight - 50) {
      chat.current.scrollTop = chat.current.scrollHeight
    }

    // TODO: Mark conversation as seen because user is viewing it!

  }, [messages]);

  if (authProfile === null || withProfile === null) return null

  return (
    <>
      <header className="flex gap-2 items-center justify-between m-3">
        <h3 className="font-semibold text-lg">
          <Avatar url={withProfile.avatar} name={withProfile.name} profileId={withProfile.id} withName linked={false} className="flex flex-row items-center gap-2 font-semibold" />
        </h3>
        <button title="Back" className="border-none" onClick={()=>navigate('/messages')}>
          <Back className="size-6" />
        </button>
      </header>
      <div ref={chat} className='h-[calc(100vh-262px)] sm:h-[calc(100vh-200px)] p-3 flex-1 overflow-y-auto space-y-3'>
        {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount + ITEMS_PER_LOAD);setLoadingMore(true)}}>Show more messages</button></div>}
        {loading && <div className='flex justify-center'><Loading className='flex justify-center size-8 text-[#f06a1d]' /></div>}
        {messages.map((item) =>
          <Message key={item.id} msg={item} from={withProfile} />
        )}
        {messages.length === 0 && !loading && <>No Messages!</>}
      </div>
      {conversationId && <NewMessage conversationId={conversationId} profileId={authProfile.id} />}
    </>
  )
}
