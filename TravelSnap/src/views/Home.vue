<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonModal,
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { earthSharp, heart, chatboxEllipses, close, trash } from 'ionicons/icons';
import { firestoreService } from '@/service/firebase.firestoreService';
import { authService } from '@/service/firebase.authService'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Post } from '@/models/postInterface';
import { UserProfile } from '@/models/userProfileInterface';
import 'swiper/swiper-bundle.css';
import { Comment } from '@/models/commentInterface';

const router = useRouter();
const posts = ref<Post[]>([]);
const userProfile = ref<UserProfile | null>(null);
const showCommentsSheet = ref(false);
const currentPostId = ref('');
const newCommentText = ref('');
const comments = ref<Comment[]>([]);

// Fetch all posts except the ones created by the current user
onMounted(async () => {
  const currentUser = await authService.currentUser(); 
  if (currentUser) {
    userProfile.value = await firestoreService.getUserProfile(currentUser.uid) as UserProfile;
    const allPosts = (await firestoreService.getAllPosts());
    posts.value = allPosts.filter(post => post.postedBy !== userProfile.value?.userID);
  }
});

// Submit a comment to the current post
const submitComment = async () => {
  if (!newCommentText.value.trim()) return; 
  const currentUser = await authService.currentUser();
  if (currentUser && userProfile.value) {
    try {
      await firestoreService.createComment(
        currentPostId.value,
        currentUser.uid,
        userProfile.value.username,
        userProfile.value.profilePicture, 
        newCommentText.value
      );
      newCommentText.value = ''; 
      
      let fetchedComments = await firestoreService.getCommentsByPostId(currentPostId.value);
      comments.value = fetchedComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  }
};

// Open the comments sheet for a post
const openCommentsSheet = async (postId: string) => {
  currentPostId.value = postId;
  let fetchedComments = await firestoreService.getCommentsByPostId(postId);
  
  comments.value = fetchedComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  showCommentsSheet.value = true;
};

// Check if the current user has liked a post
const isLikedByCurrentUser = (postId: string) => {
  return userProfile.value?.likedPosts.includes(postId);
};

// Toggle the like status of a post
const toggleLike = async (post: any) => {
  const currentUser = await authService.currentUser();
  if (currentUser && userProfile.value) {
    const userId = currentUser.uid;
    const isCurrentlyLiked = isLikedByCurrentUser(post.id);
    const newLikeStatus = !isCurrentlyLiked;

    if (newLikeStatus) {
      userProfile.value.likedPosts.push(post.id);
    } else {
      userProfile.value.likedPosts = userProfile.value.likedPosts.filter(pid => pid !== post.id);
    }

    try {
      await firestoreService.updateUserLikedPost(userId, post.id, newLikeStatus);
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  }
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  const currentUser = await authService.currentUser();
  if (currentUser && currentPostId.value) {
    try {
      await firestoreService.deleteComment(currentPostId.value, commentId, currentUser.uid);
      // Refresh comments to reflect the deletion
      comments.value = await firestoreService.getCommentsByPostId(currentPostId.value);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  }
};

// Toggle the comments sheet
const toggleCommentsSheet = () => {
  showCommentsSheet.value = !showCommentsSheet.value;
};

// Open the profile of the user who created the post
const openProfile = (id: string) => {
  router.push({
      path: '/search-profile',
      query: {
        userId: id,
      }
  })
};

// Open the map view for a post
const openMap = (geolocation: any) => {
  router.push({
    path: '/search-map',
    query: {
      lat: geolocation.latitude,
      lng: geolocation.longitude,
    }
  });
};

</script>

<template>
  <ion-page style="background-color: #202020;">
    
    <ion-content>
      <div class="center-wrapper">
      <Swiper class="swiper">
        <SwiperSlide v-for="(post, index) in posts" :key="index">
          <div class="post-container">
            <div class="post">
              <div class="image-container">
                <img :src="post.imageURL"/>
                <div class="overlay-icons">
                    <IonIcon :icon="earthSharp" @click="openMap(post.geolocation)" aria-hidden="true"></IonIcon>
                    <IonIcon 
                    :icon="heart" 
                    :style="{ color: isLikedByCurrentUser(post.id) ? 'red' : 'white' }" 
                    @click="toggleLike(post)"
                    aria-hidden="true">
                  </IonIcon>

                    <IonIcon :icon="chatboxEllipses" @click="openCommentsSheet(post.id)" aria-hidden="true"></IonIcon>
                  </div>
                <div class="post-overlay"> 
                  <div class="overlay-content">
                    <h2 class="overlay-title" @click="openProfile(post.postedBy)">{{ post.username }}</h2>
                    <p class="overlay-description">{{ post.description }}</p>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
    <IonModal :is-open="showCommentsSheet" swipe-to-close="true" class="custom-modal">
  <IonIcon :icon="close" @click="toggleCommentsSheet" class="close-button"/>
  <div class="comments-container">
    <div v-for="comment in comments" :key="comment.id" class="comment">
      <img class="comment-avatar" :src="comment.userImage || 'default-image-url'"  alt="Avatar" />
      <div>
        <h3 class="comment-name">{{ comment.userName }}</h3>
        <p class="comment-text">{{ comment.text }}</p>
      </div>
      <IonIcon
          v-if="comment.userId === userProfile?.userID"
          :icon="trash"
          @click="deleteComment(comment.id)"
          class="delete-comment-icon"
        ></IonIcon>
    </div>
  </div>
  <div class="comment-input">
    <IonInput v-model="newCommentText" :counter="true" :maxlength="100" placeholder="Add a comment..."/>
    <IonButton color="medium" @click="submitComment" size="small">Send</IonButton>
  </div>
</IonModal>

    </ion-content>
  </ion-page>
</template>

<style scoped>

ion-content {
  --background: #202020;
  height: 100%;
}

.center-wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-container {
  width: 100%;
  height: 100%;
}

.post-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.post {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: fit-content;
  opacity: 0.8;
}

.post-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  color: #fff;
}

.overlay-content {
  text-align: left;
}

.overlay-icons {
  display: flex;
  flex-direction: column; 
  position: absolute;
  top: 50%;
  left: 90%; 
  color: white;
}

.overlay-icons ion-icon {
  font-size: 30px;
  margin-bottom: 40px;
}

.overlay-title {
  font-size: 1.3em;
  font-weight: bold;
}

.overlay-description {
  font-size: 1em;
  font-weight: bold;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
}

.custom-modal {
  --width: 100%;
  --height: 100%;
  --background: #202020;
    top: 20%;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
}

.comments-container {
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
  padding: 10px;
  overflow-y: auto; 
  max-height: 70vh; 
}

.comment-avatar {
  width: 60px; 
  height: 60px;
  border-radius: 50%; 
  margin-right: 10px;
}

.comment {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
  width: 100%;
}

.comment-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: white;
}

.comment-text {
  font-size: 0.9em;
  color: white;
}

.comment-input {
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #202020;
  color: white;
}

.comment-input {
  display: flex; 
  align-items: center; 
  padding: 10px;
  background: #202020;
  color: white;
}

.comment-input IonInput {
  flex-grow: 1; 
  margin-right: 10px; 
}

.delete-comment-icon {
    color: #ffffff; 
    margin-left: auto;
    flex-shrink: 0;
  }

</style>
