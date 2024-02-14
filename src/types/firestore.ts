import { DocumentReference, DocumentSnapshot } from "firebase/firestore";

export type postProp = {
  id: string;
  title: string;
  media_url: string;
  location: string;
  private: boolean;
  profile_detail: {
    avatar_url: string;
    name: string;
  }
  profile_id: DocumentReference;
  published_at: number;
  stats: {
    likes: number;
    comments: number;
  }
};

export type profileProp = {
  id: string;
  name: string;
  owner: string;
  avatars: {
    buddy: string;
    owner: string;
  }
  gender: string;
  breed: string;
  age: string;
  weight: string;
  location: string;
  characteristics: string[];
  stats: {
    followers: number;
    following: number;
    posts: number;
  }
  public: boolean;
};

export function returnPostProp(doc: DocumentSnapshot): postProp {
  if( !doc.exists() ) return {} as postProp
  return {
    id: doc.id,
    title: doc.data().title,
    media_url: doc.data().media_url,
    location: doc.data().location,
    private: doc.data().private,
    profile_detail: doc.data().profile_detail,
    profile_id: doc.data().profile_id,
    published_at: doc.data().published_at,
    stats: doc.data().stats,
  }
}

export function returnProfileProp(doc: DocumentSnapshot): profileProp | null {
  if( !doc.exists() ) return null
  return {
    id: doc.id,
    name: doc.data().name,
    owner: doc.data().owner,
    avatars: doc.data().avatars,
    gender: doc.data().gender,
    breed: doc.data().breed,
    age: doc.data().age,
    weight: doc.data().weight,
    location: doc.data().location,
    characteristics: doc.data().characteristics,
    stats: doc.data().stats,
    public: doc.data().public,
  }
}