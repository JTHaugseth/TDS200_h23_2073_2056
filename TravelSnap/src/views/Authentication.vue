<script setup lang="ts">
import { authService } from '@/service/firebase.authService';
import { IonButton, IonContent, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonIcon } from '@ionic/vue';
import { logoGoogle, eye, eyeOff } from 'ionicons/icons';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/* State */
const inRegisterMode = ref(false);
const inForgotPasswordMode = ref(false);
const isPasswordMismatch = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordStrength = ref({ message: '', color: '' });
const loginErrorMessage = ref('');


/* Data */
const userDetails = ref({
    id: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
});

// Login
const login = async () => {
    if (!userDetails.value.email || !userDetails.value.password) {
        loginErrorMessage.value = 'Please enter both email and password';
        return;
    }

    if (!isValidEmail(userDetails.value.email)) {
        loginErrorMessage.value = 'Please enter a valid email address';
        return;
    }

    try {
        const user = await authService.login(userDetails.value.email, userDetails.value.password);
        const idToken = await user.getIdToken(/**foreceRefresh*/ true);
        localStorage.setItem("auth_token", idToken)
        router.replace('/tabs/home');
        loginErrorMessage.value = '';
    } catch (error) {
        console.log(error);
        loginErrorMessage.value = 'Incorrect email or password';
    }
}

// Check if email is valid
function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Registers a new user
const register = async () => {
    try {
        if (userDetails.value.password.length < 6) {
            console.error('Password must be at least 6 characters long.');
            return;
        }
        if (userDetails.value.password !== userDetails.value.confirmPassword) {
            isPasswordMismatch.value = true;
            return;
        } else {
            isPasswordMismatch.value = false;
        }
        await authService.register(userDetails.value.email, userDetails.value.password, userDetails.value.userName);
        await login();
    } catch (error) {
        console.log(error);
    }
}

// Google login
const googleLogin = async () => {
    try {
        const token = await authService.signinWithGoogle();

        if (token) {
            localStorage.setItem("auth_token", token);
            router.replace('/tabs/home');
        } else {
            console.error('No token received from Google sign-in.');
        }
    } catch (error) {
        console.error(error);
    }
}

// Forgot password
const forgotPassword = async () => {
    try {
        await authService.resetPassword(userDetails.value.email);
        userDetails.value.email = '';
    } catch (error) {
        console.error(error);
    }
}

// Toggles the forgot password mode
const toggleForgotPassword = async () => {
    inForgotPasswordMode.value = !inForgotPasswordMode.value;
}

// Toggles the register mode
const toggleRegisterMode = () => {
    inRegisterMode.value = !inRegisterMode.value;
};

// Password mismatch
watch(
    () => [userDetails.value.password, userDetails.value.confirmPassword],
    ([newPassword, newConfirmPassword]) => {
        isPasswordMismatch.value = newPassword !== newConfirmPassword;
    }
);

// Assess password strength
const assessPasswordStrength = (password: string) => {
    let result = { message: '', color: '' };
    if (password.length < 6) {
        result = { message: 'Weak password. It needs atleast 6 characters.', color: 'red' };
    } else if (password.length < 10) {
        result = { message: 'Medium password.', color: 'yellow' };
    } else {
        result = { message: 'Strong password.', color: 'green' };
    }
    return result;
};

// Password strength
watch(() => userDetails.value.password, (newPassword) => {
    passwordStrength.value = assessPasswordStrength(newPassword);
});

</script>

<template>
    <ion-page>
        <ion-content>
            <ion-list>

                <ion-list-header>
                    <ion-title v-if="inRegisterMode">Create Account</ion-title>
                    <ion-title v-else-if="inForgotPasswordMode"> Reset Password</ion-title>
                    <ion-title v-else>Sign in</ion-title>
                </ion-list-header>

                <ion-label v-if="loginErrorMessage" class="login-error-message">
                    {{ loginErrorMessage }}
                </ion-label>
                <ion-item v-if="inRegisterMode">
                    <div class="input-container">
                        <ion-input class="username-input" placeholder=" Username"
                            v-model="userDetails.userName"></ion-input>
                    </div>
                </ion-item>

                <ion-item>
                    <div class="input-container">
                        <ion-input class="email-input" placeholder=" Email" type="email"
                            v-model="userDetails.email"></ion-input>
                    </div>
                </ion-item>
                <ion-label v-if="inRegisterMode" class="password-strength-label" :style="{ color: passwordStrength.color }">
                    {{ passwordStrength.message }}
                </ion-label>

                <ion-item v-if="!inForgotPasswordMode">
                    <div class="input-container">
                        <ion-input :type="showPassword ? 'text' : 'password'" placeholder=" Password"
                            v-model="userDetails.password" class="password-input">
                        </ion-input>
                        <ion-button class="show-password-button" @click="showPassword = !showPassword" fill="clear">
                            <ion-icon :icon="showPassword ? eye : eyeOff"></ion-icon>
                        </ion-button>
                    </div>
                </ion-item>
                <ion-label v-if="inRegisterMode && isPasswordMismatch" class="password-error-message">Passwords do not
                    match.
                </ion-label>

                <ion-item v-if="inRegisterMode">
                    <div class="input-container">
                        <ion-input :type="showConfirmPassword ? 'text' : 'password'" placeholder=" Confirm Password"
                            v-model="userDetails.confirmPassword"></ion-input>
                        <ion-button class="show-password-button" @click="showConfirmPassword = !showConfirmPassword"
                            fill="clear">
                            <ion-icon :icon="showConfirmPassword ? eye : eyeOff"></ion-icon>
                        </ion-button>
                    </div>
                </ion-item>



                <ion-item v-if="!inRegisterMode && !inForgotPasswordMode" lines="none">
                    <ion-label @click="toggleForgotPassword" class="forgot-password-link">
                        Forgot Password?
                    </ion-label>
                </ion-item>

                <ion-item v-if="inForgotPasswordMode" lines="none" class="center-text">
                    <ion-label @click="toggleForgotPassword" class="forgot-password-link">
                        Back
                    </ion-label>
                </ion-item>

                <ion-item v-if="inRegisterMode" lines="none" class="center-text">
                    <ion-label @click="toggleRegisterMode" class="forgot-password-link">
                        Back
                    </ion-label>
                </ion-item>

                <ion-button v-if="inRegisterMode" @click="register" class="button-auth" size="default">
                    Register Account
                </ion-button>
                <ion-button v-else-if="!inForgotPasswordMode" @click="login" class="button-auth" size="default">
                    Log in
                </ion-button>

                <ion-button v-if="inForgotPasswordMode" @click="forgotPassword" class="button-auth" size="default">
                    Reset Password
                </ion-button>

                <ion-button v-if="!inForgotPasswordMode && !inRegisterMode" @click="googleLogin" class="button-google"
                    size="default">
                    <ion-icon :icon="logoGoogle"></ion-icon>
                </ion-button>

                <ion-item v-if="!inForgotPasswordMode && !inRegisterMode" lines="none">
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
    display: flex;
}

ion-list {
    display: flex;
    flex-direction: column;
    margin-top: 20%;
}

.ios {
    padding: 0;
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

.input-container {
    display: flex;
    width: 100%;
    padding-left: 4%;
    padding-right: 4%;
}

ion-input {
    --color: #ffffff;
    --placeholder-color: #b1b1b1;
}

.show-password-button {
    --background: transparent;
    --border-width: 0;
    --ripple-color: transparent;
    --color: #ffffff;
    /* Adjust as needed */
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

.button-google {
    margin-top: 3%;
    margin-left: 10%;
    margin-right: 10%;
    --background: var(--ion-color-tertiary-contrast);
    --color: black;
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

.forgot-password-link {
    color: var(--ion-color-tertiary-contrast);
    cursor: pointer;
    text-decoration: underline;
    text-align: center;
}

.password-error-message {
    color: red !important;
    font-size: 0.6rem;
    padding-top: 5px;
    margin-left: 4%;
}

.show-password-button ion-icon {
    --color: #ffffff;
}

.password-strength-label {
    font-size: 0.6rem;
    padding-top: 5px;
    margin-left: 4%;
}

.login-error-message {
    color: red !important;
    font-size: 0.8rem;
    text-align: center;
    padding-top: 10px;
}
</style>
