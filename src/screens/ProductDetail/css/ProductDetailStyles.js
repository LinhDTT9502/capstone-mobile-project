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
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  productImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
  },
  productInfo: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
  },
  productTag: {
    backgroundColor: COLORS.light,
    color: COLORS.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
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
    color: COLORS.secondary,
  },
  originalPrice: {
    fontSize: 16,
    color: COLORS.dark,
    textDecorationLine: "line-through",
  },
  discount: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    backgroundColor: COLORS.white,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: COLORS.dark,
  },
  specificationText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
    lineHeight: 20,
  },
  promotionContainer: {
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
  },
  promotionItem: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.dark,
    lineHeight: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    color: COLORS.dark,
  },
  colorSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  activeColor: {
    borderColor: COLORS.dark,
  },
  commentInputContainer: {
    marginBottom: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minHeight: 80,
    textAlignVertical: "top",
    color: COLORS.dark,
  },
  commentSubmitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  commentSubmitText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLORS.dark,
  },
  dateInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: COLORS.dark,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    flex: 1,
    color: COLORS.dark,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  cancelButtonText: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: "bold",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 16,
    color: COLORS.primary,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  bottomNav: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  buyNowContainer: {
    flex: 1,
    marginRight: 8,
  },
  rentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  addToCartContainer: {
    marginTop: 16,
  },
  cartButton: {
    padding: 8,
  },
  sizeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 16,
    borderRadius: 8,
    padding: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  activeSize: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeButtonText: {
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  activeSizeText: {
    color: COLORS.white,
  },
  conditionSelector: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionButton: {
    borderWidth: 1,
    borderColor: COLORS.light,
    marginRight: 16,
    borderRadius: 8,
    padding: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  activeCondition: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  conditionButtonText: {
    color: COLORS.dark,
    fontWeight: 'bold',
  },
  activeConditionText: {
    color: COLORS.white,
  },
});

export default styles;
