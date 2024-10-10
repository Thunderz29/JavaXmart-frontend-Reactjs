import { getDetailProduct } from "../service/services.js";

export const handleQRInputProductScan = async (
  rfid,
  cartItems,
  setCartItems,
  setAlert
) => {
  try {
    console.log("Scanning product with RFID:", rfid);
    console.log("Current cartItems:", cartItems);

    const response = await getDetailProduct(rfid);
    if (response.status === 200) {
      const product = response.data;
      console.log("Product data received:", product);

      const existingIndex = cartItems.findIndex(
        (item) => item.rfid === product.rfid
      );
      console.log("Existing product index:", existingIndex);

      if (existingIndex !== -1) {
        const newCartItems = [...cartItems];
        newCartItems[existingIndex].quantity += 1;
        console.log("Updated cartItems (existing product):", newCartItems);

        setCartItems(newCartItems);
        setAlert({
          type: "primary",
          message: `Success Add ${product.productName} To Cart!`,
        });
      } else {
        product.quantity = 1;
        setCartItems([...cartItems, product]);
        setAlert({
          type: "primary",
          message: `Success Add ${product.productName} To Cart!`,
        });
      }
    }
  } catch (error) {
    console.log(error);
    setAlert({
      type: "danger",
      message: "Product Not Found, Please Scan With Correct QR Code!",
    });
  }
};
