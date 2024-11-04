import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { updateProfile } from '../../services/userService';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../redux/slices/authSlice';

export default function EditProfile() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [otpField, setOtpField] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [formData, setFormData] = useState({
    UserName: user?.UserName || '',
    FullName: user?.FullName || '',
    Email: user?.Email || '',
    Gender: user?.Gender || '',
    Phone: user?.Phone || '',
    BirthDate: user?.BirthDate || '',
    IsEmailVerified: user?.IsEmailVerified || false,
    IsPhoneVerified: user?.IsPhoneVerified || false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState(formData);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      Alert.alert('Warning', 'No changes were made.');
      return;
    }

    try {
      await updateProfile(user.UserId, formData);
      setIsEditing(false);
      setInitialData(formData);
      Alert.alert('Success', 'Chỉnh sửa thành công');
      dispatch(updateUser(formData));
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Chỉnh sửa thất bại');
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleVerify = (field) => {
    setOtpField(field);
    setShowNotificationModal(true);
    // In a real application, you would send the OTP to the user's email or phone here
  };

  const handleNotificationConfirm = () => {
    setShowNotificationModal(false);
    setShowOtpModal(true);
  };

  const handleOtpComplete = () => {
    // In a real application, you would verify the OTP here
    setShowOtpModal(false);
    setFormData({ ...formData, [`Is${otpField}Verified`]: true });
    Alert.alert('Success', `${otpField} đã được xác thực thành công.`);
  };

  useEffect(() => {
    if (user) {
      const userData = {
        UserName: user.UserName,
        FullName: user.FullName,
        Email: user.Email,
        Gender: user.Gender,
        Phone: user.Phone,
        BirthDate: user.BirthDate,
        IsEmailVerified: user.IsEmailVerified || false,
        IsPhoneVerified: user.IsPhoneVerified || false,
      };
      setFormData(userData);
      setInitialData(userData);
    }
  }, [user]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('BirthDate', selectedDate.toISOString().split('T')[0]);
    }
  };

  const renderInput = (label, name, icon, editable = isEditing, verifiable = false) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <FontAwesome name={icon} size={20} color="#0035FF" style={styles.inputIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.inputWrapper}>
        {name === 'BirthDate' && isEditing ? (
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{formData.BirthDate || 'Select Date'}</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[
              styles.input,
              !editable && styles.disabledInput,
              editable && styles.editableInput
            ]}
            value={formData[name]}
            onChangeText={(value) => handleChange(name, value)}
            editable={editable}
            placeholder={`Enter your ${label.toLowerCase()}`}
            placeholderTextColor="#A0AEC0"
          />
        )}
        {verifiable && !formData[`Is${name}Verified`] && (
          <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerify(name)}>
            <Text style={styles.verifyButtonText}>Verify</Text>
          </TouchableOpacity>
        )}
        {verifiable && formData[`Is${name}Verified`] && (
          <FontAwesome name="check-circle" size={24} color="#4CAF50" style={styles.verifiedIcon} />
        )}
      </View>
      {verifiable && !formData[`Is${name}Verified`] && (
        <Text style={styles.verificationText}>Vui lòng xác thực {name.toLowerCase()} để tiếp tục</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#0035FF" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.profileImage} />
          <TouchableOpacity style={styles.changePhotoButton}>
            <FontAwesome name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            {isEditing ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderInput('Username', 'UserName', 'user', false)}
          {renderInput('Full Name', 'FullName', 'user')}
          {renderInput('Gender', 'Gender', 'venus-mars')}
          {renderInput('Birth Date', 'BirthDate', 'calendar')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {renderInput('Email', 'Email', 'envelope', false, true)}
          {renderInput('Phone', 'Phone', 'phone', true, true)}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.BirthDate || Date.now())}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { alignItems: 'flex-start' }]}>
            <Text style={styles.modalTitle}>Verify</Text>
            <Text style={[styles.modalSubtitle, { marginBottom: 16, textAlign: 'left' }]}>
              Mã đã được gửi qua email của bạn.
            </Text>
            <TouchableOpacity 
              style={[styles.modalConfirmButton, { alignSelf: 'flex-end', flex: 0 }]} 
              onPress={handleNotificationConfirm}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter OTP</Text>
            <Text style={styles.modalSubtitle}>
              Please enter the 6-digit code sent to your {otpField.toLowerCase()}
            </Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => {
                    const newOtp = [...otp];
                    newOtp[index] = value;
                    setOtp(newOtp);
                    if (value && index < 5) {
                      this[`otpInput${index + 1}`].focus();
                    }
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={(input) => { this[`otpInput${index}`] = input; }}
                />
              ))}
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setShowOtpModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirmButton} 
                onPress={handleOtpComplete}
                disabled={otp.some(digit => digit === '')}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F0F4F8",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#0035FF',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#0035FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#0035FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: '#0035FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#4A5568',
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editableInput: {
    backgroundColor: '#EDF2F7',
  },
  disabledInput: {
    backgroundColor: '#F7FAFC',
    color: '#718096',
  },
  inputIcon: {
    marginRight: 8,
  },
  
  verifyButton: {
    backgroundColor: '#0035FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 12,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2D3748',
  },
  verifiedIcon: {
    marginLeft: 12,
  },
  verificationText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  modalConfirmButton: {
    backgroundColor: '#0035FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});