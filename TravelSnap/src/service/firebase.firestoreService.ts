import { getFirestore, collection, addDoc, doc, setDoc, getDoc, serverTimestamp, GeoPoint, arrayUnion, getDocs, orderBy, query, where, arrayRemove, deleteDoc  } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { Post } from "../models/postInterface";

export const firestoreService = {

  // Register a new user with the given email, password, and username.
  async createUserProfile(userId: string, userData: any) {
    const db = getFirestore();
    try {
      await setDoc(doc(db, "users", userId), userData);
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  },

  // Get the user profile for the given user ID.
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

  // Get the default profile picture URL.
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

  // Uploads image and returns the URL.
  async uploadImageAndGetURL(userId: string, imageFile: File) {
    const storage = getStorage();
    const uniqueImageName = `PostImages/${userId}_${new Date().getTime()}`;
    const imageRef = ref(storage, uniqueImageName);
    const imageSnapshot = await uploadBytes(imageRef, imageFile);
    return getDownloadURL(imageSnapshot.ref);
  },

  // Uploads profile picture and returns the URL.
  async uploadProfilePictureAndGetURL(userId: string, imageFile: File) {
    const storage = getStorage();
    const uniqueImageName = `ProfilePictures/${userId}_${new Date().getTime()}`;
    const imageRef = ref(storage, uniqueImageName);
    const imageSnapshot = await uploadBytes(imageRef, imageFile);
    return getDownloadURL(imageSnapshot.ref);
  },

  // Update the user's profile picture.
  async updateUserProfilePicture(userId: string, newPicUrl: string) {
    const db = getFirestore();
    const userDocRef = doc(db, "users", userId);
  
    try {
      await setDoc(userDocRef, { profilePicture: newPicUrl }, { merge: true });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      throw error;
    }
  },

  // Creates a new post with the given data.
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

  // Update the user's posts (used after the user has created a post)
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

  // Get the user's posts.
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

  // Get post by ID
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

  // Get all posts (used in the Home page)
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
  
  // Updates the users liked posts if the user likes or unlikes a post.
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

  // Creates a comment for the given post.
  async createComment(postId: string, userId: string, userName:string, userImage: string, text: string) {
    const db = getFirestore();
    try {
      const comment = {
        createdAt: serverTimestamp(),
        userImage: userImage,
        userId: userId,
        userName: userName,
        text: text
      };
      const commentsRef = collection(db, "posts", postId, "comments");
      
  
      await addDoc(commentsRef, comment);
  
      return commentsRef;     
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  // Get all comments for the given post.
  async getCommentsByPostId(postId: string) {
    const db = getFirestore();
    try {
      const commentsRef = collection(db, "posts", postId, "comments");

      const querySnapshot = await getDocs(commentsRef);
  
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userImage: data.userImage,
          text: data.text,
          createdAt: data.createdAt.toDate(),
        };
      });
    } catch (error) {
      console.error("Error getting comments by post ID:", error);
      throw error;
    }
  },

  // Delete the given comment. (only the user who created the comment can delete it)
  async deleteComment(postId: string, commentId: string, userId: string) {
    const db = getFirestore();
    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) {
        throw new Error("Comment does not exist.");
      }
      const commentData = commentSnap.data();
  

      if (commentData.userId !== userId) {
        throw new Error("User is not authorized to delete this comment.");
      }
  
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },


};