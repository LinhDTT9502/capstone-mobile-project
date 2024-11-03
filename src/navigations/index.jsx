// MainContainer.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeController from './HomeController'; 
import LogoScreen from '../screens/Logo/index';
import SplashScreen from '../screens/Splash/index';
import LoginScreen from '../screens/Login/index';
import SignUpScreen from '../screens/SignUp/index';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import IntroductionScreen from '../screens/Introduction/index';
import ContactUs from '../screens/ContactUs';
import ProductDetail from '../screens/ProductDetail/index';
import Checkout from '../screens/HomeScreen/Checkout';
import EditProfile from '../screens/EditProfile/index';
import OtpVerificationScreen from '../screens/Auth/OtpVerification';
import ResetPasswordScreen from '../screens/Auth/ResetPassword';
import MyOrderScreen from '../screens/MyOrder';
import AccountResetPassword from '../screens/Auth/AccountResetPassword';
import MyOrder from '../screens/MyOrder/index';
import Policy from '../screens/Policy/index';

const Stack = createStackNavigator();

export default function MainContainer() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Logo" component={LogoScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="HomeController" component={HomeController} /> 
      <Stack.Screen name="Introduction" component={IntroductionScreen} /> 
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="AccountResetPassword" component={AccountResetPassword} />
      <Stack.Screen name="MyOrder" component={MyOrder} />
      <Stack.Screen name="Policy" component={Policy} />
    </Stack.Navigator>
  );
}
