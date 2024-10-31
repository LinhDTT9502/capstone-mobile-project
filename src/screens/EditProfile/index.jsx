import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { updateProfile } from "../../api/apiUser";

export default function EditProfile() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    UserName: "Maint_123",
    FullName: "Maint_123",
    Email: "M******3@gmail.com",
    Phone: "*****02",
    BirthDate: "2001-01-01"
  });
  const [initialData, setInitialData] = useState(formData);

  const handleEditClick = () => setIsEditing(true);

  const handleSaveClick = () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      Alert.alert("No changes", "No changes to save");
      return;
    }
    updateProfile(formData.UserName, formData)
      .then(() => {
        setIsEditing(false);
        Alert.alert("Success", "Profile updated successfully");
        setInitialData(formData);
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        Alert.alert("Error", "Failed to save changes");
      });
  };

  const handleCancelClick = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const renderInput = (label, name, icon) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <FontAwesome name={icon} size={20} color="#4A90E2" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={formData[name]}
          onChangeText={(value) => handleChange(name, value)}
          editable={isEditing}
        />
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin người dùng</Text>
      </View>

      <View style={styles.profileSection}>
        <Image source={{ uri: "https://via.placeholder.com/150" }} style={styles.profileImage} />
        <TouchableOpacity style={styles.cameraIconWrapper}>
          <FontAwesome name="camera" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {renderInput("Tên đăng nhập", "UserName", "user")}
      {renderInput("Họ và tên", "FullName", "user")}
      {renderInput("Email", "Email", "envelope")}
      {renderInput("Số điện thoại", "Phone", "phone")}
      {renderInput("Ngày sinh", "BirthDate", "calendar")}

      {isEditing ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveClick}>
            <Text style={styles.buttonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelClick}>
            <Text style={styles.buttonText}>Hủy</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={handleEditClick}>
          <Text style={styles.buttonText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#4A90E2",
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    padding: 8,
  },
  inputContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 24,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});