import { createApp } from 'vue'
import App from './App.vue'
import router from './router';


import { IonicVue } from '@ionic/vue';

import { initializeApp } from "firebase/app";

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';


/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import './assets/global.css';

/* Theme variables */
import './theme/variables.css';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyADgQlyUgG-GYuVkKnFJ5rZuzheW0zSvqk",
  authDomain: "travelsnap-18f24.firebaseapp.com",
  projectId: "travelsnap-18f24",
  storageBucket: "travelsnap-18f24.appspot.com",
  messagingSenderId: "1035399130439",
  appId: "1:1035399130439:web:8a0037f28eafb2bf91b062",
  measurementId: "G-Z77LXBB34C"
};

initializeApp(firebaseConfig)

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  

router.isReady().then(() => {
  app.mount('#app');
});