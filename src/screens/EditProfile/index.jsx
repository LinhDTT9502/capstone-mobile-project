import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faPencilAlt,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

export default function EditProfile() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("Maint_123");
  const [fullName, setFullName] = useState("Maint_123");
  const [dob, setDob] = useState("01/01/2001");
  const [phoneNumber, setPhoneNumber] = useState("*****02");
  const [email, setEmail] = useState("M******3@gmail.com");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin người dùng</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIconWrapper}>
            <FontAwesomeIcon icon={faCamera} size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên đăng nhập</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            editable
          />
          <FontAwesomeIcon icon={faPencilAlt} size={16} color="#999" />
        </View>

        <Text style={styles.label}>Họ và tên</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            editable
          />
          <FontAwesomeIcon icon={faPencilAlt} size={16} color="#999" />
        </View>

        <Text style={styles.label}>Ngày sinh</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={dob}
            onChangeText={setDob}
            editable
          />
          <FontAwesomeIcon icon={faPencilAlt} size={16} color="#999" />
        </View>

        <Text style={styles.label}>Số điện thoại</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable
          />
          <FontAwesomeIcon icon={faPencilAlt} size={16} color="#999" />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable
          />
          <FontAwesomeIcon icon={faPencilAlt} size={16} color="#999" />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Hoàn thành chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIconWrapper: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF9900",
    borderRadius: 15,
    padding: 4,
  },
  inputContainer: {
    marginHorizontal: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    marginTop: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 4,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    padding: 4,
  },
  saveButton: {
    backgroundColor: "#FF9900",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
