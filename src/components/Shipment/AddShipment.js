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
import { Ionicons } from '@expo/vector-icons';

export default function AddShipment({ refreshShipments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    email: '', 
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
      dispatch(addShipment(newShipment)); // Thêm mới shipment vào state Redux
      closeModal();
      refreshShipments();
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
      email: '', // Reset email
    });
  };

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.addButton}>
        <Ionicons name="add" size={24} color="#FFF" />
        <Text style={styles.addButtonText}>Thêm mới</Text>
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
            {/* <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              style={styles.input}
            /> */}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#808080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});