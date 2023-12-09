<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  toastController, IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/vue';

import { ref, onMounted, nextTick, watch } from 'vue';
import { GoogleMap } from '@capacitor/google-maps';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { logoIonic } from 'ionicons/icons';

const router = useRouter();
const route = useRoute();
const mapRef = ref<HTMLElement>();
let newMap: GoogleMap;
const geopoint = ref<{ lat: number; lng: number } | null>(null);

onMounted(async () => {
  console.log("Component mounted");
  
    
      console.log("Before nextTick in watcher");
      await nextTick();
      console.log("After nextTick, before calling initMap");
      await initMap();
    
 
});

const initMap = async () => {
  console.log("initMap called");
  if (!mapRef.value) {
    console.log("mapRef is not available in DOM");
    return;
  }
  console.log("mapRef is available, proceeding with map initialization");

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




// @click="confirmLocation"
</script>

<template>

<ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" text="" color="primary"></ion-back-button>
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

