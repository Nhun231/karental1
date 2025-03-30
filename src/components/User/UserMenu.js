import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/UserServices";
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/"); // Navigate to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
