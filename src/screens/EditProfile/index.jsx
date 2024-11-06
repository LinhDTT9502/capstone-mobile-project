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
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, updateUser } from '../../redux/slices/authSlice';
import { fetchUserProfile, saveUserProfile } from '../../services/userService';
import { Picker } from '@react-native-picker/picker';

export default function EditProfile() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile(user.UserId);
        if (profileData) {
          const newData = {
            UserName: profileData.userName || '',
            FullName: profileData.fullName || '',
            Gender: profileData.gender || '',
            BirthDate: profileData.dob || '',
            Email: profileData.email || '',
            Address: profileData.address || '',
            Phone: profileData.phoneNumber || '',
            IsEmailVerified: profileData.emailConfirmed || false,
            IsPhoneVerified: profileData.phoneConfirmed || false,
          };
          setFormData(newData);
          setInitialData(newData);
        } else {
          Alert.alert('Thông báo', 'Không có dữ liệu người dùng.');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
      }
    };
  
    loadUserProfile();
  }, [user.UserId]);
  
  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      Alert.alert('Cảnh báo', 'Không có thay đổi nào được thực hiện.');
      return;
    }
  
    try {
      await saveUserProfile(user.UserId, formData);
      setIsEditing(false);
      dispatch(updateUser(formData));
      Alert.alert('Thành công', 'Thông tin đã được cập nhật.');
      setInitialData(formData);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      Alert.alert('Lỗi', `Cập nhật thất bại: ${error.response?.data?.message || 'Vui lòng thử lại.'}`);
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);
      handleChange('BirthDate', formattedDate);
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const renderInput = (label, name, icon, editable = isEditing, verifiable = false) => (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <FontAwesome name={icon} size={20} color="#0035FF" style={styles.inputIcon} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.inputWrapper}>
        {name === 'BirthDate' && isEditing ? (
          <TouchableOpacity 
          
            onPress={() => isEditing && setShowDatePicker(true)} 
            style={[
              styles.input,
              !isEditing && styles.disabledInput,
              isEditing && styles.editableInput
            ]}
          >
            <Text style={styles.dateButtonText}>
              {formatDateForDisplay(formData.BirthDate) || 'Chọn ngày'}
            </Text>
          </TouchableOpacity>
        ) : name === 'Gender' ? (
          <Picker
            selectedValue={formData.Gender}
            onValueChange={(itemValue) => handleChange('Gender', itemValue)}
            enabled={isEditing}
            style={[
              styles.input,
              !isEditing && styles.disabledInput,
              isEditing && styles.editableInput
            ]}
          >
            <Picker.Item label="Chọn giới tính" value="" />
            <Picker.Item label="Nam" value="male" />
            <Picker.Item label="Nữ" value="female" />
            <Picker.Item label="Khác" value="other" />
          </Picker>
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
            placeholder={`Nhập ${label.toLowerCase()}`}
            placeholderTextColor="#A0AEC0"
          />
        )}
        {verifiable && (
          <FontAwesome
            name={formData[`Is${name}Verified`] ? "check-circle" : "times-circle"}
            size={24}
            color={formData[`Is${name}Verified`] ? "#4CAF50" : "#FF3B30"}
            style={styles.verifiedIcon}
          />
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#0035FF" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
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
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
            {isEditing ? (
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.buttonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                <Text style={styles.buttonText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderInput('Tên người dùng', 'UserName', 'user', false)}
          {renderInput('Họ và tên', 'FullName', 'user')}
          {renderInput('Giới tính', 'Gender', 'venus-mars')}
          {renderInput('Ngày sinh', 'BirthDate', 'calendar')}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          {renderInput('Email', 'Email', 'envelope', false, true)}
          {renderInput('Số điện thoại', 'Phone', 'phone', true, true)}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(formData.BirthDate && formData.BirthDate !== '0001-01-01T00:00:00' ? formData.BirthDate : Date.now())}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
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
    backgroundColor: '#28A745',
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  dateButtonText: {
    fontSize: 16,
    color: '#2D3748',
  },
  verifiedIcon: {
    marginLeft: 12,
  },
});