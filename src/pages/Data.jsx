import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import ListCustomers from "../components/List/Customer.jsx";
import ListProducts from "../components/List/Product.jsx";
import ListTransactions from "../components/List/Transaction.jsx";

export default function DataPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={5}
    >
      <Box display="flex" justifyContent="center">
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          variant="fullWidth"
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Customer" />
          <Tab label="Product" />
          <Tab label="Transaction" />
        </Tabs>
      </Box>
      <Box mt={3} width="100%">
        {selectedTab === 0 && <ListCustomers />}
        {selectedTab === 1 && <ListProducts />}
        {selectedTab === 2 && <ListTransactions />}
      </Box>
    </Box>
  );
}
