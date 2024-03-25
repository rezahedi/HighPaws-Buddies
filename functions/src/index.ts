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


/**
 * Notifications
 */
// Notify post's owner for each new comments added
export const notifyOwnerNewComment = onDocumentCreated(`profiles/{profileId}/posts/{postId}/comments/{commentId}`, (event) => {
  const commentDoc = event.data;
  if (!commentDoc) return

  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const commentData = commentDoc.data();

  // Do nothing if comment is from the post's owner
  if (commentData.profile_id.id === profileId) return

  const notificationsCollectionRef = db.collection(`profiles/${profileId}/notifications`);
  const notification = {
    message: `${commentData.name} commented on your post`,
    link: `/${profileId}/${postId}#${commentDoc.id}`,
    profile_id: commentData.profile_id,
    avatar: commentData.avatar,
    name: commentData.name,
    seen: false,
    archived: false,
    published_at: FieldValue.serverTimestamp(),
  }
  return notificationsCollectionRef.add(notification);
})

// Notify post's owner for each new like added
export const notifyOwnerNewLike = onDocumentCreated(`profiles/{profileId}/posts/{postId}/likes/{likeId}`, (event) => {
  const likeDoc = event.data;
  if (!likeDoc) return

  const profileId = event.params.profileId;
  const postId = event.params.postId;
  const likeData = likeDoc.data();
  
  // Do nothing if like is from the post's owner
  if (likeData.id.id === profileId) return

  const notificationsCollectionRef = db.collection(`profiles/${profileId}/notifications`);
  const notification = {
    message: `${likeData.name} liked your post`,
    link: `/${profileId}/${postId}`,
    profile_id: likeData.id,
    avatar: likeData.avatar,
    name: likeData.name,
    seen: false,
    archived: false,
    published_at: FieldValue.serverTimestamp(),
  }
  return notificationsCollectionRef.add(notification);
})

// Notify user for each new follower
export const notifyUserNewFollower = onDocumentCreated(`profiles/{profileId}/followers/{followerId}`, (event) => {
  const followerDoc = event.data;
  if (!followerDoc) return

  const profileId = event.params.profileId;
  const followerId = event.params.followerId;
  const followerData = followerDoc.data();

  const notificationsCollectionRef = db.collection(`profiles/${profileId}/notifications`);
  const notification = {
    message: `${followerData.name} started following you`,
    link: `/${followerId}`,
    profile_id: followerDoc.id,
    avatar: followerData.avatar,
    name: followerData.name,
    seen: false,
    archived: false,
    published_at: FieldValue.serverTimestamp(),
  }
  return notificationsCollectionRef.add(notification);
})

// Notifications initial over profile creation
export const initNotificationsStatsDoc = onDocumentCreated(`profiles/{profileId}`, (event) => {
  const profileId = event.params.profileId;
  const notificationStatsRef = db.doc(`profiles/${profileId}/notifications/stats`);
  notificationStatsRef.set({
    "unseen": 0,
    "archived": 0,
  });
})

// Increase notifications stats for created new notifications
export const notificationsStats = onDocumentCreated(`profiles/{profileId}/notifications/{notificationId}`, (event) => {
  const notificationDoc = event.data;
  if (!notificationDoc) return

  const notificationId = event.params.notificationId;
  if (notificationId === "stats") return

  const profileId = event.params.profileId;
  const notificationStatsRef = db.doc(`profiles/${profileId}/notifications/stats`);
  notificationStatsRef.update({
    "unseen": FieldValue.increment(1),
  });
})

// Handle notification's stats as notifications marked for seen or archived
export const markNotificationAsSeen = onDocumentUpdated(`profiles/{profileId}/notifications/{notificationId}`, (event) => {
  const notificationDoc = event.data;
  if (!notificationDoc) return

  const notificationId = event.params.notificationId;
  if (notificationId === "stats") return

  // Unseen decrease
  const profileId = event.params.profileId;
  if ( notificationDoc.after.data().seen === true && notificationDoc.before.data().seen === false ) {
    const notificationStatsRef = db.doc(`profiles/${profileId}/notifications/stats`);
    notificationStatsRef.update({
      "unseen": FieldValue.increment(-1),
    });
  }

  // Archived increase
  if ( notificationDoc.after.data().archived === true && notificationDoc.before.data().archived === false ){
    const notificationStatsRef = db.doc(`profiles/${profileId}/notifications/stats`);
    notificationStatsRef.update({
      "archived": FieldValue.increment(1),
    });
  }
})


/**
 * Messages
 */
export const fanoutMessage = onDocumentCreated(`profiles/{profileId}/conversations/{conversationId}/messages/{messageId}`, (event) => {
  const messageDoc = event.data;
  if (!messageDoc) return

  const profileId = event.params.profileId;
  const conversationId = event.params.conversationId;
  const messageId = event.params.messageId;
  const conversationRef = db.doc(`profiles/${profileId}/conversations/${conversationId}`);
  const messageData = messageDoc.data();

  // Update the conversation
  conversationRef.update({
    "last_message": messageData.message,
    "modified_at": FieldValue.serverTimestamp(),
    "new_messages": (messageData.direction === 'in' ? FieldValue.increment(1) : 0),
  });

  // Do nothing if message direction is 'in'
  if (messageData.direction === 'in') return

  // Fanout message to the other profile's conversation
  const withMessageRef = db.doc(`profiles/${conversationId}/conversations/${profileId}/messages/${messageId}`);
  withMessageRef.set( {...messageData, direction: 'in'} );
})

// export const initConversation = onDocumentCreated(`profiles/{profileId}/conversations/{conversationId}`, (event) => {
//   const profileId = event.params.profileId;
//   const conversationId = event.params.conversationId;
//   const conversationRef = db.doc(`profiles/${conversationId}/conversations/${profileId}`);
//   conversationRef.set({
//     "last_message": "",
//     "modified_at": FieldValue.serverTimestamp(),
//     "new_messages": 0,
//     "archived": false,
//   });
// })