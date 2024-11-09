import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function Blog() {
  const navigation = useNavigation();
  const [blogs] = useState([
    {
      id: "1",
      title: "Lợi ích của việc chơi thể thao",
      subtitle: "Tập luyện thể thao giúp cải thiện sức khỏe",
      content: "Tham gia các môn thể thao giúp bạn cải thiện sức khỏe, tăng cường thể lực và tinh thần...",
      coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXhlcmNpc2V8ZW58MHx8MHx8fDA%3D",
      createdByStaffFullName: "Nguyễn Văn A",
      createdByStaffId: "1",
      createdAt: new Date().toString(),
    },
    {
      id: "2",
      title: "Hướng dẫn chọn dụng cụ thể thao phù hợp",
      subtitle: "Lựa chọn dụng cụ thể thao tối ưu cho từng môn",
      content: "Việc chọn dụng cụ thể thao phù hợp là rất quan trọng để đảm bảo hiệu quả và an toàn...",
      coverImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhlYWx0aHklMjBmb29kfGVufDB8fDB8fHww",
      createdByStaffFullName: "Trần Thị B",
      createdByStaffId: "2",
      createdAt: new Date().toString(),
    },
    {
      id: "3",
      title: "Các môn thể thao tốt nhất để tăng cường thể lực",
      subtitle: "Khám phá các môn thể thao giúp bạn khỏe mạnh hơn",
      content: "Chạy bộ, bơi lội, bóng rổ là những môn thể thao giúp tăng cường thể lực một cách hiệu quả...",
      coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D",
      createdByStaffFullName: "Lê Văn C",
      createdByStaffId: "3",
      createdAt: new Date().toString(),
    },
  ]);

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.blogItem}
      onPress={() => navigation.navigate("BlogDetail", { blog: item })}
    >
      {item.coverImage && <Image style={styles.coverImage} source={{ uri: item.coverImage }} />}
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.blogSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        <View style={styles.blogFooter}>
          <Image style={styles.avatar} source={{ uri: `https://i.pravatar.cc/100?u=${item.createdByStaffId}` }} />
          <View style={styles.authorInfo}>
            <Text style={styles.userName} numberOfLines={1}>{item.createdByStaffFullName}</Text>
            <Text style={styles.blogTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blog Feed</Text>
        {/* <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={24} color="#050505" />
        </TouchableOpacity> */}
      </View>

      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,    paddingTop:30,

    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
  },
  searchButton: {
    padding: 8,
  },
  listContainer: {
    padding: 14,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  blogItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (screenWidth - 32) / 2 - 8,
  },
  coverImage: {
    width: "100%",
    height: 120,
  },
  blogContent: {
    padding: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 4,
  },
  blogSubtitle: {
    fontSize: 12,
    color: "#65676B",
    marginBottom: 8,
  },
  blogFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#050505",
  },
  blogTime: {
    fontSize: 10,
    color: "#65676B",
  },
});