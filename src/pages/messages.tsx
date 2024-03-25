import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { conversationProp, returnConversationProp } from '@/types/firestore';
import { useNavigate } from 'react-router-dom'
import { useAuth } from "@/providers/auth"
import { EmptyFeed } from '@/components';
import { Conversation } from '@/components/messages';

export default function Messages() {
  const navigate = useNavigate()
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [messages, setMessages] = useState<conversationProp[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const ITEMS_PER_LOAD = 10
  const SKELETON_ITEMS_PER_LOAD = 4
  const [limitCount, setLimitCount] = useState<number>(ITEMS_PER_LOAD)
  const [loadingMore, setLoadingMore] = useState<boolean | null>(true)

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, `profiles/${authProfile.id}/conversations`),
        where('archived', '==', false),
        orderBy('modified_at', 'desc'),
        limit(limitCount)
      ),
      (snapshot) => {
        const docs: conversationProp[] = snapshot.docs.map(doc => returnConversationProp(doc));

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
  }, [authProfile, loadingMore]);

  return (
    <>
      {messages.map((item) =>
        <Conversation key={item.id} doc={item} />
      )}
      {/* {loading && <MessageItemSkeleton count={SKELETON_ITEMS_PER_LOAD} />} */}
      {loading && <div>Loading... {SKELETON_ITEMS_PER_LOAD}</div>}
      {messages.length === 0 && !loading && <EmptyFeed />}
      {!loading && loadingMore!==null && <div className='post'><button onClick={()=>{setLimitCount(limitCount + ITEMS_PER_LOAD);setLoadingMore(true)}}>Show more messages</button></div>}
    </>
  )
}