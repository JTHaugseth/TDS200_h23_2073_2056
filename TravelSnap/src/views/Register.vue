<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Register</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <form @submit.prevent="register">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="password" type="password"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Confirm Password</ion-label>
            <ion-input v-model="confirmPassword" type="password"></ion-input>
          </ion-item>
          <ion-button expand="block" type="submit">Register</ion-button>
        </form>
        <p v-if="error">{{ error }}</p>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { authService } from '@/service/authService'; // Adjust the path as needed
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const error = ref('');
  
      const register = async () => {
        if (password.value !== confirmPassword.value) {
          error.value = "Passwords do not match";
          return;
        }
  
        try {
          await authService.register(email.value, password.value);
          // Redirect or show a success message
        } catch (err) {
          error.value = err.message;
        }
      };
  
      return { email, password, confirmPassword, error, register };
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>