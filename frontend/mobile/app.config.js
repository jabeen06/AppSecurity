/** @type {import('@expo/config').ExpoConfig} */
export default {
  expo: {
    name: 'The Oratory Guild',
    slug: 'oratory-guild',
    version: '1.0.0',
    scheme: 'oratory-guild',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    // Dev / LAN HTTP to your laptop API. Production API should use HTTPS.
    android: {
      usesCleartextTraffic: true
    },
    ios: {
      infoPlist: {
        NSAppTransportSecurity: {
          NSAllowsLocalNetworking: true
        }
      }
    }
  }
};
