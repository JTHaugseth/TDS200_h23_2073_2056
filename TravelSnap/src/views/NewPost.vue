<script setup lang="ts">
import { ref, watch } from 'vue';
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
import { imageOutline, cameraOutline, earthOutline, trash, heart, chatboxEllipsesOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';
import { authService } from '@/service/firebase.authService';


const router = useRouter();
const user = authService.currentUser();

const description = ref('');
const image = ref<string | null>(null);
const geopoint = ref<{ lat: number; lng: number } | null>(null);



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
  console.log("getCurrentLocation called");
  console.log("Current set geopoint: ", geopoint.value);

  if (geopoint.value && geopoint.value.lat && geopoint.value.lng) {
    router.push({
      path: '/map',
      query: {
        returnPath: '/tabs/newpost',
        lat: geopoint.value.lat,
        lng: geopoint.value.lng
      }
    });
    return;
  }

  try {
    const coordinates = await Geolocation.getCurrentPosition();
    geopoint.value = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };
    console.log("New set geopoint: ", geopoint.value);

    router.push({
      path: '/map',
      query: {
        returnPath: '/tabs/newpost',
        lat: geopoint.value.lat,
        lng: geopoint.value.lng
      }
    });
  } catch (error) {
    console.error('Error getting location:', error);
  }
};

watch(() => router.currentRoute.value, (newRoute, oldRoute) => {
  const lat = newRoute.query.lat;
  const lng = newRoute.query.lng;

  if (typeof lat === 'string' && typeof lng === 'string') {
    geopoint.value = {
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    };
  }
});

const submitPost = async () => {
  // Code to upload image to Firebase Storage and save post data to Firestore
};

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title size="large">Create a post!</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <hr>
      <div class="preview-container">
        <div class="preview">
          <div class="image-container">
            <img :src="image || ''" />
            <div class="preview-overlay">
              <div class="overlay-content">
                <h2 class="overlay-title">Preview Title</h2>
                <p class="overlay-description">{{ description  }}</p>
              </div>
              <div class="overlay-icons">
                <IonIcon :icon="earthOutline" aria-hidden="true"></IonIcon>
                <IonIcon :icon="heart" color="danger" aria-hidden="true"></IonIcon>
                <IonIcon :icon="chatboxEllipsesOutline" aria-hidden="true"></IonIcon>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr>

      <ion-item class="image-geo-import-bar">
        <div class="image-geo-import-container">
          <IonIcon :icon="imageOutline" @click="selectImage" aria-label="Upload Image"></IonIcon>
          <IonIcon :icon="cameraOutline" @click="takePicture" aria-label="Upload Image"></IonIcon>
          <IonIcon :icon="earthOutline" @click="getCurrentLocation" aria-label="Get Location"></IonIcon>
        </div>
      </ion-item>

      <hr>

      <ion-item class="geopoint-display">
        <div class="geopoint-info">
          <div v-if="geopoint && geopoint.lat && geopoint.lng" class="coordinates">
            <ion-label class="coordinates-label">Post coordinates:</ion-label>
            <ion-label>Lat: {{ geopoint.lat }}</ion-label>
            <ion-label>Lng: {{ geopoint.lng }}</ion-label>
          </div>
          <div v-else>
            <ion-label class="coordinates-label">Set location by clicking globe</ion-label>
          </div>
        </div>
      </ion-item>

      <hr>

      <ion-item class="item-input-container">
          <IonInput v-model="description" placeholder="Description"></IonInput>
      </ion-item>

      <hr>
      <hr>

      <ion-item class="item-button-container">
        <div class="button-container">
          <ion-button class="submit-button" @click="submitPost">Post</ion-button>
        </div>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

  
<style scoped>
/* CSS for background and title */
ion-content {
  --background: #202020;
}

ion-toolbar {
  --background: #202020;
  --color: var(--ion-color-success);
}

ion-title {
  text-align: center;
}

/* CSS for preview */
.preview-container {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 45vh;
}

.preview {
  width: 80%;
  height: 100%;
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: fit-content;
  border-radius: 10px;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  color: #fff;
}

.overlay-content {
  text-align: left;
}

.overlay-icons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.overlay-icons ion-icon {
  font-size: 24px;
  margin-bottom: 50%;
}

.overlay-title {
  font-size: 1.5em;
}

.overlay-description {
  font-size: 1em;
}

/* CSS for image-import and geolocation-import bar */
ion-item.image-geo-import-bar {
  --background: #202020;
  --border-color: transparent;
  border-top: 1px solid #fff;
  border-radius: 10px;
}

.image-geo-import-container {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.image-geo-import-container ion-icon {
  font-size: 30px;
  color: var(--ion-color-success);
}

ion-item.geopoint-container {
  --color: black;

}

/* Geolocation Text */
ion-item.geopoint-display {
  --background: #202020;
  --border-color: #fff;
  display: flex;
  justify-content: center;
}

.geopoint-info {
  text-align: start;
}

.coordinates-label {
  font-size: 1.2em;
  color: #fff;
}

.coordinates ion-label {
  display: block;
  color: #a56a3a;
}

/* Description input field */

ion-item.item-input-container {
  --background: #202020;
  --border-color: #fff;
  display: flex;
  justify-content: center;
}

.item-input-container ion-input {
  --color: #fff;
}

ion-item.item-button-container {
  --background: #202020;
  --border-color: transparent;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

ion-button.submit-button {
  --background: var(--ion-color-success);
  font-size: large;
}
</style>
  
