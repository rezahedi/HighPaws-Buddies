import { DocumentReference, DocumentSnapshot, Timestamp } from "firebase/firestore";

export type newPostProp = {
  title: string;
  media_url: string;
  location: string;
  private: boolean;
  profile_detail: {
    avatar_url: string;
    name: string;
  }
  profile_id: DocumentReference;
  published_at: Timestamp;
  stats: {
    likes: number;
    comments: number;
  }
  liked: boolean;
};

export type postProp = newPostProp & {
  id: string;
};

export type newProfileProp = {
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

export type profileProp = newProfileProp & {
  id: string;
};

export type newCommentProp = {
  comment: string;
  created_at: Timestamp;
  profile_id: DocumentReference;
  avatar: string;
  name: string;
};

export type commentProp = newCommentProp & {
  id: string;
}

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
    liked: doc.data().liked,
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

export function returnCommentProp(doc: DocumentSnapshot): commentProp {
  if( !doc.exists() ) return {} as commentProp
  return {
    id: doc.id,
    comment: doc.data().comment,
    created_at: doc.data().created_at,
    profile_id: doc.data().profile_id,
    avatar: doc.data().avatar,
    name: doc.data().name,
  }
}

/**
 * Notifications
 */
export type newNotificationProp = {
  message: string;
  link: string;
  profile_id: DocumentReference;
  avatar: string;
  name: string;
  published_at: Timestamp;
  seen: boolean;
  archived: boolean;
};

export type notificationProp = newNotificationProp & {
  id: string;
}

export function returnNotificationProp(doc: DocumentSnapshot): notificationProp {
  if( !doc.exists() ) return {} as notificationProp
  return {
    id: doc.id,
    message: doc.data().message,
    link: doc.data().link,
    profile_id: doc.data().profile_id,
    avatar: doc.data().avatar,
    name: doc.data().name,
    published_at: doc.data().published_at,
    seen: doc.data().seen,
    archived: doc.data().archive,
  }
}