<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonModal,
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { earthSharp, heart, chatboxEllipses, close } from 'ionicons/icons';
import { firestoreService } from '@/service/firebase.firestoreService';
import { authService } from '@/service/firebase.authService'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Post } from '@/models/postInterface';
import { UserProfile } from '@/models/userProfileInterface';
import 'swiper/swiper-bundle.css';

const posts = ref<Post[]>([]);
const userProfile = ref<UserProfile | null>(null);
const showCommentsSheet = ref(false);


onMounted(async () => {
  const currentUser = await authService.currentUser(); 
  if (currentUser) {
    userProfile.value = await firestoreService.getUserProfile(currentUser.uid) as UserProfile;
    const allPosts = (await firestoreService.getAllPosts());
    posts.value = allPosts.filter(post => post.postedBy !== userProfile.value?.userID);
  }
});

const isLikedByCurrentUser = (postId: string) => {
  return userProfile.value?.likedPosts.includes(postId);
};

const toggleLike = async (post) => {
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

const toggleCommentsSheet = () => {
  showCommentsSheet.value = !showCommentsSheet.value;
};
</script>

<template>
  <ion-page style="background-color: #202020;">
    <ion-searchbar animated placeholder="Search for users"></ion-searchbar>
    
    <ion-content>
      <div class="center-wrapper">
      <Swiper class="swiper">
        <SwiperSlide v-for="(post, index) in posts" :key="index">
          <div class="post-container">
            <div class="post">
              <div class="image-container">
                <img :src="post.imageURL"/>
                <div class="overlay-icons">
                    <IonIcon :icon="earthSharp" aria-hidden="true"></IonIcon>
                    <IonIcon 
                    :icon="heart" 
                    :style="{ color: isLikedByCurrentUser(post.id) ? 'red' : 'white' }" 
                    @click="toggleLike(post)"
                    aria-hidden="true">
                  </IonIcon>

                    <IonIcon :icon="chatboxEllipses" @click="toggleCommentsSheet" aria-hidden="true"></IonIcon>
                  </div>
                <div class="post-overlay"> 
                  <div class="overlay-content">
                    <h2 class="overlay-title">{{ post.username }}</h2>
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
          <!-- Your comments section goes here -->
            <IonIcon :icon="close" @click="toggleCommentsSheet" class="close-button"/>
            <div class="comments-container">
              <img class="comment-avatar" src="default-image-url"  alt="Avatar" />
              <div class="comment">
                <h3 class="comment-name">Name</h3>
                <p class="comment-text">Comment text</p>
              </div>
      </div>
      <div class="comment-input">
        <IonInput placeholder="Add a comment..."/>
        <IonButton color="medium" size="small">Send</IonButton>
      </div>
      </IonModal>
    </ion-content>
  </ion-page>
</template>

<style scoped>



ion-searchbar {
  --background: #202020;
  --color: #fff;
  --border-color: transparent;
  --box-shadow: none;
}

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
  align-items: flex-start; 
  padding: 10px;
}

.comment-avatar {
  width: 40px; 
  height: 40px;
  border-radius: 50%; 
  margin-right: 10px;
}

.comment {
  display: flex;
  flex-direction: column; 
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

</style>
