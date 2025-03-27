import { AppBar, Toolbar, Box, Button, Divider, Stack, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import UserMenu from "../User/UserMenu"; // Import UserMenu
import { ModalClose, ModalDialog } from "@mui/joy";
import Login from "../User/Login";
import Register from "../User/Register";
import * as Mui from "@mui/material";
import React from "react";

const Header = () => {
  const isLoggedIn = Boolean(localStorage.getItem("role"));
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <AppBar position="sticky" color="transparent" elevation={1} sx={{ backgroundColor: "white" }}>
      <Toolbar
        sx={{
          justifyContent: "space-between",
          mx: "auto",
          maxWidth: "1200px",
          width: "100%",
          py: 1,
          px: 2,
        }}
      >
        {/* Logo */}
        <Box>
          <Link to="/" style={{ textDecoration: "none" }}>
            <img
              src={logo}
              alt="logo"
              style={{ maxWidth: "250px", height: "auto" }}
            />
          </Link>
        </Box>
        {/* End Logo*/}

        {/* Menu */}
        <Stack direction="row" spacing={3} alignItems="center">
          {/* About Us */}
          <Link to="/aboutus" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                fontWeight: 500,
                textTransform: "none",
                color: "black",
                transition: "color 0.3s",
                "&:hover": { color: "#05ce80" },
              }}
            >
              About Karental
            </Button>
          </Link>
          {/* End About Us */}

          {/* Menu */}
          <Divider orientation="vertical" flexItem />

          {/* Menu If !isLoggedIn*/}
          {!isLoggedIn && (
            <>
            
                <Button onClick={handleOpen}
                id="open-register-button"
                  sx={{
                    fontWeight: 500,
                    textTransform: "none",
                    color: "black",
                    transition: "color 0.3s",
                    "&:hover": { color: "#05ce80" },
                  }}
                >
                  Sign Up
                </Button>


              <Divider
                orientation="vertical"
                flexItem
                sx={{ width: "1px", height: "25px", alignSelf: "center" }}
              />

              
                <Button onClick={handleOpen}
                id="open-login-button"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    borderColor: "black",
                    color: "black",
                    fontWeight: 500,
                    textTransform: "none",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#05ce80",
                      color: "#05ce80",
                    },
                  }}
                >
                  Login
                </Button>
          
              <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            width: "65vw",
            maxWidth: "lg",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <ModalClose onClick={handleClose} />
          <Mui.Container sx={{ display: "flex", gap: 2 }}>
            <Login />
            <Mui.Divider orientation="vertical" flexItem />
            <Register />
          </Mui.Container>
        </ModalDialog>
      </Modal>
            </>
          )}

          {/* If user is loggedIn, display UserMenu */}
          {isLoggedIn && <UserMenu />}
          {/* End UserMenu */}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
