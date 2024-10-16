import { getDetailCustomer } from "../service/services.js";

export const handleQRScanCustomer = async (data, setScannedData, setAlert) => {
  try {
    const response = await getDetailCustomer(data);
    if (response.status === 200) {
      localStorage.setItem("qrcodeCustomer", data);
      setScannedData(data);
      setAlert({
        type: "success",
        message: `Welcome, ${response.data.name}`,
      });
    } else {
      setAlert({
        type: "danger",
        message: "Customer Not Found, Please Scan With Correct QR Code!",
      });
    }
  } catch (error) {
    setAlert({
      type: "danger",
      message: "Customer Not Found, Please Scan With Correct QR Code!",
    });
  }
};
