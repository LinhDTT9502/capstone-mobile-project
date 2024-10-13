import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation();

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const handleContinue = () => {
    // Handle password reset logic
    if (newPassword === confirmPassword) {
      Alert.alert('Success', 'Your password has been reset!');
      navigation.navigate('Login'); // Navigate back to the login screen
    } else {
      Alert.alert('Error', 'Passwords do not match');
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Text style={styles.illustration}>[Insert Image Here]</Text>
      </View>

      {/* Title and inputs */}
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>
        Here’s a tip: Use a combination of numbers, uppercase, lowercase, and special characters.
      </Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry={secureTextEntry}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry={secureTextEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <FontAwesomeIcon icon={secureTextEntry ? faEyeSlash : faEye} size={20} />
        </TouchableOpacity>
      </View>

      {/* Continue button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    fontSize: 18,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    height: 50,
    flex: 1,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  continueButton: {
    backgroundColor: '#FFA500',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 30,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResetPasswordScreen;
