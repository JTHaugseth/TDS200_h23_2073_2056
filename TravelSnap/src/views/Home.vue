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
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { earthSharp, heart, chatboxEllipses } from 'ionicons/icons';
import { firestoreService } from '@/service/firebase.firestoreService';
import { authService } from '@/service/firebase.authService'; 
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

interface Post {
  createdAt: Date;       
  description: string;
  geolocation: { lat: number, lng: number }; 
  imageURL: string;
  likesCount: number;
  postedBy: string;
  username: string;
}

const posts = ref<Post[]>([]);

onMounted(async () => {
  const user = await authService.currentUser(); 
  const userId = user ? user.uid : null;
  const allPosts = (await firestoreService.getAllPosts()) as Post[];
  posts.value = allPosts.filter(post => post.postedBy !== userId);
});

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
                    <IonIcon :icon="heart" aria-hidden="true"></IonIcon>
                    <IonIcon :icon="chatboxEllipses" aria-hidden="true"></IonIcon>
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
  flex-direction: column; /* Keep as column */
  position: absolute;
  top: 50%; /* Centralize vertically */
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

</style>
