<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Main View</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div>
          <h1>This is the main view</h1>
          <!-- You can add more content here as needed -->
        </div>
        <ion-button @click="logout" expand="block">Logout</ion-button>
      </ion-content>
    </ion-page>
  </template>
  
  <script >
  import { useRouter } from 'vue-router';
  import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonToggle, IonTitle, IonIcon, toastController } from '@ionic/vue';
  import { authService } from '@/service/firebase.authService'; // Adjust the path as needed
  
  export default {
    setup() {
      const router = useRouter();
  
      const logout = async () => {
        try {
          await authService.logout();
          router.push('/login'); // Redirect to login page after logout
        } catch (error) {
          console.error("Error during logout:", error);
          // Handle logout error if necessary
        }
      };
  
      return { logout };
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>