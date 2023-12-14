<script setup lang="ts">
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
} from '@ionic/vue';

import { arrowBack } from 'ionicons/icons';
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { GoogleMap } from '@capacitor/google-maps';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const mapRef = ref<HTMLElement>();
let newMap: GoogleMap;

// NextTick is used to wait for the DOM to be updated before calling initMap
onMounted(async () => {
  await nextTick();
  await initMap();
});

// Destroy the map when the component is unmounted
onBeforeUnmount(() => {
  if (newMap) {
    newMap.destroy();
  }
});

// Initialize the map
const initMap = async () => {
  if (!mapRef.value) {
    return;
  }

  let initialLat = route.query.lat ? parseFloat(route.query.lat as string) : 60.417;
  let initialLng = route.query.lng ? parseFloat(route.query.lng as string) : 5.172;

  let initialCenter = { lat: initialLat, lng: initialLng };

  try {
    newMap = await GoogleMap.create({
      id: 'map',
      element: mapRef.value,
      apiKey: 'AIzaSyCj3RlB_EBCnZ9Ax5Lg7OQhY95IuVZRrdc',
      config: {
        center: initialCenter,
        zoom: 16,
      },
    });

    await newMap.addMarker({
      coordinate: initialCenter,
    });

  } catch (error) {
    console.error('Error creating map:', error);
  }
};

// Routes you back to the previous view
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
          <ion-title>Map</ion-title>
        </ion-toolbar>
      </ion-header>

    <ion-content>
      <capacitor-google-map ref="mapRef" style="display: inline-block; width: 100%; height: 100%"></capacitor-google-map>
    </ion-content>

  </ion-page>
</template>



<style scoped >
capacitor-google-map {
  display: inline-block;
  width: 100%;
  height: 100%;
}

ion-content {
  --background: transparent !important;
}
</style>

