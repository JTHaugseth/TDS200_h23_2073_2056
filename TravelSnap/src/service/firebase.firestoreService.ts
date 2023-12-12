import { getFirestore, collection, addDoc, doc, setDoc, getDoc, serverTimestamp, GeoPoint, arrayUnion, getDocs, orderBy, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

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
      const userDocRef = doc(db, "users", userId);
  
      const docSnap = await getDoc(userDocRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const postIds = userData.posts || []; 
        return postIds;
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error getting user posts:", error);
      throw error;
    }
  },

  async getUserPostsImages(userId: string) {
    const db = getFirestore();
    try {
      const userDocRef = doc(db, "users", userId);
      const docSnap = await getDoc(userDocRef);
  
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const postIds = userData.posts || [];
        const imageUrls = [];
  
        for (const postId of postIds) {
          const postDocRef = doc(db, "posts", postId);
          const postDocSnap = await getDoc(postDocRef);
          if (postDocSnap.exists()) {
            imageUrls.push(postDocSnap.data().imageURL);
          } else {
            console.log(`No such post document for postId: ${postId}`);
          }
        }
  
        return imageUrls;
      } else {
        console.log("No such user document!");
        return [];
      }
    } catch (error) {
      console.error("Error getting user posts images:", error);
      throw error;
    }
  },

  async addCommentToPost(postId: string, userId: string, text: string) {
    const db = getFirestore();
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
  
    try {
      await addDoc(commentsCollectionRef, {
        text: text,
        commentedBy: userId,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding comment to post:", error);
      throw error;
    }
  },

  async getCommentsForPost(postId: string) {
    const db = getFirestore();
    const commentsCollectionRef = collection(db, "posts", postId, "comments");
    const commentsQuery = query(commentsCollectionRef, orderBy("createdAt", "desc"));
  
    try {
      const querySnapshot = await getDocs(commentsQuery);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting comments for post:", error);
      throw error;
    }
  },

  async getAllPosts() {
    const db = getFirestore();
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      return querySnapshot.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Error getting posts:", error);
      throw error;
    }
  },
};