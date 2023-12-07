import { getFirestore, collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";


export const firestoreService = {

  async createUserProfile(userId: string, userData: any) {
    const db = getFirestore();
    try {
      await setDoc(doc(db, "users", userId), userData);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  async getUserProfile(userId: string) {
    const db = getFirestore();
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },
};