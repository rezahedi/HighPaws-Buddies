import { Auth, connectAuthEmulator } from "firebase/auth";
import { Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { FirebaseStorage, connectStorageEmulator } from "firebase/storage";

export default function FirebaseSimulators (
  {db, auth, storage}:
  {db: Firestore, auth: Auth, storage: FirebaseStorage}
){
  if( import.meta.env.DEV ) {

    // TODO: Check if simulators are running

    connectFirestoreEmulator(db, "localhost", 8080)
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectStorageEmulator(storage, "localhost", 9199)
  }
}