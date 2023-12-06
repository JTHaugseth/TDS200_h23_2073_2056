<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonTitle, IonIcon, toastController } from '@ionic/vue';
import { authService } from '@/service/firebase.authService';

const router = useRouter();

// Skriv kode her :) 
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-title>Main View</ion-title>
      <div>
        <h1>This is the main view</h1>
        <!-- You can add more content here as needed -->
      </div>
      
    </ion-content>
  </ion-page>
</template>
  
<style>
/* Add your styles here */
</style>