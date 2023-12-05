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
  apiKey: "AIzaSyDg9q7sLBYILH7ZEddUWPpaw-ySfF7LUOE",
  authDomain: "travelsnap-21052.firebaseapp.com",
  projectId: "travelsnap-21052",
  storageBucket: "travelsnap-21052.appspot.com",
  messagingSenderId: "257731131874",
  appId: "1:257731131874:web:c472fb8abde3f2cca021bb",
  measurementId: "G-SLEJ0FRCLF"
};

initializeApp(firebaseConfig)

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  

router.isReady().then(() => {
  app.mount('#app');
});