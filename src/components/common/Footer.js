import { Box, Typography, Grid, Container, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const role = localStorage.getItem("role");

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        color: "#333",
        py: 4,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* RENT CAR */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}>
              Rent Car
            </Typography>
            <NavLink to="/" style={linkStyle}>Search Cars and Rates</NavLink>
          </Grid>

          {/* CUSTOMER ACCESS */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}>
              Customer Access
            </Typography>
            <Box>
              {role === "CUSTOMER" && (
                <>
                  <NavLink to="/my-bookings" style={linkStyle}>Manage My Booking</NavLink>
                  <NavLink to="/my-wallet" style={linkStyle}>My Wallet</NavLink>
                </>
              )}
              {role === "CAR_OWNER" && <NavLink to="/my-cars" style={linkStyle}>My Cars</NavLink>}
              {!role && <NavLink to="/" style={linkStyle}>Login</NavLink>}
            </Box>
          </Grid>

          {/* JOIN US */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", textTransform: "uppercase" }}>
              Join Us
            </Typography>
            <NavLink to="/" style={linkStyle}>New User Sign Up</NavLink>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="body2" sx={{ textAlign: "left", fontSize: 14 }}>
          © {new Date().getFullYear()} Karental. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

// Link Style
const linkStyle = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
  marginBottom: "8px",
  "&:hover": { color: "#05ce80" },
};

export default Footer;
