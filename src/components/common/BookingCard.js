import Slider from "react-slick";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { IconButton, Card, CardContent, Typography, Box, Stack } from "@mui/material";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const CustomPrevArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: "absolute",
            left: -40,
            zIndex: 10,
            top: "50%",
            transform: "translateY(-50%)",
        }}
    >
        <ArrowBackIos fontSize="large" />
    </IconButton>
);

const CustomNextArrow = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: "absolute",
            right: -50,
            top: "50%",
            transform: "translateY(-50%)",
        }}
    >
        <ArrowForwardIos fontSize="large" />
    </IconButton>
);

const BookingCard = ({ BookingData }) => {
    console.log("Received Booking Data in BookingCard:", BookingData);
    if (!BookingData) return <Typography>Loading...</Typography>;
    console.log(BookingData)
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
    };
    return (
        <div>
            <Card
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mx: "auto",
                    maxWidth: "900px",
                    height: "280px",
                    width: "100%",
                    p: 3,
                    boxShadow: "none",
                }}
            >
                {/* Car Image */}
                <Box id="image" sx={{ width: "55%", p: 2, }} >
                    <Slider {...settings}>
                        {[BookingData.carImageFrontUrl, BookingData.carImageBackUrl, BookingData.carImageLeftUrl, BookingData.carImageRightUrl]
                            .filter(Boolean)
                            .map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Booking ${index + 1}`}
                                    style={{
                                        width: "80%", height: "200px",
                                        objectFit: "cover", padding: "5px", right: -5,
                                        borderRadius: 8
                                    }}
                                />
                            ))}
                    </Slider>
                </Box>

                {/* Booking Information */}
                <CardContent
                    sx={{
                        display: "flex",
                        width: "45%",
                        p: 0,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        maxHeight: "350px",
                        height: "100%",
                        marginLeft: "50px",
                        marginRight: "20px",
                        gap: 0.8,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: "1.8rem" }} id="booking-name">
                        {BookingData.brand + " " + BookingData.model}
                    </Typography>

                    <Box>
                        <Stack spacing={0.5}>
                            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }} id="booking-pickUpTime">
                                <span style={{ fontWeight: "bold", color: "gray" }}>From: </span> {new Date(BookingData.pickUpTime).toLocaleDateString()} - {new Date(BookingData.pickUpTime).getHours()}:00
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: "0.875rem", fontWeight: 500, color: "text.primary" }} id="booking-dropOffTime">
                                <span style={{ fontWeight: "bold", color: "gray" }}>To: </span> {new Date(BookingData.dropOffTime).toLocaleDateString()} - {new Date(BookingData.dropOffTime).getHours()}:00
                            </Typography>
                        </Stack>
                    </Box>


                    <Typography variant="body1" style={{ fontSize: "0.9rem" }} id="booking-numberOfDay">
                        <strong>Number of days:</strong> {BookingData.numberOfDay ? BookingData.numberOfDay : BookingData.totalPrice / BookingData.basePrice}
                    </Typography>

                    <Typography variant="body1" style={{ fontSize: "0.9rem" }} >
                        <strong>Base Price:{" "}</strong>
                        <span
                            style={{ color: "#05ce80", fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                            <strong id="booking-basePrice">
                                {new Intl.NumberFormat("vi-VN").format(BookingData.basePrice)}đ/day
                            </strong>
                        </span>
                    </Typography>

                    <Typography variant="body1" style={{ fontSize: "0.9rem" }} >
                        <strong>Total:{" "}</strong>
                        <span
                            style={{ color: "#05ce80", fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                            <strong id="booking-totalPrice">
                                {new Intl.NumberFormat("vi-VN").format(BookingData.totalPrice)}đ
                            </strong>
                        </span>
                    </Typography>

                    <Typography variant="body1" style={{ fontSize: "0.9rem" }} >
                        <strong>Deposit:{" "}</strong>
                        <span
                            style={{ color: "#05ce80", fontSize: "1.1rem", fontWeight: "bold" }}
                        >
                            <strong id="booking-deposit">
                                {new Intl.NumberFormat("vi-VN").format(BookingData.deposit)}đ
                            </strong>
                        </span>
                    </Typography>

                    <Typography variant="body1" sx={{ fontSize: "1rem" }} id="booking-number">
                        <strong>Booking No.: </strong>{BookingData.bookingNumber}
                    </Typography>
                    <Typography
                        variant="body1"
                        id="booking-status"
                        sx={{
                            color:
                                BookingData.status === "CONFIRMED" ? "#05ce80" :
                                    BookingData.status === "IN_PROGRESS" ? "#ffd700" :
                                        BookingData.status === "PENDING_DEPOSIT" || "PENDING_PAYMENT" ? "red" :
                                            BookingData.status === "COMPLETED" ? "blue" :
                                                BookingData.status === "CANCEL" ? "gray" : "black",
                            fontWeight: "bold",
                        }}
                    >
                        <span style={{ fontWeight: "bold", color: "black" }}>Booking Status:  </span> {BookingData.status}
                        {BookingData.status === "PENDING_DEPOSIT" &&
                            <Typography variant="body2" color="gray">
                                <em>Our operator will contact you for further instruction</em>
                            </Typography>}
                    </Typography>

                </CardContent>
            </Card>
        </div>
    )
}
export default BookingCard;