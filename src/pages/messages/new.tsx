import { Back } from "@/components/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import { returnTidyProfileProp, tidyProfileProp } from "@/types/firestore";
import { db } from "@/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import Avatar from "@/components/post/Avatar";

export default function New() {
  const navigate = useNavigate()
  const { profile: authProfile, loading: authLoading } = useAuth()
  const [ allDocs, setAllDocs ] = useState<tidyProfileProp[]>([])
  const [ filteredDocs, setFilteredDocs ] = useState<tidyProfileProp[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    if( authProfile === null && authLoading === false ) return navigate('/login')
  }, [authProfile, authLoading]);

  useEffect(() => {
    if( !authProfile ) return

    setLoading(true);
    (async ()=>{
      const collectionRef = collection(db, `profiles/${authProfile.id}/following`)
      const q = query(collectionRef, orderBy('name'))
      const querySnapshot = await getDocs(q)
      const docs: tidyProfileProp[] = querySnapshot.docs.map(doc => returnTidyProfileProp(doc))
      setAllDocs(docs)
      setFilteredDocs(docs)
    })()
    setLoading(false)
  }, [authProfile]);

  useEffect(() => {
    if( search === '' ) return

    setFilteredDocs(
      allDocs.filter(profile => profile.name.toLowerCase().includes(search.toLowerCase()))
    )
  }, [search]);


  return (
    <>
      <header className="flex gap-2 items-center justify-between m-3">
        <h3 className="font-semibold text-lg">New conversation</h3>
        <button title="Back" className="border-none" onClick={()=>navigate('/messages')}>
          <Back className="size-7" />
        </button>
      </header>
      <main className="p-3">
        <div className="flex gap-3">
          <input type="text" className="flex-1 border p-2" autoFocus placeholder="Search for a user" onChange={(e) => setSearch(e.target.value)} />
        </div>
        {loading && <div>Loading Profiles ...</div>}
        <div className="flex gap-2 flex-wrap">
          {filteredDocs && filteredDocs.map((item: tidyProfileProp) =>
            <Link to={`/messages/${item.id}`} key={item.id} className="btn flex gap-2 items-center mt-3">
              <div className="flex gap-2 flex-1">
                <Avatar url={item.avatar} name={item.name} profileId={item.id} withName linked={false} className="flex flex-row items-center gap-2 font-semibold" />
              </div>
            </Link>
          )}
        </div>
      </main>
    </>
  )
}
