import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { updateUserShipmentDetail } from '../../services/shipmentService';
import { updateShipment } from '../../redux/slices/shipmentSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UpdateShipment({ shipment, onClose }) {
  const [formData, setFormData] = useState({ ...shipment });
  const dispatch = useDispatch();

  const handleUpdateShipment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      const updatedShipment = await updateUserShipmentDetail(
        shipment.id,
        token,
        formData
      );
      dispatch(updateShipment(updatedShipment.data));
      onClose();
    } catch (error) {
      console.error('Error updating shipment details:', error);
      Alert.alert('Error', 'Failed to update shipment');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Modal visible={true} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Cập nhật địa chỉ</Text>
          <TextInput
            placeholder="Họ và tên"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Số điện thoại"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            placeholder="Địa chỉ"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUpdateShipment} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    addButton: {
      backgroundColor: '#FFA500',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 10,
    },
    addButtonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      borderRadius: 10,
      padding: 20,
      width: '90%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: '#CCC',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
      width: '100%',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    cancelButton: {
      backgroundColor: '#808080',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      flex: 1,
      marginRight: 5,
    },
    confirmButton: {
      backgroundColor: '#FFA500',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      flex: 1,
      marginLeft: 5,
    },
    buttonText: {
      color: '#FFF',
      fontWeight: 'bold',
    },
  });