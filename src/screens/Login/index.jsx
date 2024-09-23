import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  return (
    <View style={styles.container}>
      {/* Top background shapes */}
      <View style={styles.topShapes}>
        {/* Use Image component if you want to add background shapes */}
      </View>

      {/* Welcome text */}
      <Text style={styles.title}>Log in to Goods Exchange</Text>
      <Text style={styles.subtitle}>
        Welcome back! Sign in using your social account or email to continue
      </Text>

      {/* Google sign-in */}
      <TouchableOpacity style={styles.googleButton}>
        <Image source={require('../../../assets/images/googleicon.png')} style={styles.googleIcon} />
      </TouchableOpacity>

      {/* Username input */}
      <Text style={styles.label}>User name</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password input */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Text style={styles.eyeIcon}>👁️</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot password */}
      <TouchableOpacity>
        <Text  onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      {/* Register link */}
      <Text style={styles.registerText}>
        Don’t have an account yet?{' '}
        <Text style={styles.registerLink} onPress={() => navigation.navigate('SignUp')}>Register now</Text>
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  topShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: '#FFF', // Add background shapes here
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  googleButton: {
    alignSelf: 'center',
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 50,
    marginBottom: 20,
  },
  googleIcon: {
    width: 40,
    height: 40,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    paddingRight: 10,
    color: '#888',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#FFA500',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FFA500',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
  registerLink: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
