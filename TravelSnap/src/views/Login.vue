<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <form @submit.prevent="login">
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input v-model="email" type="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input v-model="password" type="password"></ion-input>
          </ion-item>
          <ion-button expand="block" type="submit">Login</ion-button>
        </form>
        <p v-if="error">{{ error }}</p>
        <ion-button @click="loginWithGoogle" expand="block">Login with Google</ion-button>
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
      const error = ref('');
  
      const login = async () => {
        try {
          await authService.login(email.value, password.value);
          // Redirect or handle the logged-in user
        } catch (err) {
          error.value = err.message;
        }
      };
  
      const loginWithGoogle = async () => {
        try {
          await authService.signinWithGoogle();
          // Handle successful login
        } catch (err) {
          error.value = err.message;
        }
      };
  
      return { email, password, error, login, loginWithGoogle };
    },
  };
  </script>
  
  <style>
  /* Add your styles here */
  </style>