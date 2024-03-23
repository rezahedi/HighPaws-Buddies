import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { onSnapshot, query, collection, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { useAuth } from "@/providers/auth";
import { messageProp, returnMessageProp } from '@/types/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { Message, NewMessage } from '@/components/messages';

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
  const ITEMS_PER_LOAD = 20
  const SKELETON_ITEMS_PER_LOAD = 6
  const [limitCount, setLimitCount] = useState<number>(ITEMS_PER_LOAD)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    (async () => {
      const docRef = doc(db, `profiles/${authProfile.id}/conversations/${conversationId}`)
      const withProfile = await getDoc(docRef)
      if ( !withProfile.exists() ) return navigate('/messages')
      setWithProfile({
        id: withProfile.data().with.id.id,
        name: withProfile.data().with.name,
        avatar: withProfile.data().with.avatar
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
  }, [withProfile]);

  if (authProfile === null || withProfile === null) return null

  return (
    <div>
      {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount + ITEMS_PER_LOAD);setLoadingMore(true)}}>Show more messages</button></div>}
      {/* {loading && <MessageItemSkeleton count={SKELETON_ITEMS_PER_LOAD} />} */}
      {loading && <div>Loading... {SKELETON_ITEMS_PER_LOAD}</div>}
      {messages.map((item) =>
        <Message key={item.id} msg={item} from={withProfile} />
      )}
      {messages.length === 0 && !loading && <>No Messages!</>}
      {conversationId && <NewMessage conversationId={conversationId} profileId={'1'} />}
    </div>
  )
}
