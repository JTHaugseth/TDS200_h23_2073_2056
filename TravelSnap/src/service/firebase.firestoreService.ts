import { getFirestore, collection, addDoc, doc, setDoc, getDoc, serverTimestamp, GeoPoint, arrayUnion, getDocs, orderBy, query, where, arrayRemove  } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Post } from "../models/postInterface";

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

  async getDefaultProfilePicUrl() {
    const storage = getStorage();
    const defaultPicRef = ref(storage, 'default-profile-picture.JPG');
    
    try {
      return await getDownloadURL(defaultPicRef);
    } catch (error) {
      console.error("Error getting default profile picture URL:", error);
      throw error;
    }
  },

  async uploadImageAndGetURL(userId: string, imageFile: File) {
    const storage = getStorage();
    const uniqueImageName = `PostImages/${userId}_${new Date().getTime()}`;
    const imageRef = ref(storage, uniqueImageName);
    const imageSnapshot = await uploadBytes(imageRef, imageFile);
    return getDownloadURL(imageSnapshot.ref);
  },

  async createNewPost(userId: string, username: string, description: string, imageUrl: string, geolocation: { lat: number, lng: number }) {
    const db = getFirestore();
    const postDocRef = await addDoc(collection(db, 'posts'), {
      postedBy: userId,
      username: username,
      description: description,
      imageURL: imageUrl,
      geolocation: new GeoPoint(geolocation.lat, geolocation.lng),
      likesCount: 0,
      createdAt: serverTimestamp()
    });
    return postDocRef.id;
  },

  async addUserPost(userId: string, postId: string) {
    const db = getFirestore();
    const userDocRef = doc(db, "users", userId);

    try {
      await setDoc(userDocRef, {
        posts: arrayUnion(postId)
      }, { merge: true }); 
    } catch (error) {
      console.error("Error adding post to user:", error);
      throw error;
    }
  },


  async getUserPosts(userId: string) {
    const db = getFirestore();
    try {
      const postsQuery = query(collection(db, "posts"), where("postedBy", "==", userId));
      const querySnapshot = await getDocs(postsQuery);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate(), 
          description: data.description,
          geolocation: data.geolocation,
          imageURL: data.imageURL,
          likesCount: data.likesCount,
          postedBy: data.postedBy,
          username: data.username
        } as Post; 
      });
    } catch (error) {
      console.error("Error getting user posts:", error);
      throw error;
    }
  },

  async getPostById(postId: string) {
    const db = getFirestore();
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          createdAt: data.createdAt.toDate(), 
          description: data.description,
          geolocation: data.geolocation,
          imageURL: data.imageURL,
          likesCount: data.likesCount,
          postedBy: data.postedBy,
          username: data.username
        } as Post;
      } else {
        console.log("No such post!");
        return null;
      }
    } catch (error) {
      console.error("Error getting post:", error);
      throw error;
    }
  },

  async getAllPosts() {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          createdAt: data.createdAt.toDate(), 
          description: data.description,
          geolocation: data.geolocation,
          imageURL: data.imageURL,
          likesCount: data.likesCount,
          postedBy: data.postedBy,
          username: data.username
        } as Post; 
      });
    } catch (error) {
      console.error("Error getting posts:", error);
      throw error;
    }
  },
  
  async updateUserLikedPost(userId: string, postId: string, like: boolean) {
    const db = getFirestore();
    const userDocRef = doc(db, "users", userId);
  
    try {
      if (like) {
        await setDoc(userDocRef, {
          likedPosts: arrayUnion(postId)
        }, { merge: true });
      } else {
        await setDoc(userDocRef, {
          likedPosts: arrayRemove(postId)
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error updating user's liked posts:", error);
      throw error;
    }
  },
};