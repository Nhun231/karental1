import { Snackbar, Alert } from "@mui/material";

/**
 * NotificationSnackbar
 * Display message, notifications
 */
export default function NotificationSnackbar({ alert, onClose }) {
  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        top: { xs: 64, sm: "70px" },
        width: { xs: "90%", sm: "auto" },
        zIndex: 1501,
        position: "fixed"
      }}
    >
      <Alert
        severity={alert.severity || "info"}
        onClose={onClose}
        sx={{
          fontWeight: "bold",
          border: "2px solid",
          borderColor:
            alert.severity === "success"
              ? "#05ce80"
              : alert.severity === "error"
                ? "#d32f2f"
                : "#ff9800",
          boxShadow: 2,
          marginTop: { xs: 2, sm: 8 },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {alert.message || "Something went wrong!"}
      </Alert>
    </Snackbar>
  );
}

