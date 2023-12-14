import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

import { firestoreService } from "./firebase.firestoreService";

export const authService = {

  // Register a new user with the given email, password, and username.
  async register(email: string, password: string, userName: string) {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    const user = userCredential.user;
    if (user) {
      const defaultProfilePicUrl = await firestoreService.getDefaultProfilePicUrl();

      await firestoreService.createUserProfile(user.uid, {
        userID: user.uid,
        username: userName,
        email: user.email,
        profilePicture: defaultProfilePicUrl,
        posts: [],
        likedPosts: []
      });
    }
    return user;
  },

  // Login with the given email and password.
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password)
    return userCredential?.user;
  },

  // Logout the current user.
  async logout() {
    return await signOut(getAuth());
  },

  // Get the current user.
  async currentUser() {
    return getAuth().currentUser;
  },

  // Sign in with Google.
  async signinWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;
      if (user) {
        const userProfile = await firestoreService.getUserProfile(user.uid);
        if (!userProfile) {
          const defaultProfilePicUrl = await firestoreService.getDefaultProfilePicUrl();

          await firestoreService.createUserProfile(user.uid, {
            userID: user.uid,
            username: user.displayName || '',
            email: user.email,
            profilePicture: defaultProfilePicUrl,
            posts: [],
            likedPosts: []
          });
        }
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        return token;
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      return null;
    }
  },

  // Send a password reset email to the given email address.
  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(getAuth(), email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }
};
