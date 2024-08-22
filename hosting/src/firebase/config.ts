import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;

app = initializeApp(firebaseConfig);
auth = getAuth(app);

// if (!!process.env.REACT_APP_ENVIRONMENT) {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export { app, auth };
