<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { authService } from '@/service/firebase.authService';
import { firestoreService } from "@/service/firebase.firestoreService";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonAvatar } from '@ionic/vue';

const userProfile = ref(null);
const userPosts = ref([]);

const fetchUserProfile = async () => {
  const currentUser = await authService.currentUser();
  if (currentUser) {
    userProfile.value = await firestoreService.getUserProfile(currentUser.uid);
    userPosts.value = userProfile.value.posts; 
  }
};

onMounted(fetchUserProfile);

const logout = async () => {
  await authService.logout();
};
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-button slot="end" size="small" class="logout-button" @click="logout">Logout</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="profile-content">
      <div class="profile-container">
        <ion-avatar class="avatar">
          <img :src="userProfile?.profilePicture || 'default-image-url'" alt="Profile Picture" />
        </ion-avatar>
        <div class="username-label">{{ userProfile?.username }}</div>
      </div>
      <div class="posts-grid">
        <div v-for="post in userPosts" :key="post.id" class="post-item">
          <img :src="post.imageUrl" alt="Post Image" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>



<style scoped >
.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.avatar{
  width: 100px;
  height: 100px;
}

profile-picture {
  width: 150px; 
  height: 150px; 
  object-fit: cover;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4%;
}


.username-label {
  margin-top: 10px; 
  font-size: 1.2em; 
  text-align: center; 
}

.logout-button {
  --background: var(--ion-color-success); 
  --border-radius: 5px;
  --padding: 5px 10px; 
  font-size: 0.8em;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust as needed */
  gap: 10px;
  padding: 20px;
}

.post-item {
  width: 100%;
  height: auto;
}
</style>

