import React from 'react';
import { Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { deleteUserShipmentDetail } from '../../services/shipmentService';
import { useDispatch } from 'react-redux';
import { deleteShipment } from '../../redux/slices/shipmentSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DeleteShipment({ id, refreshShipments }) {
  const dispatch = useDispatch();

  const handleDeleteShipment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      await deleteUserShipmentDetail(id, token);
      dispatch(deleteShipment(id));
      refreshShipments();
      Alert.alert('Success', 'Shipment deleted successfully');
    } catch (error) {
      console.error('Error deleting shipment:', error);
      Alert.alert('Error', 'Failed to delete shipment');
    }
  };

  return (
    <TouchableOpacity onPress={handleDeleteShipment} style={styles.deleteButton}>
      <Text style={styles.deleteButtonText}>Xóa</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
