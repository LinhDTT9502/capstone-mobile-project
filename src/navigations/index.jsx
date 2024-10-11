import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LogoScreen from '../screens/Logo/index';
import SplashScreen from '../screens/Splash/index';
import LoginScreen from '../screens/Login/index';
import SignUpScreen from '../screens/SignUp/index';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import LandingPage from '../screens/Product/LandingPage';
import SearchingPage from '../screens/Product/SearchingPage'; 
import ProductDetail from '../screens/Product/ProductDetail';

const Stack = createStackNavigator();

export default function MainContainer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Logo" component={LogoScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
      <Stack.Screen name="SearchingPage" component={SearchingPage} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />

    </Stack.Navigator>
  );
}
