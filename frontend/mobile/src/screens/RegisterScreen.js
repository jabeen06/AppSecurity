import React, { useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { formatApiError } from '../utils/formatApiError';

const CLASSES = ['6', '7', '8'];

export default function RegisterScreen() {
  const navigation = useNavigation();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState('6');
  const [section, setSection] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => name && section && phoneNumber && email && password && confirm, [
    name,
    section,
    phoneNumber,
    email,
    password,
    confirm
  ]);

  const onSubmit = async () => {
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (!canSubmit) return;
    setLoading(true);
    try {
      await register({ name, studentClass, section, phoneNumber, email, password });
      Alert.alert('Account created', 'Please sign in with your school email and password.');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login', params: { registered: true } }]
        })
      );
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer title="Register">
      <View style={styles.stack}>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />

        <View style={styles.classRow}>
          {CLASSES.map((c) => (
            <View key={c} style={styles.classChip}>
              <Button title={`Class ${c}`} onPress={() => setStudentClass(c)} color={studentClass === c ? '#0b6cff' : undefined} />
            </View>
          ))}
        </View>

        <TextInput style={styles.input} placeholder="Section" value={section} onChangeText={setSection} autoCapitalize="characters" />
        <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <Text style={styles.hint}>Optional SMS verification may be added by your school. Your number helps admins send meeting reminders.</Text>
        <Text style={styles.hint}>Username is your school email (used to sign in and for admin access).</Text>
        <TextInput style={styles.input} placeholder="School email (username)" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password (min 8)" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={confirm} onChangeText={setConfirm} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={loading ? 'Registering...' : 'Register'} disabled={!canSubmit || loading} onPress={onSubmit} />

        <View style={styles.loginRow}>
          <Button title="Back to Login" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  input: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#d2d9f0', padding: 12 },
  classRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  classChip: { width: '30%' },
  hint: { fontSize: 12, color: '#6c757d', marginBottom: 4 },
  error: { color: '#c1121f', fontWeight: '700' },
  loginRow: { marginTop: 6 }
});

