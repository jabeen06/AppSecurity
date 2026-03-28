import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../utils/formatApiError';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const onLogin = async () => {
    setLoginError('');
    try {
      await login(email, password);
    } catch (e) {
      setLoginError(formatApiError(e));
    }
  };

  return (
    <ScreenContainer title="The Oratory Guild">
      <View style={styles.stack}>
        {route.params?.registered ? (
          <Text style={styles.successBanner}>Registration complete. Please sign in.</Text>
        ) : null}
        <TextInput style={styles.input} placeholder="School email (username)" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
        {loginError ? <Text style={styles.err}>{loginError}</Text> : null}
        <Button title="Login" onPress={onLogin} />
        <View style={styles.registerRow}>
          <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 12 },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d2d9f0', padding: 12 },
  successBanner: { color: '#1b5e20', fontWeight: '700', backgroundColor: '#e8f5e9', padding: 10, borderRadius: 8 },
  err: { color: '#c1121f', fontWeight: '700' },
  registerRow: { marginTop: 6 }
});
