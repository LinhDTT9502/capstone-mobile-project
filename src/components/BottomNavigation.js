import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faShoppingCart, faHeart, faUser } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

export default function BottomNavigation() {
    const navigation = useNavigation();
        
    return (
        <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.navigate('LandingPage')}>
          <FontAwesomeIcon icon={faHome} size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SearchingPage')}>
      <FontAwesomeIcon icon={faSearch} size={24} color="#999" />
    </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.cartIconContainer}>
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
          <FontAwesomeIcon icon={faHeart} size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Account')}>
          <FontAwesomeIcon icon={faUser} size={24} color="#999" />
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFF',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        height: 60,
      },
  cartIconContainer: {
    backgroundColor: '#4A90E2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
