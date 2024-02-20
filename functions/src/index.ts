// See a full list of supported triggers at https://firebase.google.com/docs/functions
import {
  // onDocumentWritten,
  onDocumentCreated,
  onDocumentUpdated,
  onDocumentDeleted,
  // Change,
  // FirestoreEvent,
} from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

export const increaseFollowingStat =
  onDocumentCreated("profiles/{profileId}/following/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Increase stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.following": FieldValue.increment(1),
    });
  });

export const increaseFollowerStat =
  onDocumentCreated("profiles/{profileId}/followers/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Increase stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.followers": FieldValue.increment(1),
    });
  });

export const decreaseFollowingStat =
  onDocumentDeleted("profiles/{profileId}/following/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Decrease stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.following": FieldValue.increment(-1),
    });
  });

export const decreaseFollowerStat =
  onDocumentDeleted("profiles/{profileId}/followers/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Decrease stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.followers": FieldValue.increment(-1),
    });
  });


// Post stats increase
export const increasePostStat = onDocumentCreated("profiles/{profileId}/posts/{postId}", (event) => {
  const profileId = event.params.profileId;
  const profileRef = db.doc(`profiles/${profileId}`);
  profileRef.update({
    "stats.posts": FieldValue.increment(1),
  });
});

// Post stats decrease
export const decreasePostStat = onDocumentDeleted("profiles/{profileId}/posts/{postId}", (event) => {
  const profileId = event.params.profileId;
  const profileRef = db.doc(`profiles/${profileId}`);
  profileRef.update({
    "stats.posts": FieldValue.increment(-1),
  });
});

// Fanout post to followers feed
export const fanoutPost = onDocumentCreated(`profiles/{profileId}/posts/{postId}`, (event) => {
  const postDoc = event.data;
  if (!postDoc) return

  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const followersRef = db.collection(`profiles/${profileId}/followers`);
  
  // TODO: Add a limit in getting followers id, to make fanout in small batches like 500 followers at a time
  // And keep track of the followers batches in a separate collection like profiles/:profileId/followersBatches

  // Get list of followers id from profiles/:profileId/followers and fanout created post to their feed
  followersRef.get().then((querySnapshot) => {
    const bulkWriter = db.bulkWriter()

    // Write to user's self feed first!
    const selfFeedRef = db.doc(`profiles/${profileId}/feed/${postId}`);
    bulkWriter.set(selfFeedRef, postDoc.data());

    // Write to followers feed
    querySnapshot.forEach((doc) => {
      const followerId = doc.id;
      const followerFeedRef = db.doc(`profiles/${followerId}/feed/${postId}`);
      bulkWriter.set(followerFeedRef, postDoc.data());
    });
    bulkWriter.close();
  });
})

// Unfanout post from followers feed when post is deleted
export const unfanoutPost = onDocumentDeleted(`profiles/{profileId}/posts/{postId}`, (event) => {
  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const followersRef = db.collection(`profiles/${profileId}/followers`);
  followersRef.get().then((querySnapshot) => {
    const bulkWriter = db.bulkWriter()

    // Delete from user's self feed first!
    const selfFeedRef = db.doc(`profiles/${profileId}/feed/${postId}`);
    bulkWriter.delete(selfFeedRef);

    // Delete from followers feed
    querySnapshot.forEach((doc) => {
      const followerId = doc.id;
      const followerFeedRef = db.doc(`profiles/${followerId}/feed/${postId}`);
      bulkWriter.delete(followerFeedRef);
    });
    bulkWriter.close();
  });
})

// TODO: What if fanout stats update every 1 hours, instead of real-time update?
// To reduce the number of writes to the database!

// fanout post's stats fields update only to followers feed
export const updateFanoutPost = onDocumentUpdated(`profiles/{profileId}/posts/{postId}`, (event) => {
  const postDoc = event.data;
  if (!postDoc) return

  const beforeData = postDoc.before.data();
  const afterData = postDoc.after.data();
  if (beforeData === undefined || afterData === undefined) return

  if(beforeData.stats.likes === afterData.stats.likes && beforeData.stats.comments === afterData.stats.comments) return

  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const followersRef = db.collection(`profiles/${profileId}/followers`);
  followersRef.get().then((querySnapshot) => {
    const bulkWriter = db.bulkWriter()

    // Update user's self feed first!
    const selfFeedRef = db.doc(`profiles/${profileId}/feed/${postId}`);
    bulkWriter.update(selfFeedRef, {
      "stats": afterData.stats
    });

    // Update followers feed
    querySnapshot.forEach((doc) => {
      const followerId = doc.id;
      const followerFeedRef = db.doc(`profiles/${followerId}/feed/${postId}`);
      bulkWriter.update(followerFeedRef, {
        "stats": afterData.stats
      });
    });
    bulkWriter.close();
  });
})


// Update post stats when a new comment is added
export const increasePostCommentStat = onDocumentCreated(`profiles/{profileId}/posts/{postId}/comments/{commentId}`, (event) => {
  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const profileRef = db.doc(`profiles/${profileId}/posts/${postId}`);
  profileRef.update({
    "stats.comments": FieldValue.increment(1),
  });
})

// Update post stats when a comment is deleted
export const decreasePostCommentStat = onDocumentDeleted(`profiles/{profileId}/posts/{postId}/comments/{commentId}`, (event) => {
  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const profileRef = db.doc(`profiles/${profileId}/posts/${postId}`);
  profileRef.update({
    "stats.comments": FieldValue.increment(-1),
  });
})

// Update post stats when a new like is added
export const increasePostLikeStat = onDocumentCreated(`profiles/{profileId}/posts/{postId}/likes/{likeId}`, (event) => {
  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const profileRef = db.doc(`profiles/${profileId}/posts/${postId}`);
  profileRef.update({
    "stats.likes": FieldValue.increment(1),
  });
})

// Update post stats when a like is deleted
export const decreasePostLikeStat = onDocumentDeleted(`profiles/{profileId}/posts/{postId}/likes/{likeId}`, (event) => {
  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const profileRef = db.doc(`profiles/${profileId}/posts/${postId}`);
  profileRef.update({
    "stats.likes": FieldValue.increment(-1),
  });
})