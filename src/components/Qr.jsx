import { Box } from "@mui/material";
import React from "react";
import { QrReader } from "react-qr-reader";

export default function QRReader({ onQRScan = () => {} }) {
  const handleResult = React.useCallback(
    (result, error) => {
      if (result) {
        onQRScan(result?.text);
      } else if (error) {
        console.error("QR Scan error:", error);
      }
    },
    [onQRScan]
  );

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
          onResult={handleResult}
          containerStyle={{ width: "100%", height: "100%" }}
        />
      </Box>
    </Box>
  );
}
