 <script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonTitle, IonRouterOutlet, IonIcon, toastController } from '@ionic/vue';
import { authService } from '@/service/firebase.authService'; 


const router = useRouter();




</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <div class="content-container">
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


  
<style scoped>

ion-content {
  --background: #202020;
  color: white;
}
.icons-container {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.icons-container ion-icon {
  margin-bottom: 40px;
}

.title-container {
  position: absolute;
  left: 10px;
  bottom: 10px;
  color: white;
}
</style>
