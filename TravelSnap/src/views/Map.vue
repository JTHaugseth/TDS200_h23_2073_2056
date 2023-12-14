<script setup lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';

import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { GoogleMap } from '@capacitor/google-maps';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';


const router = useRouter();
const route = useRoute();
const mapRef = ref<HTMLElement>();
let newMap: GoogleMap;
const geopoint = ref<{ lat: number; lng: number } | null>(null);

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

    let markerId = await newMap.addMarker({
      coordinate: initialCenter,
    });

    newMap.setOnMapClickListener(async (location) => {
      geopoint.value = {
        lat: location.latitude,
        lng: location.longitude,
      };

      console.log(geopoint.value)

      if (markerId) {
        await newMap.removeMarker(markerId);
      }

      markerId = await newMap.addMarker({
        coordinate: {
          lat: location.latitude,
          lng: location.longitude,
        },
      });
    });
  } catch (error) {
    console.error('Error creating map:', error);
  }
};

// Confirm the location and return to the previous view
const confirmLocation = () => {
  let finalLat = geopoint.value ? geopoint.value.lat : (route.query.lat ? parseFloat(route.query.lat as string) : 60.417);
  let finalLng = geopoint.value ? geopoint.value.lng : (route.query.lng ? parseFloat(route.query.lng as string) : 5.172);

  const returnPath = typeof route.query.returnPath === 'string' ? route.query.returnPath : '/tabs/newpost';
  router.replace({
    path: returnPath,
    query: {
      lat: finalLat.toString(),
      lng: finalLng.toString()
    }
  });
};

</script>

<template>
  <ion-page>
    
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button @click="confirmLocation" default-href="/tabs/home" text="" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title> Where was the picture taken? </ion-title>
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

