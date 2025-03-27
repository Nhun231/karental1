import React from "react";
import Slider from "react-slick";
import { IconButton, Card, CardContent, Typography, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

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

const CarCard = ({ carData, large }) => {
  if (!carData) return <Typography>Loading...</Typography>;
  console.log(carData)
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
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mx: "auto",
        maxWidth: large ? "900px" : "800px",
        height: large ? "280px" : "200px",
        width: "100%",
        p: large ? 2 : 3,
        boxShadow: "none",
      }}
    >
      {/* Car Image */}
      <Box id="image" sx={{ width: "55%", p: 2, }} >
        <Slider {...settings}>
          {[carData.carImageFront, carData.carImageBack, carData.carImageLeft, carData.carImageRight]
            .filter(Boolean)
            .map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Car ${index + 1}`}
                style={{
                  width: "80%", height: large ? "250px" : "180px",
                  objectFit: "cover", padding: "5px", right: -5,
                  borderRadius: 8
                }}
              />
            ))}
        </Slider>
      </Box>

      {/* Car Information */}
      <CardContent
        sx={{
          display: "flex",
          width: "40%",
          p: 0,
          flexDirection: "column",
          justifyContent: "flex-start",
          maxHeight: "350px",
          height: "100%",
          marginLeft: "35px",
          marginRight: "20px",
          gap: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: large ? "1.6rem" : "1.5rem" }}>
          {carData.brand + " " + carData.model}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const roundedAvg = Math.ceil(carData.averageRatingByCar * 2) / 2;

            return i < Math.floor(roundedAvg) ? (
              <StarIcon key={i} color="warning" fontSize="small" />
            ) : i === Math.floor(roundedAvg) && roundedAvg % 1 !== 0 ? (
              <StarHalfIcon key={i} color="warning" fontSize="small" />
            ) : (
              <StarBorderIcon key={i} fontSize="small" color="warning" />
            );
          })}

          {carData.averageRatingByCar < 1 && (
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontStyle: "italic",
                color: "gray",
                ml: 1,
              }}
            >
              (No ratings yet)
            </Typography>
          )}
        </Box>

        <Typography variant="body1" sx={{ fontSize: large ? "1rem" : "0.875rem" }}>
          No. of rides: <strong>{carData.noOfRides || 0}</strong>
        </Typography>

        <Typography variant="body1">
          <span style={{ fontSize: large ? "1rem" : "0.9rem" }}>Price:{" "}</span>
          <span
            style={{ color: "#05ce80", fontSize: "1.1rem", fontWeight: "bold" }}
          >
            <strong>
              {new Intl.NumberFormat("vi-VN").format(carData.basePrice)}đ/day
            </strong>
          </span>
        </Typography>

        <Typography variant="body1" sx={{ fontSize: large ? "1rem" : "0.875rem" }}>
          Location: <strong>{carData.address}</strong>
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: carData.status === "Stopped" ? "red" : "green",
            fontWeight: "bold",
            fontSize: large ? "1rem" : "0.875rem",
          }}
        >
          Status: {carData.status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CarCard;
