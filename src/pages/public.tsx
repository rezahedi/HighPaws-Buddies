import { useEffect, useState } from 'react';
import { Post } from '@/components';
import { db } from '@/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { postProp, returnPostProp } from '@/types/firestore';


/*
title: "Morning stroll with Max 🐾",
imageUrl: "https://fakeimg.pl/400x250/C4B8E4?text=Max",
name: "Max",
avatar: "https://fakeimg.pl/50x50/FFD3E0?text=Max"
location: "Golden Gate Park, Bay Area"

title: "Sunny days and sandy paws at Baker Beach ☀️🏖️",
imageUrl: "https://fakeimg.pl/400x250/B2F5EA?text=Luna",
name: "Luna",
avatar: "https://fakeimg.pl/50x50/FFDAB9?text=Luna"
location: "Baker Beach, Bay Area"

title: "Afternoon playdate with Bailey and friends 🐶🎾",
imageUrl: "https://fakeimg.pl/400x250/00FFFF?text=Bailey",
name: "Bailey",
avatar: "https://fakeimg.pl/50x50/87CEEB?text=Bailey"
location: "Dog Park, Bay Area"

title: "Exploring the city vibes with Milo 🏙️🐕",
imageUrl: "https://fakeimg.pl/400x250/E6E6FA?text=Milo",
name: "Milo",
avatar: "https://fakeimg.pl/50x50/FFFFE0?text=Milo"
location: "San Francisco, Bay Area"

title: "Fall adventures with Cooper in the redwoods 🍁🐾",
imageUrl: "https://fakeimg.pl/400x250/F08080?text=Cooper",
user: "Cooper",
avatar: "https://fakeimg.pl/50x50/00FFFF?text=Cooper"
location: "Muir Woods, Bay Area"

title: "Chilly mornings and cuddles with Bella ❄️🐶",
imageUrl: "https://fakeimg.pl/400x250/FAFAD2?text=Bella",
name: "Bella",
avatar: "https://fakeimg.pl/50x50/FFDAB9?text=Bella"
location: "Berkeley, Bay Area"

title: "Puppy playdate at the Marina Green 🌊🐕",
imageUrl: "https://fakeimg.pl/400x250/C4B8E4?text=Charlie",
name: "Charlie",
avatar: "https://fakeimg.pl/50x50/C4B8E4?text=Charlie"
location: "Marina District, Bay Area"

title: "Hiking trails and wagging tails with Daisy 🏞️🐾",
imageUrl: "https://fakeimg.pl/400x250/E6E6FA?text=Daisy",
name: "Daisy",
avatar: "https://fakeimg.pl/50x50/B2F5EA?text=Daisy"
location: "Mount Tamalpais, Bay Area"

title: "Weekend vibes with Rocky at Alamo Square 🌆🐶",
imageUrl: "https://fakeimg.pl/400x250/FFFE00?text=Rocky",
name: "Rocky",
avatar: "https://fakeimg.pl/50x50/F08080?text=Rocky"
location: "Alamo Square, Bay Area"

title: "Sunset serenity with Sadie by the Bay Bridge 🌅🐕",
imageUrl: "https://fakeimg.pl/400x250/FAFAD2?text=Sadie",
name: "Sadie",
avatar: "https://fakeimg.pl/50x50/FFD3E0?text=Sadie"
location: "Embarcadero, Bay Area"
*/

export default function Public() {

  const [posts, setPosts] = useState<postProp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // snapshot listener to get real-time updates from the firestore posts collection with where filter for public posts
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'posts'),
        where('private', '==', false),
        orderBy('published_at', 'desc'),
        limit(10)
      ),
      (snapshot) => {
        const docs: postProp[] = snapshot.docs.map(doc => returnPostProp(doc));
        setPosts(docs);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <>
      {loading && <p>Loading...</p>}
      {posts.map((post, index) =>
        <Post key={index} post={post} />
      )}
    </>
  )
}
