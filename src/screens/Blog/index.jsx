import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchAllBlogs,
  createNewBlog,
  removeBlog,
} from "../../services/blogService";

export default function BlogScreen() {
  const [blogs, setBlogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: "", content: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: "1", name: "Current User" }); // Simulated current user

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const blogsData = await fetchAllBlogs();
      setBlogs(blogsData);
    } catch (error) {
      Alert.alert("Error", "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlog = async () => {
    if (!currentBlog.title.trim() || !currentBlog.content.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    try {
      const newBlog = await createNewBlog({ ...currentBlog, userId: currentUser.id });
      setBlogs([newBlog, ...blogs]);
      setModalVisible(false);
      setCurrentBlog({ title: "", content: "" });
    } catch (error) {
      Alert.alert("Error", "Failed to create blog");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this blog?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              await removeBlog(id);
              setBlogs(blogs.filter(blog => blog.id !== id));
            } catch (error) {
              Alert.alert("Error", "Failed to delete blog");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const renderBlogItem = ({ item }) => (
    <View style={styles.blogItem}>
      <View style={styles.blogHeader}>
        <Image
          style={styles.avatar}
          source={{ uri: `https://i.pravatar.cc/100?u=${item.createdByStaffId}` }}
        />
        <View>
          <Text style={styles.userName}>{item.createdByStaffFullName}</Text>
          <Text style={styles.blogTime}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
      <Text style={styles.blogTitle}>{item.title}</Text>
      <Text style={styles.blogContent} numberOfLines={3}>{item.content}</Text>
      {item.createdByStaffId === currentUser.id && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBlog(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#FA7D0B" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog Feed</Text>
      </View>

      {/* <TouchableOpacity
        style={styles.createBlogButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createBlogButtonText}>Write a new blog post...</Text>
      </TouchableOpacity> */}

      {isLoading ? (
        <ActivityIndicator size="large" color="#0035FF" style={styles.loader} />
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderBlogItem}
          keyExtractor={(item) => item.blogId.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Blog Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Blog Title"
              value={currentBlog.title}
              onChangeText={(text) =>
                setCurrentBlog({ ...currentBlog, title: text })
              }
              placeholderTextColor="#2C323A"
            />
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Blog Content"
              multiline
              value={currentBlog.content}
              onChangeText={(text) =>
                setCurrentBlog({ ...currentBlog, content: text })
              }
              placeholderTextColor="#2C323A"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleCreateBlog}
            >
              <Text style={styles.submitButtonText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: "#F0F2F5",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#050505",
  },
  createBlogButton: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E4E6EB",
  },
  createBlogButtonText: {
    color: "#65676B",
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  blogItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  blogHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#050505",
  },
  blogTime: {
    fontSize: 12,
    color: "#65676B",
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 8,
  },
  blogContent: {
    fontSize: 16,
    color: "#050505",
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  deleteButtonText: {
    color: "#FA7D0B",
    marginLeft: 4,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#050505",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#050505",
    backgroundColor: "#FFFFFF",
  },
  contentInput: {
    height: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#1877F2",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    backgroundColor: "#E4E6EB",
  },
  cancelButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});