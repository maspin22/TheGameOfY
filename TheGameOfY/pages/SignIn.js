import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authentication } from '../database/firebase-config';

// Initialize Firebase Auth and provider
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
    return signInWithPopup(authentication, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; // Google Access Token
        const user = result.user;
        const uid = user.uid;
        console.log("uid", uid);
        
        // Proceed with your app logic here, e.g., navigate to another screen
        console.log("Signed in successfully!", user);
      }).catch((error) => {
        console.error("Authentication error", error);
      });
  };
  
