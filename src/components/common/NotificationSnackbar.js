import { Snackbar, Alert } from "@mui/material";

export default function NotificationSnackbar({ alert, onClose }) {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        severity={alert.severity}
        onClose={onClose}
        sx={{
          fontWeight: "bold",
          border: "2px solid",
          borderColor: alert.severity === "success" ? "#05ce80" : alert.severity === "error" ? "#d32f2f" : "#ff9800",
          boxShadow: 2,
          marginTop: "120px"
        }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
}
