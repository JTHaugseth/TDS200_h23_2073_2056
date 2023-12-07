<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
  toastController 
} from '@ionic/vue';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { FirebaseStorage } from 'firebase/storage';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const title = ref('');
const description = ref('');
const image = ref<string | null>(null);
const geopoint = ref(null);
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
  // Code to get current geolocation
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
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <IonBackButton />
        </ion-buttons>
        <ion-title>New Post</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-grid>

        <ion-row>
          <ion-col size="5">
            <ion-button expand="block" @click="takePicture">Take Picture</ion-button>
          </ion-col>
          <ion-col size="5">
            <ion-button expand="block" @click="selectImage">Upload Image</ion-button>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-item>
              <IonInput v-model="title" label="Title"></IonInput>
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-item>
              <IonTextarea v-model="description" label="Description"></IonTextarea>
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="5">
            <ion-button expand="block" @click="getCurrentLocation">Get Location</ion-button>
          </ion-col>
        </ion-row>

        <ion-row>
    <ion-col size="12">
      <div v-if="image" class="image-container">
        <img :src="image" />
        <ion-button class="remove-image-button" @click="removeImage" color="danger">X</ion-button>
      </div>
    </ion-col>
  </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-button expand="block" @click="submitPost">Submit Post</ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
  
  <style scoped>

  ion-toolbar {
    --background: #202020;
    box-shadow: 0px -2px 5px rgba(0, 0, 0, 0.1); 
    border-bottom: 1px solid #ffffff;
    color: var(--ion-color-success)
  }

  ion-button {
    --background: var(--ion-color-success);
    margin-top: 10px;
  }

  .image-container {
    position: relative;
    display: inline-block; /* or 'block' depending on your layout */
  }

  .image-container img {
    width: 100%; /* Adjust as needed */
    height: auto; /* Adjust as needed */
  }

  .remove-image-button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(255, 0, 0, 0.7); /* Semi-transparent red background */
    color: white;
  }

  
  
  </style>
  
