import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.labeltoladder',
  appName: 'Label-to-Ladder',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // For live preview during dev, point at your published URL OR your dev URL:
    // url: 'https://20c52ed5-ceb8-4a7b-9188-3297c47b3b9c.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  ios: {
    contentInset: 'always',
  },
};

export default config;
