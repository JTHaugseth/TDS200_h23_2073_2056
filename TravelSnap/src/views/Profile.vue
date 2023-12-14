<script setup lang="ts">
import {IonPage,IonHeader,IonToolbar,IonTitle,IonContent,IonButton,IonAvatar,IonIcon} from '@ionic/vue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/service/firebase.authService';
import { firestoreService } from "@/service/firebase.firestoreService";
import { imagesOutline, heartOutline } from 'ionicons/icons';
import { Post } from '@/models/postInterface';
import { UserProfile } from '@/models/userProfileInterface';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const userProfile = ref<UserProfile | null>(null);
const userPosts = ref<Post[]>([]);
const showPosts = ref(true);
const activeIcon = ref('posts');
const isLoading = ref(true);
const allPosts = ref<Post[]>([]);
const router = useRouter();

// Fetch user profile and posts
const fetchUserProfileAndPosts = async () => {
  const currentUser = await authService.currentUser();
  if (currentUser) {
    userProfile.value = await firestoreService.getUserProfile(currentUser.uid) as UserProfile;
    allPosts.value = await firestoreService.getAllPosts(); 
    userPosts.value = allPosts.value.filter(post => post.postedBy === currentUser.uid); 
    isLoading.value = false;
  }
};

onMounted(fetchUserProfileAndPosts);

// Logout
const logout = async () => {
  await authService.logout();
  router.push('/authentication');
};

// Show posts grid
const showPostsGrid = () => {
  showPosts.value = true;
  activeIcon.value = 'posts';
};

// Show liked posts
const showLikes = () => {
  showPosts.value = false;
  activeIcon.value = 'likes';
};

// Get posts liked by the user
const likedPosts = computed(() => {
  return allPosts.value.filter(post => userProfile.value?.likedPosts.includes(post.id));
});

// Get posts to display
const displayPosts = computed(() => {
  if (activeIcon.value === 'posts') {
    return userPosts.value;
  } else if (activeIcon.value === 'likes') {
    return likedPosts.value;
  }
  return [];
});

// Select profile picture
const selectProfilePicture = async () => {
  try {
    const photo = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });

    const imageUrl = photo.webPath ?? photo.path;
    if (imageUrl) {
      uploadProfilePicture(imageUrl);
    }
  } catch (error) {
    console.error('Error selecting profile picture:', error);
  }
};

// Upload new profile picture
const uploadProfilePicture = async (imageUrl: string) => {
  try {
    const currentUser = await authService.currentUser();
    if (!currentUser) throw new Error('User not logged in.');

    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();
    const uploadedImageUrl = await firestoreService.uploadProfilePictureAndGetURL(currentUser.uid, new File([imageBlob], "profile-picture.jpg", { type: "image/jpeg" }));
    
    await firestoreService.updateUserProfilePicture(currentUser.uid, uploadedImageUrl);
    
    if (userProfile.value) {
      userProfile.value.profilePicture = uploadedImageUrl;
    }

  } catch (error) {
    console.error('Error uploading profile picture:', error);
  }
};

// Open a post
const openPost = (id: string) => {
  router.push({
      path: '/view-post',
      query: {
        postId: id,
      }
  })
};

</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
        <ion-button slot="end" size="small" class="profile-button" @click="logout">Logout</ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content class="profile-content">
      <div class="profile-container">
        <ion-avatar class="avatar">
          <img :src="userProfile?.profilePicture || 'default-image-url'" alt="Profile Picture" />
        </ion-avatar>
        <div class="username-label">{{ userProfile?.username }}</div>
        <IonButton size="small" class="profile-button" @click="selectProfilePicture">Edit profile picture</IonButton>
        <div class="overlay-icons">
          <IonIcon :icon="imagesOutline" @click="showPostsGrid" aria-label="Posts"
            :class="{ active: activeIcon === 'posts' }"></IonIcon>
          <IonIcon :icon="heartOutline" @click="showLikes" aria-label="Liked Posts"
            :class="{ active: activeIcon === 'likes' }"></IonIcon>
        </div>
      </div>
      <div v-if="isLoading" class="loading-spinner"></div>

      <div v-else>
        <div v-if="displayPosts.length > 0" class="posts-grid">
          <div v-for="post in displayPosts" :key="post.id" class="post-container">
            <img class="post-item" :src="post.imageURL" :alt="post.description" @click="openPost(post.id)" />
          </div>
        </div>
        <div v-else class="no-liked-posts-message">
          No posts to display
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<style scoped>
ion-content {
  --background: #202020;
}

ion-toolbar {
  --background: #202020;
  --color: white;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100px;
  height: 100px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4%;
}

.username-label {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 1.2em;
  text-align: center;
  color: white;
}

.logout-button {
  --background: gray;
  --border-radius: 5px;
  --padding: 5px 10px;
  font-size: 0.8em;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  width: 100%;
  max-width: 600px;
  margin: auto;
}

.post-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
  border-top: gray solid 1px;
  margin-top: 0px;
  animation: slideInFromLeft 0.5s ease-out forwards;
}

.post-item {
  width: 100%;
  height: 100%;
  object-fit: cover;

}

.overlay-icons ion-icon {
  font-size: 24px;
  color: white;
}

.overlay-icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.no-liked-posts-message {
  color: white;
  font-size: 1.5em;
  text-align: center;
  margin-top: 20px;
}

.overlay-icons ion-icon.active {
  border-bottom: 2px solid white;

}

.no-liked-posts-message {
  color: white;
  font-size: 1.5em;
  text-align: center;
  margin-top: 0px;
}

.profile-button {
  --background: rgba(255, 255, 255, 0.205);
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.loading-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #fff;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
  margin: 50px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}</style>


