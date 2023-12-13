<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonAvatar,
  IonImg,
  IonIcon
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authService } from '@/service/firebase.authService';
import { firestoreService } from "@/service/firebase.firestoreService";
import { imagesOutline, heartOutline, arrowBack } from 'ionicons/icons';
import { Post } from '@/models/postInterface';
import { UserProfile } from '@/models/userProfileInterface';

const userProfile = ref<UserProfile | null>(null);
const userPosts = ref<Post[]>([]);
const showPosts = ref(true);
const activeIcon = ref('posts');
const isLoading = ref(true);

const router = useRouter();
const route = useRoute();
const userId = route.query.userId;

const fetchUserProfileAndPosts = async () => {
  if (userId) {
    userProfile.value = await firestoreService.getUserProfile(userId as string) as UserProfile;
    userPosts.value = await firestoreService.getUserPosts(userId as string);
    isLoading.value = false;
  }
};

onMounted(fetchUserProfileAndPosts);

const showPostsGrid = () => {
  showPosts.value = true;
  activeIcon.value = 'posts';
};

const openPost = (id: string) => {
  router.push({
      path: '/search-view-post',
      query: {
        postId: id,
      }
  })
};

const goBack = () => {
  router.back();
};

</script>

<template>
  <ion-page>
    <ion-header>
        <ion-toolbar>
          <IonButton slot="start" fill="clear" @click="goBack">
            <IonIcon :icon="arrowBack"></IonIcon>
          </IonButton>
          <ion-title>{{ userProfile?.username }}</ion-title>
        </ion-toolbar>
      </ion-header>
    <ion-content class="profile-content">
      <div class="profile-container">
        <ion-avatar class="avatar">
          <img :src="userProfile?.profilePicture || 'default-image-url'" alt="Profile Picture" />
        </ion-avatar>
        <div class="username-label">{{ userProfile?.username }}</div>
        <div class="overlay-icons">
          <IonIcon :icon="imagesOutline" @click="showPostsGrid" aria-label="Posts"
            :class="{ active: activeIcon === 'posts' }"></IonIcon>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="loading-spinner"></div>

      <!-- Posts Grid or No Posts Message -->
      <div v-else>
        <div v-if="showPosts" class="posts-grid">
          <div v-for="post in userPosts" :key="post.id" class="post-container">
              <img class="post-item" :src="post.imageURL" :alt="post.description" @click="openPost(post.id)" />
          </div>
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}</style>


