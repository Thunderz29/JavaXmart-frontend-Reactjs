import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Ticket } from "react-iconly";
import { handleGetProfile } from "../handlers/ProfileHandler.js";
import formatCurrency from "../utils/Currency.js";
import TableComponent from "./Table.jsx";

export default function ModalConfirmation({
  columns,
  rows,
  isOpen,
  onOpenChange,
  totalPrice,
  handleCheckout,
}) {
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchData = async (data) => {
      try {
        const dataProfile = await handleGetProfile(data);
        setCustomerData(dataProfile);
      } catch (error) {
        console.error("Failed to fetch customer profile:", error);
      }
    };

    if (totalPrice !== 0) {
      fetchData();
    }
  }, [totalPrice]);

  if (!customerData) {
    return <Box>Loading...</Box>;
  }

  return (
    <Dialog open={isOpen} onClose={onOpenChange} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box className="flex gap-3 items-center">
          <Ticket />
          <Typography variant="h6">Checkout</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col mb-4">
          <Typography variant="body1">
            Your Wallet: {formatCurrency(customerData.wallet)}
          </Typography>
        </Box>
        <TableComponent columns={columns} rows={rows} />
        <Box className="flex flex-col mt-4">
          <Typography variant="h6" align="right" fontWeight="bold">
            Total Price: {totalPrice}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        {rows.length > 0 && (
          <>
            <Button color="error" onClick={onOpenChange} variant="outlined">
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleCheckout}
              variant="contained"
            >
              Confirm
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
