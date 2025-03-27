import { useState } from "react";
import { Menu, MenuItem, IconButton, Typography, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const username = localStorage.getItem("username") || "User";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/karental/auth/logout", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("token");

      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <AccountCircleIcon fontSize="large" />
        <Typography sx={{ fontWeight: 500 }}>Welcome, {username}</Typography>
        <ArrowDropDownIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => navigate("/user/profile")}>
          My Profile
        </MenuItem>
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
