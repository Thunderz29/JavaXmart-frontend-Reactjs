import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Buy, Delete } from "react-iconly";
import * as Yup from "yup";
import ModalConfirmation from "../components/Modal.jsx";
import Alert from "../components/Notifications.jsx";
import QRReader from "../components/Qr.jsx";
import TableComponent from "../components/Table.jsx";
import { handleQRScanCustomer } from "../handlers/QrCustomerHandler.js";
import { handleQRInputProductScan } from "../handlers/QrProductHandler.js";
import { saveTransaction } from "../service/services.js";
import formatCurrency from "../utils/Currency.js";

export default function ShopPage() {
  const [scannedData, setScannedData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const qrCodeCustomer = localStorage.getItem("qrcodeCustomer");
    if (qrCodeCustomer) {
      setScannedData(qrCodeCustomer);
    }
  }, []);

  const handleCustomerDataQRScan = async (data) => {
    await handleQRScanCustomer(data, setScannedData, setAlert);
  };

  const handleProductDataQRScan = async (rfid) => {
    await handleQRInputProductScan(rfid, cartItems, setCartItems, setAlert);
  };

  const handleQuantityChange = (index, value) => {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = value;
    setCartItems(newCartItems);
  };

  const handleDeleteItem = (index) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const handleCheckout = async () => {
    try {
      const qrcode = scannedData;
      const transaction = cartItems.map((item) => ({
        rfid: item.rfid,
        productName: item.productName,
        price: item.price,
        totalProduct: item.quantity,
      }));
      const response = await saveTransaction(qrcode, transaction);

      if (response.status === 200) {
        console.log("Success Checkout");
        setAlert({
          type: "success",
          message: "Your transaction is success!",
        });
        setIsOpen(false);
        setCartItems([]);
      } else {
        console.log("Failed Checkout");
        setAlert({
          type: "danger",
          message:
            "Failed Checkout, Your Wallet is not enough to complete this transaction!",
        });
      }
    } catch (error) {
      console.log("Failed Checkout");
      setAlert({
        type: "danger",
        message:
          "Failed Checkout, Your Wallet is not enough to complete this transaction!",
      });
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return formatCurrency(totalPrice);
  };

  const quantitySchema = Yup.number()
    .typeError("Quantity must be a number")
    .positive("Quantity must be greater than 0")
    .required("Quantity is required");

  const rowCarts = cartItems.map((cartItem, index) => ({
    ...cartItem,
    no: index + 1,
    key: index.toString(),
    price: formatCurrency(cartItem.price),
    totalProduct: (
      <Box display="flex" alignItems="center" gap={1}>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() =>
            handleQuantityChange(index, Math.max(1, cartItem.quantity - 1))
          }
        >
          <b>-</b>
        </Button>
        <TextField
          disabled
          name={`carts.${index}.quantity`}
          value={cartItem.quantity}
          variant="outlined"
          size="small"
          inputProps={{ min: 1 }}
        />
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => handleQuantityChange(index, cartItem.quantity + 1)}
        >
          <b>+</b>
        </Button>
      </Box>
    ),
    totalPrice: formatCurrency(cartItem.price * cartItem.quantity),
    actions: (
      <Box
        display="flex"
        justifyContent="center"
        onClick={() => handleDeleteItem(index)}
      >
        <Delete primaryColor="red" />
      </Box>
    ),
  }));

  const columnCarts = [
    { key: "no", label: "No" },
    { key: "productName", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "totalProduct", label: "Quantity" },
    { key: "totalPrice", label: "Total" },
    { key: "actions", label: "Actions" },
  ];

  const handleCloseAlert = () => {
    setAlert({ message: "" });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={4}
      width="200vh"
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        {!scannedData && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
          >
            <Typography variant="h6">Scan Your Customer QR Code</Typography>
            <QRReader onQRScan={handleCustomerDataQRScan} />
          </Box>
        )}
        {scannedData && (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="start"
            gap={4}
          >
            <Box>
              <QRReader onQRScan={handleProductDataQRScan} />
              <Typography variant="h6" textAlign="center" marginTop={2}>
                Scan Product
              </Typography>
            </Box>
            <Card variant="outlined" sx={{ minWidth: 300, marginBottom: 2 }}>
              <CardHeader title="Your Cart" avatar={<Buy />} />
              <Divider />
              <Formik
                initialValues={{}}
                validationSchema={Yup.object().shape({
                  totalProduct: Yup.array().of(quantitySchema),
                })}
                onSubmit={(values) => {
                  console.log("Form submitted", values);
                }}
              >
                <Form>
                  <TableComponent columns={columnCarts} rows={rowCarts} />
                </Form>
              </Formik>
              <Divider />
              <CardContent>
                <Typography align="right">
                  Total Price: {calculateTotalPrice()}
                </Typography>
              </CardContent>
            </Card>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsOpen(true)}
            >
              Checkout
            </Button>
            <ModalConfirmation
              columns={columnCarts}
              rows={rowCarts}
              isOpen={isOpen}
              onOpenChange={() => setIsOpen(false)}
              totalPrice={calculateTotalPrice()}
              handleCheckout={handleCheckout}
            />
          </Box>
        )}
      </Box>
      <Alert
        message={alert.message}
        onClose={handleCloseAlert}
        type={alert.type}
      />
    </Box>
  );
}
