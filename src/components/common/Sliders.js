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
        <Box sx={{
            width: { xs: "100%", sm: "55%" },
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: "10px 20px"
        }}>
            <Slider {...settings} style={{ width: "100%", maxWidth: "100%" }}>
                {images.filter(Boolean).map((img, index) => (
                    <Box key={index} sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "300px",
                        overflow: "hidden"
                    }}>
                        <img
                            src={img}
                            loading="lazy"
                            alt={`Booking ${index + 1}`}
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                borderRadius: 8
                            }}
                        />
                    </Box>
                ))
                }
            </Slider>
        </Box>
    );
};
export default Sliders;