import React from "react";
import { AppBar, Toolbar, Box, Button, Divider, Stack, Modal, IconButton, Drawer, List, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import { Menu as MenuIcon } from "@mui/icons-material";
import logo from "../../assets/logo.png";
import UserMenu from "../User/UserMenu";
import { ModalClose, ModalDialog } from "@mui/joy";
import Login from "../User/Login";
import Register from "../User/Register";
import * as Mui from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import NotificationSnackbar from "./NotificationSnackbar";
const Header = () => {
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  const isLoggedIn = Boolean(localStorage.getItem("role"));
  const [open, setOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); // Check if screen width is less than 768px

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <AppBar position="sticky" color="transparent" elevation={1} sx={{ backgroundColor: "white" }}>
      <Toolbar sx={{ justifyContent: "space-between", mx: "auto", maxWidth: "1200px", width: "100%", py: 1, px: 2, boxSizing: "border-box", }}>
        {/* Logo */}
        <Box>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img src={logo} alt="logo" style={{ maxWidth: isMobile ? "150px" : "250px", height: "auto" }} />
          </Link>
        </Box>

        {/* Desktop Menu */}
        {!isMobile ? (
          <Stack direction="row" spacing={3} alignItems="center">
            <Link to="/aboutus" style={{ textDecoration: "none" }}>
              <Button sx={{ fontWeight: 500, textTransform: "none", color: "black", "&:hover": { color: "#05ce80" } }}>
                About Karental
              </Button>
            </Link>
            <Divider orientation="vertical" flexItem />

            {!isLoggedIn ? (
              <>
                <Button onClick={handleOpen} id="open-register-button" sx={{ fontWeight: 500, textTransform: "none", color: "black", "&:hover": { color: "#05ce80" } }}>
                  Sign Up
                </Button>
                <Divider orientation="vertical" flexItem sx={{ width: "1px", height: "25px", alignSelf: "center" }} />
                <Button onClick={handleOpen} id="open-login-button" variant="outlined" sx={{ px: 4, py: 1.5, borderRadius: 2, borderColor: "black", color: "black", fontWeight: 500, textTransform: "none", "&:hover": { borderColor: "#05ce80", color: "#05ce80" } }}>
                  Login
                </Button>
              </>
            ) : (
              <UserMenu />
            )}
          </Stack>
        ) : (
          // Mobile Menu Button
          <IconButton onClick={toggleDrawer} sx={{ color: "black" }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List sx={{ width: "250px" }}>
            <ListItem button component={Link} to="/aboutus" onClick={toggleDrawer}>
              About Karental
            </ListItem>
            {!isLoggedIn ? (
              <>
                <ListItem button onClick={handleOpen}>Sign Up</ListItem>
                <ListItem button onClick={handleOpen}>Login</ListItem>
              </>
            ) : (
              <UserMenu />
            )}
          </List>
        </Drawer>

        {/* Login/Register Modal */}
        <Modal open={open} onClose={handleClose}>
          <ModalDialog sx={{ width: "65vw", maxWidth: "lg", maxHeight: "100vh", overflowY: "auto", zIndex: 1200, }}>
            <ModalClose onClick={handleClose} />
            <Mui.Container sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2 }}>
              <Login onLoginSuccess={handleClose} setAlert={setAlert} />
              {!isMobile && <Mui.Divider orientation="vertical" flexItem />}
              <Register onRegisterSucess={handleClose} setAlert={setAlert} />
            </Mui.Container>
          </ModalDialog>
        </Modal>
        {/* Notification Snackbar */}
        <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} disablePortal={false} // Thử để false để snackbar render trong cùng DOM
          sx={{ zIndex: 2000 }} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
