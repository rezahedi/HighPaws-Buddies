import { Post } from '@/components';

const fakePosts = [
  {
    title: "Morning stroll with Max 🐾",
    imageUrl: "https://fakeimg.pl/400x250/C4B8E4?text=Max",
    likesCount: 120,
    commentsCount: 8,
    date: "2023-03-15",
    user: {
      slug: "max",
      name: "Max",
      avatar: "https://fakeimg.pl/50x50/FFD3E0?text=Max"
    },
    location: "Golden Gate Park, Bay Area"
  },
  {
    title: "Sunny days and sandy paws at Baker Beach ☀️🏖️",
    imageUrl: "https://fakeimg.pl/400x250/B2F5EA?text=Luna",
    likesCount: 98,
    commentsCount: 12,
    date: "2023-05-22",
    user: {
      slug: "luna",
      name: "Luna",
      avatar: "https://fakeimg.pl/50x50/FFDAB9?text=Luna"
    },
    location: "Baker Beach, Bay Area"
  },
  {
    title: "Afternoon playdate with Bailey and friends 🐶🎾",
    imageUrl: "https://fakeimg.pl/400x250/00FFFF?text=Bailey",
    likesCount: 150,
    commentsCount: 5,
    date: "2023-07-10",
    user: {
      slug: "bailey",
      name: "Bailey",
      avatar: "https://fakeimg.pl/50x50/87CEEB?text=Bailey"
    },
    location: "Dog Park, Bay Area"
  },
  {
    title: "Exploring the city vibes with Milo 🏙️🐕",
    imageUrl: "https://fakeimg.pl/400x250/E6E6FA?text=Milo",
    likesCount: 180,
    commentsCount: 15,
    date: "2023-09-05",
    user: {
      slug: "milo",
      name: "Milo",
      avatar: "https://fakeimg.pl/50x50/FFFFE0?text=Milo"
    },
    location: "San Francisco, Bay Area"
  },
  {
    title: "Fall adventures with Cooper in the redwoods 🍁🐾",
    imageUrl: "https://fakeimg.pl/400x250/F08080?text=Cooper",
    likesCount: 130,
    commentsCount: 7,
    date: "2023-10-18",
    user: {
      slug: "cooper",
      user: "Cooper",
      avatar: "https://fakeimg.pl/50x50/00FFFF?text=Cooper"
    },
    location: "Muir Woods, Bay Area"
  },
  {
    title: "Chilly mornings and cuddles with Bella ❄️🐶",
    imageUrl: "https://fakeimg.pl/400x250/FAFAD2?text=Bella",
    likesCount: 200,
    commentsCount: 10,
    date: "2023-12-07",
    user: {
      slug: "bella",
      name: "Bella",
      avatar: "https://fakeimg.pl/50x50/FFDAB9?text=Bella"
    },
    location: "Berkeley, Bay Area"
  },
  {
    title: "Puppy playdate at the Marina Green 🌊🐕",
    imageUrl: "https://fakeimg.pl/400x250/C4B8E4?text=Charlie",
    likesCount: 160,
    commentsCount: 9,
    date: "2024-01-14",
    user: {
      slug: "charlie",
      name: "Charlie",
      avatar: "https://fakeimg.pl/50x50/C4B8E4?text=Charlie"
    },
    location: "Marina District, Bay Area"
  },
  {
    title: "Hiking trails and wagging tails with Daisy 🏞️🐾",
    imageUrl: "https://fakeimg.pl/400x250/E6E6FA?text=Daisy",
    likesCount: 145,
    commentsCount: 11,
    date: "2023-03-02",
    user: {
      slug: "daisy",
      name: "Daisy",
      avatar: "https://fakeimg.pl/50x50/B2F5EA?text=Daisy"
    },
    location: "Mount Tamalpais, Bay Area"
  },
  {
    title: "Weekend vibes with Rocky at Alamo Square 🌆🐶",
    imageUrl: "https://fakeimg.pl/400x250/FFFE00?text=Rocky",
    likesCount: 175,
    commentsCount: 13,
    date: "2023-06-08",
    user: {
      slug: "rocky",
      name: "Rocky",
      avatar: "https://fakeimg.pl/50x50/F08080?text=Rocky"
    },
    location: "Alamo Square, Bay Area"
  },
  {
    title: "Sunset serenity with Sadie by the Bay Bridge 🌅🐕",
    imageUrl: "https://fakeimg.pl/400x250/FAFAD2?text=Sadie",
    likesCount: 190,
    commentsCount: 14,
    date: "2023-08-20",
    user: {
      slug: "sadie",
      name: "Sadie",
      avatar: "https://fakeimg.pl/50x50/FFD3E0?text=Sadie"
    },
    location: "Embarcadero, Bay Area"
  }
];

export default function Public() {

  return (
    <>
      {fakePosts.map((post, index) =>
        <Post key={index} post={post} />
      )}
    </>
  )
}
