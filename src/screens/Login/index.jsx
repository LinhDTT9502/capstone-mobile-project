import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { signIn } from "../../api/apiAuth";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Commented out API call for temporary use
      // console.log('Attempting to log in with:', { username, password });
      // const response = await signIn(username, password);
      // console.log('Response received:', response);

      // if (response.status === 200) {
      //   Alert.alert("Success", "You have successfully logged in!");
      //   navigation.navigate("LandingPage");
      // } else {
      //   throw new Error("Unexpected response status");
      // }

      // Temporarily navigating to LandingPage directly
      navigation.navigate("HomeController");
    } catch (error) {
      console.error("Login error:", error.message);
      const errorMessage = "Unable to connect to the server. Please check your network and try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Log in to Goods Exchange</Text>
      <Text style={styles.subtitle}>
        Welcome back! Sign in using your account to continue
      </Text>

      {/* Google sign-in */}
      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("../../../assets/images/googleicon.png")}
          style={styles.googleIcon}
        />
      </TouchableOpacity>

      {/* Username input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {/* Password input */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeIcon}
        >
          <FontAwesomeIcon
            icon={secureTextEntry ? faEyeSlash : faEye}
            size={20}
          />
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.loginButtonText}>Log In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  loginButton: {
    backgroundColor: "#FFA500",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
