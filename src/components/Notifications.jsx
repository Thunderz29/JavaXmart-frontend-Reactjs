import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Alert as MuiAlert, Snackbar } from "@mui/material";
import { useEffect } from "react";

const Alert = ({ message, type = "primary", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const alertSeverity = {
    primary: "info",
    success: "success",
    warning: "warning",
    danger: "error",
  };

  return (
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MuiAlert
        onClose={onClose}
        severity={alertSeverity[type]}
        sx={{ width: "100%" }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
