<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/service/firebase.authService';
import { firestoreService } from "@/service/firebase.firestoreService";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonAvatar, IonImg, IonIcon } from '@ionic/vue';
import { imagesOutline, heartOutline } from 'ionicons/icons';

const userProfile = ref(null);
const userPostsImages = ref([]);
const showPosts = ref(true); 
const activeIcon = ref('posts'); 
const isLoading = ref(true);

const router = useRouter();

const fetchUserProfile = async () => {
  const currentUser = await authService.currentUser();
  if (currentUser) {
    userProfile.value = await firestoreService.getUserProfile(currentUser.uid);
    userPostsImages.value = await firestoreService.getUserPostsImages(currentUser.uid);
    isLoading.value = false; 
  }
};

onMounted(fetchUserProfile);

const logout = async () => {
  await authService.logout();
  router.push('/authentication'); 
};


const showPostsGrid = () => {
  showPosts.value = true;
  activeIcon.value = 'posts';
};


const showLikes = () => {
  showPosts.value = false;
  activeIcon.value = 'likes';
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-button slot="end" size="small" class="profile-button" @click="logout">Logout</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="profile-content">
      <div class="profile-container">
        <ion-avatar class="avatar">
          <img :src="userProfile?.profilePicture || 'default-image-url'" alt="Profile Picture" />
        </ion-avatar>
        <div class="username-label">{{ userProfile?.username }}</div>
        <IonButton size="small" class="profile-button">Edit profile</IonButton>
        <div class="overlay-icons">
          <IonIcon :icon="imagesOutline" @click="showPostsGrid" aria-label="Posts" :class="{ active: activeIcon === 'posts' }"></IonIcon>
          <IonIcon :icon="heartOutline" @click="showLikes" aria-label="Liked Posts" :class="{ active: activeIcon === 'likes' }"></IonIcon>
        </div>
      </div>
      
      <!-- Loading Spinner -->
      <div v-if="isLoading" class="loading-spinner"></div>

      <!-- Posts Grid or No Posts Message -->
      <div v-else>
        <div v-if="showPosts" class="posts-grid">
          <div v-for="image in userPostsImages" :key="image" class="post-container">
            <img class="post-item" :src="image" alt="User Post" />
          </div>
        </div>
        <div v-else class="no-liked-posts-message">
          No liked posts
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<style scoped>

ion-content {
  --background: #202020; 
}

ion-toolbar {
  --background: #202020;
  --color: white;
}
.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4%;
}

.username-label {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.2em;
  text-align: center;
  color: white;
}

.logout-button {
  --background: gray;
  --border-radius: 5px;
  --padding: 5px 10px;
  font-size: 0.8em;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.post-container {
  width: 100%;
  height: 150px;
  overflow: hidden; 
  border-top: gray solid 1px;
  margin-top: 0px;
  animation: slideInFromLeft 0.5s ease-out forwards;
}

.post-item {
  width: 100%;
  height: 100%;
  object-fit: cover;
   
}

.overlay-icons ion-icon {
  font-size: 24px;
  color: white;
}

.overlay-icons {
  display: flex;
  justify-content: space-around; 
  align-items: center; 
  width: 100%;
  margin-top: 10px; 
  margin-bottom: 10px;
}

.no-liked-posts-message {
  color: white;
  font-size: 1.5em;
  text-align: center;
  margin-top: 20px;
}

.overlay-icons ion-icon.active {
  border-bottom: 2px solid white;
  
}

.no-liked-posts-message {
  color: white;
  font-size: 1.5em;
  text-align: center;
  margin-top: 0px;
}

.profile-button {
    --background: rgba(255, 255, 255, 0.205);
  }

  @keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 50px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>


