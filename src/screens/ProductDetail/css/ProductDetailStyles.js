// src/styles/ProductDetailStyles.js
import { StyleSheet } from "react-native";

const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
  },
  cartButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 8,
  },
  productTag: {
    fontSize: 14,
    color: "#65676B",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1877F2",
  },
  originalPrice: {
    fontSize: 16,
    color: "#65676B",
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 14,
    color: "#E4123B",
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  columnContainer: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
  },
  colorSelector: {
    flexDirection: "row",
    marginBottom: 16,
  },
  colorButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  activeColor: {
    borderColor: "#000000",
  },
  sizeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    marginRight: 8,
    marginBottom: 8,
  },
  activeSize: {
    backgroundColor: "#1877F2",
  },
  sizeButtonText: {
    fontSize: 14,
    color: "#050505",
  },
  activeSizeText: {
    color: "#FFFFFF",
  },
  conditionSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E4E6EB",
    marginRight: 8,
    marginBottom: 8,
  },
  activeCondition: {
    backgroundColor: "#1877F2",
  },
  conditionButtonText: {
    fontSize: 14,
    color: "#050505",
  },
  activeConditionText: {
    color: "#FFFFFF",
  },
  addToCartContainer: {
    marginTop: 16,
  },
  specificationText: {
    fontSize: 14,
    color: "#050505",
    marginBottom: 8,
  },
  promotionContainer: {
    marginTop: 8,
  },
  promotionItem: {
    fontSize: 14,
    color: "#050505",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#050505",
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#050505",
    textAlignVertical: "top",
  },
  commentSubmitButton: {
    backgroundColor: "#1877F2",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 8,
  },
  commentSubmitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E4E6EB",
  },
  buyNowContainer: {
    flex: 1,
    marginRight: 8,
  },
  rentContainer: {
    flex: 1,
    marginLeft: 8,
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
    padding: 16,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#050505",
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#1877F2",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#E4E6EB",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#050505",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
