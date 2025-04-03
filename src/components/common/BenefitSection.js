import { Box, Card, CardContent, Typography, Button, Grid, Modal } from "@mui/material";
import { Link } from "react-router-dom";
import rentcarimg from "../../assets/rentcar.jpg";
import {
    VerifiedUser as VerifiedUserIcon,
    AttachMoney as AttachMoneyIcon,
    PriceCheck as PriceCheckIcon,
    Handshake as HandshakeIcon,
    HowToReg as HowToRegIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
} from "@mui/icons-material";
import React from "react";
import { ModalClose, ModalDialog } from "@mui/joy";
import Register from "../User/Register";
import { useState } from "react";
import NotificationSnackbar from "./NotificationSnackbar";

/**
 * BenefitSection Component
 * Provide UI for 'Home Page'
 */
const ICON_STYLE = { fontSize: 40, color: "#05ce80" };

const benefits = [
    { title: "How the insurance works:", description: "From the minute you hand the keys over till the second you get them back you are covered. Your private insurance is not affected.", icon: <VerifiedUserIcon sx={ICON_STYLE} /> },
    { title: "It's completely free:", description: "We offer both owners and renters free sign ups. It’s only once a vehicle is rented out that a share is deducted to cover admin and insurance.", icon: <AttachMoneyIcon sx={ICON_STYLE} /> },
    { title: "You decide the price:", description: "When you list a car you decide the price. We can help with recommendations as to price, but ultimately you decide!", icon: <PriceCheckIcon sx={ICON_STYLE} /> },
    { title: "Handing over your vehicle:", description: "You arrange the time and location for the exchange of your vehicle with the renter. Both parties will need to agree and sign the vehicle rental sheet before and after key handover.", icon: <HandshakeIcon sx={ICON_STYLE} /> },
    { title: "You are in charge:", description: "All renters are pre-screened by us to ensure safety and get your approval. If you do not feel comfortable with someone you are able to decline a booking.", icon: <HowToRegIcon sx={ICON_STYLE} /> },
    { title: "Set payment:", description: "We pay you once a month and you can always view how much your car has earned under your user profile.", icon: <AccountBalanceWalletIcon sx={ICON_STYLE} /> },
];

const BenefitsSection = () => {
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
    const isLoggedIn = Boolean(localStorage.getItem("role"));
    const isCarOwner = "true";
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
    <Box sx={{ px: { xs: 2, md: 4 } }}>
        {/* Title */}
        <Typography variant="h4" fontWeight="bold" color="black" sx={{ textAlign: "center", p: 2, my: 5, fontSize: { xs: "1.8rem", md: "2.5rem" }, }}>
            Why should you become a <span style={{ color: "#05ce80" }}>car owner</span> on <span style={{ color: "#05ce80" }}>Karental</span>?
        </Typography>

        {/* Benefits Grid */}
        <Grid container spacing={2}>
            {benefits.map(({ title, description, icon }, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                        sx={{
                            border: "2px solid rgb(207, 241, 219)",
                            borderRadius: 2,
                            backgroundColor: "rgb(247, 253, 249)",
                            boxShadow: "none",
                            height: "100%",
                        }}
                    >
                        <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                            {icon}
                            <Box>
                                <Typography variant="h6" fontWeight="bold">{title}</Typography>
                                <Typography variant="body2" color="textSecondary">{description}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>

        {/* Bottom Title */}
        <Typography variant="h4" fontWeight="bold" color="black" sx={{ textAlign: "center", p: 2, my: 5, fontSize: { xs: "1.8rem", md: "2.5rem" }, }}>
            Make Money On<span style={{ color: "#05ce80" }}> Your Car </span> right away
        </Typography>

        {/* Banner */}
        <Box
            sx={{
                minHeight: { xs: 250, md: 350 },
                backgroundImage: `url(${rentcarimg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: { xs: 2, md: 5 },
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
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                color="white"
                sx={{
                    position: "relative",
                    zIndex: 2,
                    textAlign: "center",
                    fontSize: { xs: "1.8rem", md: "2.5rem" },
                }}
            >
                List <span style={{ color: "#05ce80" }}> your car </span> today, it's free
                <br /> and we <span style={{ color: "#05ce80" }}> look after </span> the rest.
            </Typography>

            {/* Button Trigger Add A Car*/}
                {isLoggedIn ? <Button
                component={Link}
                to="/add-car-basic"
                sx={{
                    mt: 4,
                    backgroundColor: "#04b36d",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    "&:hover": { backgroundColor: "#057347" },
                    position: "relative",
                    zIndex: 2,
                    px: 3,
                    py: 1.5,
                }}
            >
                    List Your Car Today
                </Button> : (
                    <Button
                        onClick={handleOpen}
                        id="open-register-button"
                        sx={{
                            mt: 4,
                            backgroundColor: "#04b36d",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            "&:hover": { backgroundColor: "#057347" },
                            position: "relative",
                            zIndex: 2,
                            px: 3,
                            py: 1.5,
                        }}
                    >
                        List Your Car Today
            </Button>
                )}
        </Box>
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
    )
};

export default BenefitsSection;
