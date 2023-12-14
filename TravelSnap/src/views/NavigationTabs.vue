<script setup lang="ts">
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, personOutline, addOutline } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Routes to path
const navigateTo = (path: string) => {
  router.replace(path);
};

// Checks if the tab is active
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
          :class="{ 'active-tab': isActiveTab('/tabs/home') }">
          <ion-icon :icon="homeOutline" size="small"></ion-icon>
          <div v-if="isActiveTab('/tabs/home')" class="active-line"></div>
        </ion-tab-button>

        <ion-tab-button 
          @click="navigateTo('/tabs/newpost')" 
          :class="{ 'active-tab': isActiveTab('/tabs/newpost') }">
          <ion-icon :icon="addOutline" size="medium"></ion-icon>
          <div v-if="isActiveTab('/tabs/newpost')" class="active-line" ></div>
        </ion-tab-button>

        <ion-tab-button 
          @click="navigateTo('/tabs/profile')" 
          :class="{ 'active-tab': isActiveTab('/tabs/profile') }">
          <ion-icon :icon="personOutline" size="small"></ion-icon>
          <div v-if="isActiveTab('/tabs/profile')" class="active-line"></div>
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
  position: relative;
  color: gray; 
  transition: color 0.3s ease; 
}

.active-tab {
  color: var(--ion-color-success);
}

.active-line {
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
  width: 20%; 
  height: 2px; 
  background-color: var(--ion-color-success); 
}

</style>
  