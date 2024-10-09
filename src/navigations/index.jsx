import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogoScreen from '../screens/Logo/index';
import SplashScreen from '../screens/Splash/index';
import LoginScreen from '../screens/Login/index';
import SignUpScreen from '../screens/SignUp/index';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import LandingPage from '../screens/Product/LandingPage'; 

const Stack = createStackNavigator();

export default function MainContainer() {
  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Logo" component={LogoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} /> 

      </Stack.Navigator>
  );
}
