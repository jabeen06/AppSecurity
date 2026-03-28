import React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

/** Commit `assets/logo-5-1.png`; Metro bundles it into the app binary for store / EAS builds. */
const logo = require('../../assets/logo-5-1.png');

export default function ScreenContainer({ title, children, showLogo = true }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        {showLogo ? (
          <View style={styles.logoWrap}>
            <Image source={logo} style={styles.logo} resizeMode="contain" accessibilityLabel="Arbor International School" />
          </View>
        ) : null}
        <Text style={styles.title}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eef1ed' },
  wrapper: { padding: 16, gap: 14, paddingBottom: 28 },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96,125,59,0.12)'
  },
  logo: { width: '100%', height: 64, maxWidth: 280 },
  title: { fontSize: 22, fontWeight: '800', color: '#1a1f2e', letterSpacing: -0.3 }
});
