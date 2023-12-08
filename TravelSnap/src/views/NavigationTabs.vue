<script setup lang="ts">
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const navigateTo = (path: string) => {
  router.replace(path);
};

const isActiveTab = (tabPath: string) => {
  return route.path.startsWith(tabPath);
};
</script>


<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button 
            @click="navigateTo('/tabs/home')" 
            :class="{ 'active-tab': isActiveTab('/tabs/home') }"
          >
            <ion-icon name="home-outline"></ion-icon>
          </ion-tab-button>
  
          <ion-tab-button 
            @click="navigateTo('/tabs/profile')" 
            :class="{ 'active-tab': isActiveTab('/tabs/profile') }"
          >
            <ion-icon name="person-outline"></ion-icon>
          </ion-tab-button>
  
          <ion-tab-button 
            @click="navigateTo('/tabs/newpost')" 
            :class="{ 'active-tab': isActiveTab('/tabs/newpost') }"
          >
            <ion-icon name="add-circle-outline"></ion-icon>
          </ion-tab-button>
  
          <ion-tab-button 
            @click="navigateTo('/tabs/settings')" 
            :class="{ 'active-tab': isActiveTab('/tabs/settings') }"
          >
            <ion-icon name="settings-outline"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  
  

  <style scoped>
  ion-tab-bar {
    --background: #202020;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1); 
  }
  
  ion-tab-button {
    color: gray; 
    transition: color 0.3s ease; 
  }
  
  .active-tab {
  color: var(--ion-color-success);
}
  
  ion-icon {
    font-size: 2em; 
  }
  
  @media (max-width: 600px) {
    ion-tab-button {
      --padding-bottom: 12px; 
    }
  }
  </style>
  