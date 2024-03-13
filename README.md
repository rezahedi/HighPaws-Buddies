# A cool project about our furry buddies!

I'm going to build a social media app for our lovely buddies 🐕‍🦺, our dogs. It comes to my mind when I was walking puppy Bjørn to the dog park for a playdate. I was wondering are there bigger dogs in the park, or is it allowed for off-leash play? I thought it would be cool to have an app where I can check the dog parks, see other dogs, and any useful information related to our friends. I'm going to build this app and share the journey with you. I hope it come out as I imagine it. 😀🤞

I'm using Vite, React, TypeScript, and Firebase tech stacks for Auth, database and CDN.


## Roadmap

I don't have a clear roadmap yet, I just follow the "keep it simple", but I'm going to update this section as I go. Here are some of the things I'm going to do:

- [x] Create NewPost page or component, so I can add fake data
- [x] Use Firebase Storage to upload Images and Videos
- [x] Implement Firebase authentication
- [x] Use Firebase Functions to fanout data
- [ ] Create a schema for the data model, hierarchy of subcollections and documents, and the data types in a file called `schema.ts`
- [x] Create a modal dialog to show followers, following
- [x] Figure out `like/unlike` logic
- [ ] Notifications subcollection /profiles/{profileId}/notifications/ for likes, comments, and follows or for specified followed users
- [ ] Find a way to optimize stats fanout to scale, maybe throttling the fanout!
- [ ] Code splitting and lazy loading components for better performance
- [ ] Security: Firebase Rules, Forms validation, and error handling
- [ ] Reply to comments, or nested comments, notifications
- [ ] Multiple images upload, and carousel for the post
- [ ] Video upload and play in the post
- [ ] Post types: Lost and Found, Adoption, Playdate, Poll, and General
- [ ] Groups [Packs]
- [ ] Chat
- [ ] Places and Businesses with geo queries
- [x] HoverCard for user profile
- [ ] Dark mode
- [x] Pagination or infinite scroll (For the feed, comments, likes, or followers)

## Firebase Emulators for local development

Used Firebase emulators for local development and to persist data in the Firestore, Auth & Storage emulators I used export import approuch.

To export/import data in `/firebase-export` I used the following commands and added them to the `package.json` scripts section for easy access.

```bash
{
  "scripts": {
    "emulators:start": "firebase emulators:start --import ./firebase-export/ --export-on-exit ./firebase-export/"
  }
}
```

Any contributions are welcome! 🙏