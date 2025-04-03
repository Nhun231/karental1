import { Button, Box, Typography, Modal } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import bannerimg from "../../assets/car_owner_banner.jpg";
import React from "react";
import { ModalClose, ModalDialog } from "@mui/joy";
import Register from "../User/Register";
import NotificationSnackbar from "./NotificationSnackbar";
import { useState } from "react";
/**
 * CarOwnerBanner Component
 * Provide Banner UI for 'Home Page CarOwner'
 */
const CarOwnerBanner = () => {
    // Check if user is not loggin
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const isLoggedIn = Boolean(localStorage.getItem("role"));
    const isCarOwner = "true";
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box
            sx={{
                maxWidth: "1200px",
                mx: "auto",
                mt: 4,
                minHeight: { xs: "auto", md: "550px" },
                backgroundImage: `url(${bannerimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                filter: "saturate(1.5)",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1,
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: { xs: "20px", md: "0px" },
            }}
        >
            <Typography
                variant="h3"
                fontWeight="bold"
                color="white"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: { xs: "1.8rem", md: "2.5rem" }, // Responsive font size
                    px: { xs: 2, sm: 0 },
                }}
            >
                Have a <span style={{ color: "#05ce80" }}>car</span> for rent?
                <br />
                Don't miss out on <span style={{ color: "#05ce80" }}>your benefit.</span>
            </Typography>

            {!isLoggedIn && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 3,
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    {/* Arrow Animation */}
                    <Box
                        sx={{
                            animation: "slowBounce 1s ease-in-out infinite",
                            "@keyframes slowBounce": {
                                "0%, 100%": { transform: "translateY(0)", opacity: 1 },
                                "50%": { transform: "translateY(20px)", opacity: 0.8 },
                            },
                            mb: 1,
                            color: "#05ce80",
                        }}
                    >
                        <ArrowDownwardIcon fontSize="large" sx={{ fontSize: { xs: "2rem", md: "3rem" } }} />
                    </Box>

                    <Button
                        onClick={handleOpen}
                        id="open-register-button"
                        sx={{
                            mt: 1,
                            backgroundColor: "#04b36d",
                            color: "white",
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "#057347" },
                            position: "relative",
                            zIndex: 2,
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1, sm: 1.5 },
                            fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font size
                        }}
                    >
                        Register Now
                    </Button>
                </Box>
            )}

            {/* Modal Register */}
            <Modal open={open} onClose={handleClose}>
                <ModalDialog
                    sx={{
                        width: { xs: "90vw", sm: "60vw", md: "32vw" }, // Responsive modal width
                        maxWidth: "lg",
                        maxHeight: "100vh",
                        overflowY: "auto",
                        padding: { xs: "20px", sm: "40px" }, // Responsive padding
                    }}
                >
                    <ModalClose onClick={handleClose} />
                    <Register isCarOwner={isCarOwner} onRegisterSucess={handleClose} />
                </ModalDialog>
            </Modal>
            {/* Notification Snackbar */}
            <NotificationSnackbar alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
        </Box>
    );
};

export default CarOwnerBanner;
