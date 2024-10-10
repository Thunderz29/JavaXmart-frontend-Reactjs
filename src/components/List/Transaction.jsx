import React, { useEffect, useState } from "react";
import { getTransactions } from "../../service/services.js";
import formatCurrency from "../../utils/Currency.js";
import formatDate from "../../utils/Date.js";
import TableComponent from "../Table.jsx";

export default function ListTransactions() {
  const [transactions, setTransactions] = useState([]);

  const handleGetTransaction = () => {
    getTransactions()
      .then((response) => {
        if (response.status === 200) {
          console.log("Data Transaction: ", response.data.data);
          setTransactions(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rowTransaction = transactions.map((transactions, index) => ({
    ...transactions,
    no: index + 1,
    key: index.toString(),
    customerName: transactions.customer.name,
    productName: transactions.product.productName,
    price: formatCurrency(transactions.price),
    totalPrice: formatCurrency(transactions.totalProduct * transactions.price),
    date: formatDate(transactions.date),
  }));

  const columnsTransaction = [
    { key: "no", label: "No" },
    { key: "customerName", label: "Customer Name" },
    { key: "productName", label: "Product Name" },
    { key: "price", label: "Price" },
    { key: "totalProduct", label: "Quantity" },
    { key: "totalPrice", label: "Total Price" },
    { key: "date", label: "Date" },
  ];

  useEffect(() => {
    handleGetTransaction();
  }, []);

  return <TableComponent columns={columnsTransaction} rows={rowTransaction} />;
}
