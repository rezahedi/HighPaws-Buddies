// See a full list of supported triggers at https://firebase.google.com/docs/functions
import {
  // onDocumentWritten,
  onDocumentCreated,
  // onDocumentUpdated,
  onDocumentDeleted,
  // Change,
  // FirestoreEvent
} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

export const increaseFollowingStat =
  onDocumentCreated("profiles/{profileId}/following/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Increase stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.following": admin.firestore.FieldValue.increment(1),
    });
  });

export const increaseFollowerStat =
  onDocumentCreated("profiles/{profileId}/followers/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Increase stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.followers": admin.firestore.FieldValue.increment(1),
    });
  });

export const decreaseFollowingStat =
  onDocumentDeleted("profiles/{profileId}/following/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Decrease stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.following": admin.firestore.FieldValue.increment(-1),
    });
  });

export const decreaseFollowerStat =
  onDocumentDeleted("profiles/{profileId}/followers/{secondProfileId}", (event) => {
    const profileId = event.params.profileId;
    // const secondProfileId = event.params.secondProfileId;

    // Decrease stats profiles/:profileId stats.following by 1
    const profileRef = db.doc(`profiles/${profileId}`);
    profileRef.update({
      "stats.followers": admin.firestore.FieldValue.increment(-1),
    });
  });
