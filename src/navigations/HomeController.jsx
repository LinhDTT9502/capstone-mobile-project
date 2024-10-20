import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LandingPage from '../screens/HomeScreen/index';
import SearchingPage from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail/index';
import Cart from '../screens/CartList';
import Checkout from '../screens/HomeScreen/Checkout';
import PaymentDetail from '../screens/HomeScreen/PaymentDetail';
import Account from '../screens/Profile';
import BottomNavigation from '../components/BottomNavigation';

export default function HomeController() {
  const [activeScreen, setActiveScreen] = useState('LandingPage');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'LandingPage':
        return <LandingPage />;
      case 'SearchingPage':
        return <SearchingPage />;
      case 'ProductDetail':
        return <ProductDetail />;
      case 'Cart':
        return <Cart />;
      case 'Account':
        return <Account />;
      case 'Checkout':
        return <Checkout />;
      case 'PaymentDetail':
        return <PaymentDetail />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      {/* Pass both activeScreen and setActiveScreen to BottomNavigation */}
      <BottomNavigation setActiveScreen={setActiveScreen} activeScreen={activeScreen} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
});
