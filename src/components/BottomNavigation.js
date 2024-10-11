import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faShoppingCart, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';

export default function BottomNavigation({ setActiveScreen, activeScreen }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => setActiveScreen('LandingPage')} style={styles.tabButton}>
        <FontAwesomeIcon icon={faHome} size={24} color={activeScreen === 'LandingPage' ? '#4A90E2' : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('SearchingPage')} style={styles.tabButton}>
        <FontAwesomeIcon icon={faSearch} size={24} color={activeScreen === 'SearchingPage' ? '#4A90E2' : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('Cart')} style={styles.tabButton}>
        <View style={[styles.cartIconContainer, { backgroundColor: activeScreen === 'Cart' ? '#4A90E2' : '#FFF' }]}>
          <FontAwesomeIcon icon={faShoppingCart} size={24} color={activeScreen === 'Cart' ? '#FFF' : '#4A90E2'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('Wishlist')} style={styles.tabButton}>
        <FontAwesomeIcon icon={faHeart} size={24} color={activeScreen === 'Wishlist' ? '#4A90E2' : '#999'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('Account')} style={styles.tabButton}>
        <FontAwesomeIcon icon={faUser} size={24} color={activeScreen === 'Account' ? '#4A90E2' : '#999'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4, // For shadow on Android
    shadowColor: '#000', // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
