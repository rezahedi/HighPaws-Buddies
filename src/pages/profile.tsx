import { useParams } from "react-router-dom"
import '@/styles/Profile.css'
import { useState } from 'react'
import { Post } from "@/components"

export default function Profile() {
  const [switched, setSwitched] = useState<boolean>(false)
  const { userHandler } = useParams()

  const profile = {
    name: "Charlie",
    avatar: "https://fakeimg.pl/50x50/C4B8E4?text=Charlie",
    stats: {
      followers: 120,
      following: 167,
      posts: 23
    },
    birthday: "2019-01-14",
    weight: '12 lbs',
    breed: 'Golden Retriever',
    location: 'Berkeley, Bay Area',
    characteristics: ['Friendly', 'Playful', 'Energetic'],
    owner: {
      name: 'Alex',
      avatar: 'https://fakeimg.pl/50x50/FFD3E0?text=Alex'
    }
  }

  const posts = [
    {
      title: "Puppy playdate at the Marina Green 🌊🐕",
      imageUrl: "https://fakeimg.pl/400x250/C4B8E4?text=Charlie",
      likesCount: 160,
      commentsCount: 9,
      date: "2024-01-14",
      location: "Marina District, Bay Area"
    },
    {
      title: "Hiking trails and wagging tails with Daisy 🏞️🐾",
      imageUrl: "https://fakeimg.pl/400x250/E6E6FA?text=Daisy",
      likesCount: 145,
      commentsCount: 11,
      date: "2023-03-02",
      location: "Mount Tamalpais, Bay Area"
    },
    {
      title: "Weekend vibes with Rocky at Alamo Square 🌆🐶",
      imageUrl: "https://fakeimg.pl/400x250/FFFE00?text=Rocky",
      likesCount: 175,
      commentsCount: 13,
      date: "2023-06-08",
      location: "Alamo Square, Bay Area"
    },
    {
      title: "Sunset serenity with Sadie by the Bay Bridge 🌅🐕",
      imageUrl: "https://fakeimg.pl/400x250/FAFAD2?text=Sadie",
      likesCount: 190,
      commentsCount: 14,
      date: "2023-08-20",
      location: "Embarcadero, Bay Area"
    }
  ]

  const handleSwitch = () => {
    setSwitched(!switched)
  }

  return (
    <div className="profile">{userHandler}
      <section className="avatar">
        <figure onClick={handleSwitch} className={switched?`switched`:``}>
          <img className="pet" src={profile.avatar} alt={profile.name} />
          <img className="owner" src={profile.owner.avatar} alt={profile.owner.name} />
        </figure>
        <h2>{profile.name}</h2>
      </section>
      <section className="stats">
        <a href="#">{profile.stats.followers} followers</a>
        <a href="#">{profile.stats.following} following</a>
        <a href="#">{profile.stats.posts} posts</a>
      </section>
      <section className="detail">
        <div>🎂 {profile.birthday}</div>
        <div>⚖️ {profile.weight}</div>
        <div>🐶 {profile.breed}</div>
        <div>📌 {profile.location}</div>
      </section>
      <section className="tags">
        {profile.characteristics.map((characteristic, index) => (
          <a key={index} href="#">{characteristic}</a>
        ))}
      </section>
      {posts.map((post, index) => (
        <Post key={index} post={post} />
      ))}
    </div>
  )
}
