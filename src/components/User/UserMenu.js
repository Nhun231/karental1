import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/UserServices";
import ConfirmationDialog from "../common/ConfirmationDialog";
import NotificationSnackbar from "../common/NotificationSnackbar";
const UserMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const username = localStorage.getItem("name");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenConfirm(true); // Show confirmation dialog
  };

  const handleLogoutConfirm = async () => {
    setOpenConfirm(false); // Close confirmation dialog
    try {
      await logoutUser();
      setAlert({ open: true, message: "You're logged out", severity: "success" });
      handleClose()
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Logout failed:", error);
      setAlert({ open: true, message: "Logout failed", severity: "error" });
    }
  };
  const [openConfirm, setOpenConfirm] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  return (
    <>
      <IconButton
        id="user-button"
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <AccountCircleIcon fontSize="large" />
        <Typography sx={{ fontWeight: 500 }}>Welcome, {username}</Typography>
        <ArrowDropDownIcon />
      </IconButton>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => navigate("/user/profile")}>
          My Profile
        </MenuItem>
        {localStorage.getItem("role") === "OPERATOR" && (
          <>
            <MenuItem onClick={() => navigate("/booking-list")}>
              Booking List
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-cars")}>My Cars</MenuItem>
          </>
        )}
        {localStorage.getItem("role") === "CAR_OWNER" && (
          <>
            <MenuItem onClick={() => navigate("/my-cars")}>My Cars</MenuItem>
            <MenuItem onClick={() => navigate("/my-rentals")}>
              My Rentals
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-wallet")}>
              My Wallet
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-feedback")}>
              My Feedback
            </MenuItem>
          </>
        )}
        {localStorage.getItem("role") === "CUSTOMER" && (
          <>
            <MenuItem onClick={() => navigate("/my-bookings")}>
              My Booking
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-wallet")}>
              My Wallet
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-feedback")}>
              My Feedback
            </MenuItem>
          </>
        )}
        <Divider />
        <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
      </Menu>
      <ConfirmationDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        content="Are you sure you want to logout?"
      />

      {/* Notification Snackbar */}
      <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
  
    </>
  );
};

export default UserMenu;
