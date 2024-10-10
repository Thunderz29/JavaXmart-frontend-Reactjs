import { Box } from "@mui/material";
import React, { useRef, useState } from "react";
import { QrReader } from "react-qr-reader";

export default function QRReader(props) {
  const [lastScanData, setLastScanData] = useState(null);
  const isProcessingRef = useRef(false); // gunakan useRef untuk melacak proses

  const handleScan = async (scanData) => {
    // Jika proses sedang berjalan, jangan lakukan apapun
    if (isProcessingRef.current) return;

    if (scanData && scanData !== "" && scanData !== lastScanData) {
      setLastScanData(scanData);
      isProcessingRef.current = true; // tandai proses sedang berjalan

      // Panggil callback props jika tersedia
      if (typeof props.onQRScan === "function") {
        props.onQRScan(scanData);
      }

      // Berikan delay sebelum scan berikutnya diperbolehkan
      setTimeout(() => {
        isProcessingRef.current = false; // izinkan scan berikutnya setelah delay
      }, 1000); // Delay 1 detik (sesuaikan dengan kebutuhan)
    } else if (scanData === lastScanData) {
      console.log("QR code already processed.");
    } else {
      console.log("Scan failed or QR code not detected.");
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Box
        sx={{
          width: 300,
          height: 300,
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <QrReader
          constraints={{ facingMode: "environment" }}
          onError={handleError}
          onResult={handleScan}
          containerStyle={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );
}
