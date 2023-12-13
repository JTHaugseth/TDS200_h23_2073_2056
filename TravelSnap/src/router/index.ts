import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { toastController } from "@ionic/vue";
import { authService } from '@/service/firebase.authService';
import Home from '../views/Home.vue';
import Authentication from '../views/Authentication.vue';
import Profile from '../views/Profile.vue';
import NewPost from '../views/NewPost.vue';
import NavigationTabs from '../views/NavigationTabs.vue';
import Map from '../views/Map.vue';
import ViewPost from '../views/ViewPost.vue';

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    return null;
  }
};

const authenticationRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");
  if (!userAccessToken) {
    return { name: "Authentication" }
  }

  const jwtPayload = parseJwt(userAccessToken);
  const userAccessTokenExpiresAt = jwtPayload?.exp as unknown as number;

  if (userAccessTokenExpiresAt < Date.now() / 1000) {
    localStorage.removeItem("auth_token");
    const errorToast = await toastController.create({
      message: "User access token expired. Please log in again.",
      duration: 3000,
      color: "warning"
    });

    await errorToast.present();

    await authService.logout();
    return { name: "Authentication" }
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/authentication",
  },
  {
    path: '/tabs/',
    component: NavigationTabs,
    children: [
      {
        path: '',
        redirect: '/tabs/home',
      },
      {
        path: 'home',
        component: Home,
        beforeEnter: [authenticationRouteGuard]
      },
      {
        path: 'profile',
        component: Profile,
        beforeEnter: [authenticationRouteGuard]
      },
      {
        path: 'newpost',
        component: NewPost,
        beforeEnter: [authenticationRouteGuard]
      }
    ]
  },
  {
    path: "/authentication",
    name: "Authentication",
    component: Authentication,
  },
  {
    path: '/map',
    component: Map,
    beforeEnter: [authenticationRouteGuard]
  },
  {
    path: '/view-post',
    name: 'ViewPost',
    component: ViewPost,
    props: true,
    beforeEnter: [authenticationRouteGuard]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;