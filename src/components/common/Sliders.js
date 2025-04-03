import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { IconButton, Box } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * 
 * Slider Component
 * Display image with slider UI 
 */
const CustomArrow = ({ onClick, direction }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: direction === "left" ? "10px" : "auto",
            right: direction === "right" ? "10px" : "auto",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
        }}
    >
        {direction === "left" ? <ArrowBackIos fontSize="large" /> : <ArrowForwardIos fontSize="large" />}
    </IconButton>
);

const Sliders = ({ images, isSmallScreen }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !isSmallScreen,
        prevArrow: !isSmallScreen && <CustomArrow direction="left" />,
        nextArrow: !isSmallScreen && <CustomArrow direction="right" />,
    };

    return (
        <Box sx={{ width: { xs: "100%", sm: "55%" }, display: "flex", justifyContent: "center", overflow: "hidden", maxHeight: { xs: "200px", md: "300px" }, padding: "10px 20px" }}>
            <Slider {...settings} style={{ width: !isSmallScreen && "90%", maxWidth: "100%" }}>
                {images.filter(Boolean).map((img, index) => (
                    <img key={index} src={img} alt={`Booking ${index + 1}`} style={{ minHeight: "250px", maxHeight: "250px", borderRadius: 8 }} />
                ))}
            </Slider>
        </Box>
    );
};

export default Sliders;
