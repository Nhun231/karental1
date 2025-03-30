import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import bannerimg from "../../assets/car_owner_banner.jpg";

/**
 * Guest Banner Component
 * Provide UI for guest
 */
const GuestBanner = () => {
    const navigate = useNavigate();

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
                flexDirection: { xs: "column", md: "row" }, // Responsive direction
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: { xs: 2, md: 4 },
            }}
        >
            {/* Left Side - Find a Car */}
            <Box sx={bannerContentStyle}>
                <Typography variant="h4" fontWeight="bold" sx={titleStyle}>
                    Looking for a <span style={{ color: "#05ce80" }}>vehicle?</span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    Choose between hundreds of private cars for rent at affordable prices!
                </Typography>
                <Button onClick={() => navigate("/?role=CUSTOMER")} sx={buttonStyle}>
                    Find a Rental Car
                </Button>
            </Box>

            {/* Divider Line (Only show on md+) */}
            <Box
                sx={{
                    display: { xs: "none", sm: "block" },
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "50%",
                    width: "10px",
                    backgroundColor: "rgb(255, 255, 255)",
                    transform: "skewX(-20deg)",
                    zIndex: 2,
                }}
            />

            {/* Right Side - List Your Car */}
            <Box sx={bannerContentStyle}>
                <Typography variant="h4" fontWeight="bold" sx={titleStyle}>
                    Are you a <span style={{ color: "#05ce80" }}>car owner?</span>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    List your car and start earning money today!
                </Typography>
                <Button onClick={() => navigate("/?role=CAR_OWNER")} sx={buttonStyle}>
                    List Your Car
                </Button>
            </Box>
        </Box>
    );
};

// Styles
const bannerContentStyle = {
    flex: 1,
    color: "white",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    p: 2,
};

const titleStyle = {
    fontSize: { xs: "1.8rem", md: "2.5rem" }, // Responsive font size
};

const buttonStyle = {
    mt: 2,
    backgroundColor: "#05ce80",
    color: "white",
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#048f5b" },
};

export default GuestBanner;
