import axios from "axios";

const BASE_URL = "http://localhost:8080";
const GRAPHQL_URL = "http://localhost:3000/graphql";

export const getCustomers = async () => {
  try {
    return await axios.get(BASE_URL + "/customer");
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    return await axios.get(BASE_URL + "/product");
  } catch (error) {
    console.log(error);
  }
};

export const getDetailProduct = async (rfid) => {
  try {
    return await axios.get(BASE_URL + `/product/${rfid}`);
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async () => {
  try {
    return await axios.get(BASE_URL + "/transaction/history");
  } catch (error) {
    console.log(error);
  }
};

export const getDetailCustomer = async (qrCode) => {
  try {
    return await axios.get(BASE_URL + `/customer/${qrCode}`);
  } catch (error) {
    console.log(error);
  }
};

export const getHistoryTransaction = async (qrcode) => {
  const query = `
      query GetTransaction($qrcode: String!) {
        getTransaction(qrcode: $qrcode) {
          qrcode
          rfid
          price
          totalProduct
          date
        }
      }
    `;

  const variables = {
    qrcode: qrcode,
  };

  try {
    return await axios.post(GRAPHQL_URL, { query, variables });
  } catch (error) {
    console.log(error);
  }
};

export const saveTransaction = async (qrcode, transaction) => {
  const query = `
        mutation SaveTransaction($qrcode: String!, $transaction: [TransactionInput!]!) {
            saveTransaction(qrcode: $qrcode, transaction: $transaction) {
                success
                message
            }
        }
    `;

  const variables = {
    qrcode,
    transaction,
  };

  try {
    return await axios.post(GRAPHQL_URL, { query, variables });
  } catch (error) {
    console.log(error);
  }
};
