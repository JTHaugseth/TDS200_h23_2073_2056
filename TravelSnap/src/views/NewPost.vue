<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import {
  IonBackButton,
  IonButton,
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
import { logoIonic } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { FirebaseStorage } from 'firebase/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const title = ref('');
const description = ref('');
const image = ref<string | null>(null);
const geopoint = ref<{ lat: number; lng: number } | null>(null);
const showMap = ref(false);
const firestore = getFirestore();


const selectImage = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    const imageUrl = photo.webPath ?? photo.path;
    if (imageUrl) {
      image.value = imageUrl;
    }
  } catch (error) {
    console.error('Error selecting image from gallery:', error);
  }
};

const takePicture = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera
    });

    const imageUrl = photo.webPath ?? photo.path;
    if (imageUrl) {
      image.value = imageUrl;
    }
  } catch (error) {
    console.error('Error taking picture:', error);
  }
};

const removeImage = () => {
  image.value = null;
};

const getCurrentLocation = async () => {
  if (!geopoint.value) {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      geopoint.value = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error getting location:', error);
    }
  }

  showMap.value = true;
  nextTick(() => {
    initMap();
  });
};



const initMap = async () => {
  let initialCenter = geopoint.value || { lat: 60.417, lng: 5.172 }; 

  try {
    const map = await GoogleMap.create({
      id: 'map',
      element: document.getElementById('map') || document.createElement('div'),
      apiKey: 'AIzaSyCj3RlB_EBCnZ9Ax5Lg7OQhY95IuVZRrdc',
      config: {
        center: initialCenter,
        zoom: 16,
      },
    });

    let markerId = await map.addMarker({
      coordinate: initialCenter,
    });

    map.setOnMapClickListener(async (location) => {
      geopoint.value = {
        lat: location.latitude,
        lng: location.longitude,
      };

      console.log(geopoint.value)

      if (markerId) {
        await map.removeMarker(markerId);
      }

      markerId = await map.addMarker({
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

const confirmLocation = () => {
  showMap.value = false;
};

const submitPost = async () => {
  // Code to upload image to Firebase Storage and save post data to Firestore
};

onMounted(() => {
  // Initialization code if needed
});
</script>

<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Create a post!</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <ion-item>
          <IonInput v-model="title" aria-label="title" placeholder="Title" color="dark"></IonInput>
        </ion-item>
        <ion-item>
          <IonTextarea v-model="description" aria-label="Description" placeholder="Description"></IonTextarea>
        </ion-item>

        <ion-item>
          <IonIcon name="image-outline" @click="selectImage" class="icon-style" aria-label="upload picture">
          </IonIcon>
          <IonIcon name="camera-outline" @click="takePicture" class="icon-style" aria-label="upload picture">
          </IonIcon>
          <IonIcon name="earth-outline" @click="getCurrentLocation" class="icon-style" aria-label="Get location">
          </IonIcon>
        </ion-item>
        <ion-item v-if= "showMap">
          <capacitor-google-map id="map"></capacitor-google-map>
        </ion-item>
      <ion-item v-if="image && !showMap" >
        <div class="image-container">
        <IonIcon name="trash" @click="removeImage" class="delete-icon"></IonIcon>
          <img :src ="image || ''" />
      </div>
      </ion-item>
      <ion-item v-if="showMap">
        <ion-button @click="confirmLocation" size="small" class="confirm-location-flex">
        Confirm Location
      </ion-button>
      </ion-item>
      <ion-item v-if="!showMap">
        <ion-button  size="small" @click="submitPost">Submit</ion-button>
      </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

  
<style scoped>
ion-button {
  --background: var(--ion-color-success);
  padding-top: 0;
  margin: 0;
}

ion-item {
  margin: 0;
  width: 100%;
}

ion-list {
  margin: 0;
  padding: 0;
  width: 100%;
}

ion-page,
ion-content {
  --ion-background-color: #202020;
  color: #FFFFFF;
  width: 100%;
  margin: 0;
  padding: 0;
}

ion-item,
ion-label,
ion-button,
ion-input,
ion-textarea,
ion-title {
  --color: #ffffff;
}

.icon-style {
  font-size: 24px;
  color: var(--ion-color-primary);
  margin: 5px;
}

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img {
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
}

.delete-icon {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--ion-color-danger);
  font-size: 30px;
  cursor: pointer;
}

capacitor-google-map {
  display: inline-block;
  width: 275px;
  height: 400px;
}

.confirm-location-button {
  --background: var(--ion-color-primary);
  margin-top: 10px;
}
</style>
  
