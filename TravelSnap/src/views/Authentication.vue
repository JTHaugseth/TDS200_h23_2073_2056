<script setup lang="ts">
import { authService } from '@/service/firebase.authService';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonIcon } from '@ionic/vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getIdToken } from "firebase/auth";


const router = useRouter();

/* State */
const inRegisterMode = ref(false);
const isPasswordMismatch = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);


const userDetails = ref({
    id: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
});

const login = async () => {
    try {
        const user = await authService.login(userDetails.value.email, userDetails.value.password);
        const idToken = await user.getIdToken(/**foreceRefresh*/ true);
        localStorage.setItem("auth_token", idToken)
        router.replace('/home');
    } catch (error) {
        console.error(error);
    }
}

const register = async () => {
    try {
        if (userDetails.value.password !== userDetails.value.confirmPassword) {
            isPasswordMismatch.value = true;
            return;
        } else {
            isPasswordMismatch.value = false;
        }
        await authService.register(userDetails.value.email, userDetails.value.password);
        await login();
    } catch (error) {
        console.log(error);
    }
}

const googleLogin = async () => {
    try {
        const token = await authService.signinWithGoogle();

        if (token) {
            localStorage.setItem("auth_token", token);
            router.replace('/home');
        } else {
            console.error('No token received from Google sign-in.');
        }
    } catch (error) {
        console.error(error);
    }
}

const forgotPassword = async () => {
    // fix :)
}

const toggleRegisterMode = () => {
    inRegisterMode.value = !inRegisterMode.value;
};

watch(
    () => [userDetails.value.password, userDetails.value.confirmPassword],
    ([newPassword, newConfirmPassword]) => {
        isPasswordMismatch.value = newPassword !== newConfirmPassword;
    }
);

</script>

<template>
    <ion-page>
        <ion-content>
            <ion-list>

                <ion-list-header>
                    <ion-title>Sign in</ion-title>
                </ion-list-header>

                <ion-item v-if="inRegisterMode">
                    <ion-input placeholder="Username" v-model="userDetails.userName"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input placeholder="Email" type="email" v-model="userDetails.email"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-input :type="showPassword ? 'text' : 'password'" placeholder="Password"
                        v-model="userDetails.password"></ion-input>
                    <ion-button class="show-password-button" @click="showPassword = !showPassword" fill="clear">
                        <ion-icon :name="showPassword ? 'eye' : 'eye-off'"></ion-icon>
                    </ion-button>
                </ion-item>

                <ion-item v-if="inRegisterMode">
                    <ion-input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm Password"
                        v-model="userDetails.confirmPassword"
                        :style="{ 'border': isPasswordMismatch ? '1px solid red' : 'none', 'border-radius': '5px' }"></ion-input>
                    <ion-button class="show-password-button" @click="showConfirmPassword = !showConfirmPassword" fill="clear">
                        <ion-icon :name="showConfirmPassword ? 'eye' : 'eye-off'"></ion-icon>
                    </ion-button>
                    <ion-label v-if="isPasswordMismatch" class="password-error-message">Passwords do not match.</ion-label>
                </ion-item>

                <ion-item lines="none" class="center-text">
                    <ion-label @click="forgotPassword" class="forgot-password-link">
                        Forgot Password?
                    </ion-label>
                </ion-item>

                <ion-button v-if="inRegisterMode" @click="register" class="button-auth" size="default">
                    Registrer deg
                </ion-button>
                <ion-button v-else @click="login" class="button-auth" size="default">
                    Logg inn
                </ion-button>

                <ion-button @click="googleLogin" class="button-auth" fill="solid" color="dark" size="default">
                    <ion-icon name="logo-google"></ion-icon>
                </ion-button>

                <ion-item lines="none">
                    <ion-label class="label-mild-inline">
                        Don't have an account? <a class="register-link" @click="toggleRegisterMode">Sign up here</a>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<style scoped>
ion-content {
    --ion-background-color: #202020;
}

ion-list {
    display: flex;
    flex-direction: column;
}

ion-title {
    text-align: center;
    color: var(--ion-color-success);
}

.label-mild,
ion-label {
    --color: #e6e6e6 !important;
    /* Light grey for mild labels */
}

ion-input {
    --background: #333333;
    /* Darker background for input fields */
    --color: #ffffff;
    /* White text color for input fields */
    --placeholder-color: #b1b1b1;
    /* Lighter color for placeholders */
}

.button-auth {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
    --background: var(--ion-color-success);
    /* Darker background for buttons */
    --color: White;
    /* White text color for buttons */
}

.register-link {
    color: var(--ion-color-success);
    cursor: pointer;
    text-decoration: underline;
}
.label-mild-inline {
    text-align: center;
}

.password-mismatch {
    border: 1px solid red !important;
    border-radius: 5px;
}

.center-text {
    display: flex;
    text-align: center;
}

.forgot-password-link {
    color: var(--ion-color-success-contrast);
    cursor: pointer;
    text-decoration: underline;
}

.password-error-message {
    color: red !important;
    font-size: 0.8rem;
    padding-top: 5px;
}

.show-password-button {
    --background: transparent;
    --border-width: 0;
    --ripple-color: transparent;
    --color: #ffffff;
}

.show-password-button ion-icon {
    --color: #ffffff;
}
</style>
