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
import { addUserShipmentDetail } from '../../services/shipmentService';
import { addShipment } from '../../redux/slices/shipmentSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddShipment({ refreshShipments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
  });
  const dispatch = useDispatch();

  const handleAddShipment = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      const newShipment = await addUserShipmentDetail(token, formData);
      dispatch(addShipment(newShipment.data));
      refreshShipments();
      closeModal();
    } catch (error) {
      console.error('Error adding shipment:', error);
      Alert.alert('Error', 'Failed to add shipment');
    }
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      fullName: '',
      phoneNumber: '',
      address: '',
    });
  };

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Thêm mới</Text>
      </TouchableOpacity>
      <Modal visible={isOpen} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm địa chỉ mới</Text>
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
              <TouchableOpacity onPress={closeModal} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddShipment} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
