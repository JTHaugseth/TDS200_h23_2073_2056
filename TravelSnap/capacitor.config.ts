import { CapacitorConfig } from '@capacitor/cli';

// Google Maps API Key
// AIzaSyCj3RlB_EBCnZ9Ax5Lg7OQhY95IuVZRrdc

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'yourAppName',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleMapsPlugin: {
      apiKey: 'AIzaSyCj3RlB_EBCnZ9Ax5Lg7OQhY95IuVZRrdc' 
    }
  }
};

export default config;
