 <script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonTitle, IonRouterOutlet, IonIcon, toastController } from '@ionic/vue';
import { authService } from '@/service/firebase.authService'; 
import { ref, computed } from 'vue';

const router = useRouter();


const value = ref(null); 
const valueSet = computed(() => value.value !== null);

const backgroundImage = computed(() => {
  if (!valueSet.value) return ''; 
});

</script>

<template>
  <ion-page>
    <ion-content :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div v-if="!valueSet" class="loading-container">
        
      </div>
      <div class="content-container">
        <h1>This is the main view</h1>
      </div>
      <div class="icons-container">
        <!-- Icons Here -->
        <ion-icon name="heart-outline"></ion-icon>
        <ion-icon name="earth-outline"></ion-icon>
        <ion-icon name="chatbox-ellipses-outline"></ion-icon>
      </div>
      <div class="title-container">
        <h2>Title Here</h2>
      </div>
    </ion-content>
  </ion-page>
</template>

  
<style>
.ion-content {
  --background: none;
  background-size: cover;
  background-position: center;
}

.icons-container {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icons-container ion-icon {
  margin-bottom: 10px;
}

.title-container {
  position: absolute;
  left: 10px;
  bottom: 10px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
