<script setup lang="ts">
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { arrowBack } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { Post } from '@/models/postInterface';
import { firestoreService } from "@/service/firebase.firestoreService";

const route = useRoute();
const router = useRouter();

const postId = route.query.postId;
const post = ref<Post | null>(null);

//gets the post by id
onMounted(async () => {
  if (postId) {
    post.value = await firestoreService.getPostById(postId as string);
  }
});

//Routes you back to prev view
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
          <ion-title>{{ post?.username + "'s post" }}</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content>
        <div class="post-container">
            <div class="post">
              <div class="image-container">
                <img :src="post?.imageURL"/>
                <div class="post-overlay">
                  <div class="overlay-content">
                    <h2 class="overlay-title">{{ post?.username }}</h2>
                    <p class="overlay-description">{{ post?.description }}</p>
                  </div>
                </div>
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

.overlay-title {
  font-size: 1.3em;
  font-weight: bold;
}

.overlay-description {
  font-size: 1em;
  font-weight: bold;
}
</style>