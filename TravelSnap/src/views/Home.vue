<script setup lang="ts">
import { useRouter } from 'vue-router';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonTitle, IonIcon, IonRouterOutlet, toastController,  IonTabs, IonTabBar, IonTabButton } from '@ionic/vue';
import { authService } from '@/service/firebase.authService';

const router = useRouter();

// Skriv kode her :) 
</script>


<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="home-outline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="person-outline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="add">
          <ion-icon name="add-circle-outline"></ion-icon>
        </ion-tab-button>

        <ion-tab-button tab="settings">
          <ion-icon name="settings-outline"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

  
<style>
ion-tab-bar {
  --background: transparent 
  box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1); 
}


ion-tab-button {
  --color-selected: #ff4757;
  --color: gray; 
  transition: color 0.3s ease; 
}


ion-icon {
  font-size: 1.5em; 
}


@media (max-width: 600px) {
  ion-tab-button {
    --padding-bottom: 12px; 
  }
}
</style>
