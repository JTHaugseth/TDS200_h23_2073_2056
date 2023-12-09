<script setup lang="ts">
import { ref } from 'vue';
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
import { imageOutline, cameraOutline, earthOutline, trash } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { useRouter } from 'vue-router';

const router = useRouter();
const title = ref('');
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
  try {
    const coordinates = await Geolocation.getCurrentPosition();
    geopoint.value = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };

    // Navigate to Map.vue with the return path and current geolocation
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

const submitPost = async () => {
  // Code to upload image to Firebase Storage and save post data to Firestore
};

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
          <IonIcon :icon="imageOutline" @click="selectImage" class="icon-style" aria-label="upload picture">
          </IonIcon>
          <IonIcon :icon="cameraOutline" @click="takePicture" class="icon-style" aria-label="upload picture">
          </IonIcon>
          <IonIcon :icon="earthOutline" @click="getCurrentLocation" class="icon-style" aria-label="Get location">
          </IonIcon>
        </ion-item>
        <ion-item v-if="image">
          <div class="image-container">
            <IonIcon :icon="trash" @click="removeImage" class="delete-icon"></IonIcon>
            <img :src="image || ''" />
          </div>
        </ion-item>
        <ion-item>
          <ion-button size="small" @click="submitPost">Submit</ion-button>
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

.confirm-location-button {
  --background: var(--ion-color-primary);
  margin-top: 10px;
}
</style>
  
