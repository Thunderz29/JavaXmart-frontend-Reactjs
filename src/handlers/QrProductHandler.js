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

      setCartItems((prevCartItems) => {
        const existingIndex = prevCartItems.findIndex(
          (item) => item.rfid === product.rfid
        );
        console.log("Existing product index:", existingIndex);

        if (existingIndex !== -1) {
          // Jika produk sudah ada di keranjang, tambahkan kuantitasnya
          const newCartItems = [...prevCartItems];
          newCartItems[existingIndex].quantity += 1;
          console.log("Updated cartItems (existing product):", newCartItems);

          setAlert({
            type: "primary",
            message: `Success Add ${product.productName} To Cart!`,
          });
          return newCartItems;
        } else {
          // Jika produk baru, tambahkan produk ke keranjang
          product.quantity = 1;
          console.log("Adding new product to cart:", [
            ...prevCartItems,
            product,
          ]);

          setAlert({
            type: "primary",
            message: `Success Add ${product.productName} To Cart!`,
          });
          return [...prevCartItems, product];
        }
      });
    }
  } catch (error) {
    console.log(error);
    setAlert({
      type: "danger",
      message: "Product Not Found, Please Scan With Correct QR Code!",
    });
  }
};
