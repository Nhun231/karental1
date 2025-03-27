import { Box, Typography, Link, Grid, Container, Divider } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        color: "#333333",
        py: 6,
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} alignItems="flex-start">
          {/* RENT CAR */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Rent Car
            </Typography>
            <Link
              href="/public"
              underline="none"
              color="inherit"
              sx={{
                "&:hover": { color: "#05ce80" },
                display: "block",
              }}
            >
              Search Cars and Rates
            </Link>
          </Grid>

          {/* CUSTOMER ACCESS */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Customer Access
            </Typography>
            <Box>
              <Link
                href="/public"
                underline="none"
                color="inherit"
                sx={{
                  "&:hover": { color: "#05ce80" },
                  display: "block",
                }}
              >
                Manage My Booking
              </Link>
              <Link
                href="/public"
                underline="none"
                color="inherit"
                sx={{
                  "&:hover": { color: "#05ce80" },
                  display: "block",
                }}
              >
                My Wallet
              </Link>
              <Link
                href="/public"
                underline="none"
                color="inherit"
                sx={{
                  "&:hover": { color: "#05ce80" },
                  display: "block",
                }}
              >
                My Car
              </Link>
              <Link
                href="/public"
                underline="none"
                color="inherit"
                sx={{
                  "&:hover": { color: "#05ce80" },
                  display: "block",
                }}
              >
                Login
              </Link>
            </Box>
          </Grid>

          {/* JOIN US */}
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              Join Us
            </Typography>
            <Link
              href="/Register"
              underline="none"
              color="inherit"
              sx={{
                "&:hover": { color: "#05ce80" },
              }}
            >
              New User Sign Up
            </Link>
          </Grid>
        </Grid>

        {/* Divider*/}
        <Divider sx={{ my: 4 }}  />

        {/* Footer Bottom */}
        <Box sx={{ textAlign: "left", fontSize: 14 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Karental. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
