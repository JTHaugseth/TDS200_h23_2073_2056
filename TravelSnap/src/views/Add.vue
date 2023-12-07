<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonChip, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar, toastController } from '@ionic/vue';
import { cameraOutline, trashOutline, add } from 'ionicons/icons';
import { ref } from 'vue';
import { Camera, CameraResultType } from '@capacitor/camera';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as storageRef
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from 'vue-router';

const router = useRouter();
const newLocation = ref({
  title: '',
  description: '',
  hashtags: [],
  imageUrls: [],
  latitude: null,
  longitude: null,
  id: ''
});
const locationCollection = collection(getFirestore(), "locations");
const newHashtagText = ref("");

const addNewHashtag = () => {
  if (newHashtagText.value && !newLocation.value.hashtags.includes(newHashtagText.value)) {
    newLocation.value.hashtags.push(newHashtagText.value);
    newHashtagText.value = "";
  }
};

const postNewLocation = async () => {
  if (!newLocation.value.title || !newLocation.value.description || newLocation.value.imageUrls.length === 0) {
    alert("Please complete all fields and upload at least one image");
    return;
  }
 

  try {
    const generatedUUID = uuidv4();
    const newImageUrls = [];
    for (const imageUrl of newLocation.value.imageUrls) {
      const imageName = `${new Date().getTime()}.jpg`;
      const storage = getStorage();
      const imageStorageRef = storageRef(storage, `images/${imageName}`);
      const response = await fetch(imageUrl);
      const imageBlob = await response.blob();
      const snapshot = await uploadBytes(imageStorageRef, imageBlob);
      const url = await getDownloadURL(snapshot.ref);
      newImageUrls.push(url);
    }
    newLocation.value.imageUrls = newImageUrls;
    newLocation.value.id = generatedUUID;
    await setDoc(doc(locationCollection, generatedUUID), newLocation.value);
    router.replace('/home');
  } catch (error) {
    console.error("Error posting location:", error);
    alert("Error posting location");
  }
};

const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri,
  });
  if (photo.webPath) {
    newLocation.value.imageUrls.push(photo.webPath);
  }
};

const removeImagePreview = (index) => {
  if (index >= 0 && index < newLocation.value.imageUrls.length) {
    newLocation.value.imageUrls.splice(index, 1);
  }
};
</script>
<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Add New Location</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-list>
          <div v-for="(imageUrl, index) in newLocation.imageUrls" :key="index">
            <img :src="imageUrl" />
            <ion-button @click="() => removeImagePreview(index)">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </div>
  
          <ion-item>
            <ion-input type="text" v-model="newLocation.title" placeholder="title"></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-textarea v-model="newLocation.description" placeholder="Description"></ion-textarea>
          </ion-item>
  
          <ion-item>
            <ion-input type="number" v-model="newLocation.latitude" placeholder="latitude"></ion-input>
          </ion-item>
  
          <ion-item>
            <ion-input type="number" v-model="newLocation.longitude" placeh="longitude"></ion-input>
          </ion-item>

          <ion-button @click="triggerCamera" color="light">
            Take a Photo  
            <ion-icon name="camera"></ion-icon>
          </ion-button>
  
          <ion-button @click="postNewLocation" color="primary">
            Post Location
          </ion-button>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  

  <style>
  ion-content {
  --background: #202020;
}

  ion-page {
    --ion-background-color: #202020;
    --ion-text-color: #333;
  }
  ion-list {
    --ion-background-color: #202020;
  }
  
  
  ion-toolbar {
    --padding-start: 20px;
    --padding-end: 20px;
  }
  
  ion-item {
    --border-radius: 8px;
    --padding-start: 20px;
    --padding-end: 20px;
    margin-bottom: 10px;
  }
  
  ion-input, ion-textarea {
    --color: #666;
    --placeholder-color: #aaa;
    --padding-start: 8px;
    --padding-end: 8px;
  }
  
  ion-button {
    --border-radius: 4px;
    --padding-vertical: 10px;
    --padding-horizontal: 20px;
    margin: 10px 0;
  }
  
  img {
    max-width: 100%;
    height: auto;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  
  ion-icon {
    --ionicon-stroke-width: 48px;
  }
  </style>
  
