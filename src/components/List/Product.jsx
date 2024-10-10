import React, { useEffect, useState } from "react";
import { getProducts } from "../../service/services.js";
import formatCurrency from "../../utils/Currency.js";
import TableComponent from "../Table.jsx";

export default function ListProducts() {
  const [products, setProducts] = useState([]);

  const handleGetProducts = () => {
    getProducts()
      .then((response) => {
        if (response.status === 200) {
          console.log("Data Products: ", response.data.data);
          setProducts(response.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const rowProduct = products.map((products, index) => ({
    ...products,
    no: index + 1,
    key: index.toString(),
    price: formatCurrency(products.price),
  }));

  const columnsProduct = [
    { key: "no", label: "No" },
    { key: "rfid", label: "RFID" },
    { key: "productName", label: "Product Name" },
    { key: "price", label: "Price" },
  ];

  useEffect(() => {
    handleGetProducts();
  }, []);

  return <TableComponent columns={columnsProduct} rows={rowProduct} />;
}
