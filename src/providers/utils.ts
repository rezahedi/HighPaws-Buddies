import { db, storage } from "@/firebase"
import { newProfileProp } from "@/types/firestore"
import { getBuddyAvatar, getOwnerAvatar } from "@/utils"
import { UserCredential } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadString } from "firebase/storage"

export function uploadAvatarToStorage(avatarURL: string, profileID: string, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const profileFolderRef = ref(storage, `profiles/${profileID}`)
    const avatarImageRef = ref(profileFolderRef, filename)
    fetch(avatarURL).then(async res => {
      const blob = await res.blob()
      const content = await readBlob(blob)
      const snapshot = await uploadString(avatarImageRef, content, 'data_url')
      await getDownloadURL(snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
      });
    }).catch(() => {
      reject("Error uploading avatar image")
    })
  })
}

export function readBlob(blob: Blob): Promise<string> {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader()

    reader.onloadend = function() {
      resolve( reader.result as string )
    }

    reader.onerror = reject

    reader.readAsDataURL(blob)
  })
}

/**
 * 
 * Create Profile (include uploading avatars and profile document)
 * @param userCredential Firebase/auth UserCredential
 * @param profileData Firestore profile document data
 * 
 */
export function createProfile(userCredential: UserCredential, profileData: newProfileProp): Promise<boolean> {
  return new Promise( (resolve, reject) => {

    const profileRef = doc(db, 'profiles', userCredential.user.uid)

    // Check if profile document exists
    getDoc( profileRef ).then( res => {
      if ( res.exists() ) reject('Profile document already exists')

      // Then upload owner image to the storage
      uploadAvatarToStorage(
        userCredential.user.photoURL || getOwnerAvatar(),
        userCredential.user.uid,
        'owner.jpg'
      ).then((url) => {
        profileData.avatars.owner = url
      }).then(async () => {

        // Then upload buddy image
        await uploadAvatarToStorage(
          getBuddyAvatar(),
          userCredential.user.uid,
          'buddy.jpg'
        ).then((url) => {
          profileData.avatars.buddy = url
        })
      }).then(async () => {

        // Then create profile document
        profileData.owner = userCredential.user.displayName || ''
        await setDoc(profileRef, profileData).then(() => {
          resolve(true)
        }).catch(() => {
          reject('Error creating profile document')
        })
      })
    })
  })
}

export function resizeImage(content: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = content;
    img.onload = function() {
      const elem = document.createElement('canvas');
      elem.width = width;
      elem.height = height;
      const ctx = elem.getContext('2d');
      if (!ctx) return reject('Error creating canvas');

      // Calculate the canvas position to draw the image to cover the width and height
      const widthRatio = width / img.width;
      const heightRatio = height / img.height;
      const ratio = Math.max(widthRatio, heightRatio);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      const x = (width - newWidth) / 2;
      const y = (height - newHeight) / 2;
      ctx.drawImage(img, x, y, newWidth, newHeight);

      resolve(ctx.canvas.toDataURL('image/jpeg'));
    };
  });
}