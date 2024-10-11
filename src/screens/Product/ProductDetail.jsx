import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faHeart } from "@fortawesome/free-solid-svg-icons";
import BottomNavigation from "../../components/BottomNavigation";
import demoProduct from "../../../assets/images/product_demo.jpg";

export default function ProductDetail({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
        <FontAwesomeIcon icon={faHeart} size={20} color="#FF6B6B" />
      </View>

      <View style={styles.content}>
        <Image
          source= {demoProduct}
          style={styles.productImage}
        />
        <Text style={styles.productName}>
          Do One Thing Every Morning To Make Your Day
        </Text>
        <Text style={styles.productTag}>For exchange</Text>

        <Text style={styles.sectionTitle}>Specification</Text>
        <Text style={styles.specificationText}>Condition: New</Text>
        <Text style={styles.specificationText}>
          Description: The Nike Air Max 270 React ENG combines a full-length
          React foam
        </Text>
        <Text style={styles.specificationText}>Location: 123 ABC Street</Text>

        <Text style={styles.sectionTitle}>Uploaded by:</Text>
        <View style={styles.uploaderContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.uploaderImage}
          />
          <View style={styles.uploaderInfo}>
            <Text style={styles.uploaderName}>James Lawson</Text>
            <Text style={styles.publishedDate}>Published by: 21/02/2024</Text>
            <Text>⭐️⭐️⭐️⭐️☆</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:30,
      backgroundColor: '#FFF',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    productImage: {
      width: '100%',
      height: 250,
      borderRadius: 8,
      marginBottom: 16,
      resizeMode: 'contain', // To make sure the image fits well within its container
    },
    productName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    productTag: {
      backgroundColor: '#E6F0FF',
      color: '#4A90E2',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 16,
      marginBottom: 8,
      color: '#333',
    },
    specificationText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
      lineHeight: 20, // Improve readability
    },
    uploaderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: '#F9F9F9',
      padding: 8,
      borderRadius: 8,
    },
    uploaderImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    uploaderInfo: {
      flex: 1,
    },
    uploaderName: {
      fontWeight: 'bold',
      fontSize: 14,
      color: '#333',
    },
    publishedDate: {
      fontSize: 12,
      color: '#999',
    },
    addToCartButton: {
      backgroundColor: '#FF9900',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
      width: '90%',
      alignSelf: 'center', // Center the button horizontally
    },
    addToCartText: {
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  
