import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.labeltoladder',
  appName: 'Label-to-Ladder',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For live preview during dev, point at your published URL OR your dev URL:
    // url: 'http://localhost:8081/',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
