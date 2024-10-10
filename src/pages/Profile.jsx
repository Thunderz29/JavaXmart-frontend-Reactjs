import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Discount, User } from "react-iconly";
import Alert from "../components/Notifications.jsx";
import QRReader from "../components/Qr.jsx";
import TableComponent from "../components/Table.jsx";
import { handleGetProfile } from "../handlers/ProfileHandler.js";
import { handleQRScanCustomer } from "../handlers/QrCustomerHandler.js";
import { getHistoryTransaction } from "../service/services.js";
import formatCurrency from "../utils/Currency.js";
import formatDate from "../utils/Date.js";

export default function ProfilePage() {
  const [isScanned, setIsScanned] = useState(false); // Tambahkan state isScanned
  const [scannedData, setScannedData] = useState(null);
  const [detailCustomer, setDetailCustomer] = useState(null);
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const [alert, setAlert] = useState({
    type: null,
    message: null,
  });

  const handleGetHistoryTransaction = () => {
    const qrcode = localStorage.getItem("qrcodeCustomer");
    getHistoryTransaction(qrcode)
      .then((response) => {
        if (response.status === 200) {
          setHistoryTransaction(response.data.data.getTransaction);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleProfile = async (data) => {
    const dataProfile = await handleGetProfile(data);
    setDetailCustomer(dataProfile);
  };

  useEffect(() => {
    const qrCodeCustomer = localStorage.getItem("qrcodeCustomer");
    if (qrCodeCustomer) {
      setScannedData(qrCodeCustomer);
      handleProfile(qrCodeCustomer);
      handleGetHistoryTransaction();
    }
  }, []);

  useEffect(() => {
    if (scannedData) {
      handleProfile(scannedData);
      handleGetHistoryTransaction();
    }
  }, [scannedData]);

  const handleCustomerDataQRScan = async (data) => {
    if (!isScanned) {
      setIsScanned(true); // Set flag untuk mencegah scan berulang

      try {
        await handleQRScanCustomer(data, setScannedData, setAlert); // Memanggil fungsi scan
        console.log("QR Data Processed");
      } catch (error) {
        console.error("Error processing QR data:", error);
      }

      // Reset state setelah beberapa waktu (misalnya 5 detik)
      setTimeout(() => {
        setIsScanned(false); // Reset agar bisa scan lagi setelah waktu tertentu
      }, 5000); // Reset setelah 5 detik (atau waktu sesuai kebutuhan)
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("qrcodeCustomer");
    setScannedData(null);
    setDetailCustomer(null);
  };

  const rowHistoryTransaction = historyTransaction.map(
    (transaction, index) => ({
      ...transaction,
      no: index + 1,
      key: index.toString(),
      rfid: transaction.rfid,
      price: formatCurrency(transaction.price),
      totalPrice: formatCurrency(transaction.totalProduct * transaction.price),
      date: formatDate(transaction.date),
    })
  );

  const columnsHistoryTransaction = [
    { key: "no", label: "No" },
    { key: "rfid", label: "RFID" },
    { key: "price", label: "Price" },
    { key: "totalProduct", label: "Quantity" },
    { key: "totalPrice", label: "Total" },
    { key: "date", label: "Date" },
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
        {scannedData ? (
          <Box
            display="flex"
            gap={2}
            flexDirection="column"
            alignItems="center"
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Card sx={{ minWidth: 300, mb: 4 }}>
                <CardHeader
                  avatar={<User />}
                  title={<Typography variant="h6">Customer Profile</Typography>}
                />
                <Divider />
                <CardContent>
                  {detailCustomer ? (
                    <>
                      <Typography>Name: {detailCustomer.name}</Typography>
                      <Typography>
                        Wallet: {formatCurrency(detailCustomer.wallet)}
                      </Typography>
                    </>
                  ) : (
                    <Button variant="outlined" disabled>
                      Loading...
                    </Button>
                  )}
                </CardContent>
              </Card>
              <Button variant="contained" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
            <Card sx={{ minWidth: 300 }}>
              <CardHeader
                avatar={<Discount />}
                title={
                  <Typography variant="h6">History of Transaction</Typography>
                }
              />
              <Divider />
              <CardContent>
                <TableComponent
                  columns={columnsHistoryTransaction}
                  rows={rowHistoryTransaction}
                />
              </CardContent>
            </Card>
          </Box>
        ) : (
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
              <Typography variant="h6">Scan Your Customer QR Code</Typography>
              <QRReader onQRScan={handleCustomerDataQRScan} />
            </Box>
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
