import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import Home from '../views/Home.vue';
import Authentication from '../views/Authentication.vue';
import { toastController } from "@ionic/vue";
import { authService } from '@/service/firebase.authService';

const parseJwt = (token:string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

const authenticationRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
    if (!userAccessToken) {
      return { name: "Login" }
    }

    const jwtPayload = parseJwt(userAccessToken);

    const userAccessTokenExpiresAt = jwtPayload?.exp as unknown as number;

    if (userAccessTokenExpiresAt < Date.now()/1000) {
      // token expired
      localStorage.removeItem("auth_token");
      const errorToast = await toastController.create({
        message: "Brukersesjon er utløpt – logg inn på nytt",
        duration: 3000,
        color: "warning"
      });

      await errorToast.present();
      
      await authService.logout();
      return { name: "Login" }
    }
  //}

}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/authentication",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: Authentication,
  }
]

// process.env.BASE_URL
// import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router














