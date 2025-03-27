import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box, Button, Rating } from "@mui/material";
import { setStep } from "../../reducers/carReducer";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { getFileFromDB } from "../../Helper/indexedDBHelper";
import { useNavigate } from "react-router-dom";
import { addNewCar } from "../../reducers/carReducer";
import CarStepper from "./CarStepper";
import Header from "../common/Header";
import Footer from "../common/Footer";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";

export default function AddCarFinish() {
  const dispatch = useDispatch(); // Retrieves the Redux dispatch function to send actions to the store
  const navigate = useNavigate(); // Retrieves the navigation function

  // pick up image from indexedDB
  const imageKeys = [
    "carImageFront",
    "carImageBack",
    "carImageLeft",
    "carImageRight",
  ];
  const [images, setImages] = useState([]);

  const { carData = {}, step } = useSelector((state) => state.cars); // Lấy dữ liệu trong Redux store

  const [value, setValue] = useState(0); // default value is 0

  // get image from indexedDB
  useEffect(() => {
    const fetchImages = async () => {
      const imageUrls = await Promise.all(
        imageKeys.map(async (key) => {
          const file = await getFileFromDB(key);
          return file ? URL.createObjectURL(file) : null;
        })
      );

      setImages(imageUrls.filter(Boolean)); // remove null values
    };

    fetchImages();
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <CarStepper />
        <Typography
          variant="h5"
          style={{ marginTop: "30px", marginLeft: "10%" }}
        >
          Preview
        </Typography>
        <div style={{ display: "flex" }}>
          <div>
            <Box
              sx={{
                width: "500px",
                margin: "50px 150px",
                marginRight: "50px",
                mt: 4,
                border: images.length === 0 ? "2px dashed gray" : "none",
                borderRadius: "8px",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3000 }}
              >
                {images.map((src, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={src}
                      alt={`Slide ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </div>
          <div>
            <Typography variant="h4" style={{ marginTop: "30px" }}>
              {carData.brand} {carData.model}
            </Typography>{" "}
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", marginTop: "20px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Ratings:</Box>
              {/* <span style={{ marginRight: "80px" }}>Ratings:</span> */}
              <Box sx={{ flex: "2", color: "red" }}>
                <Rating
                  name="star-rating"
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  precision={0.5} // Set precision to 0.5 for half stars
                />
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>No. of rides:</Box>
              <Box sx={{ flex: "2" }}>0</Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Price:</Box>
              <Box sx={{ flex: "2" }}>
                <span style={{ color: "red" }}>
                  {carData.basePrice
                    ? new Intl.NumberFormat("en-US").format(carData.basePrice)
                    : ""}
                  K{" "}
                </span>
                /day
              </Box>
            </Typography>
            <Typography
              component={"div"}
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Locations:</Box>
              <Box sx={{ flex: "2", mt: 2 }}>
                {[
                  carData.addressCityProvince,
                  carData.addressDistrict,
                  carData.addressWard,
                  carData.addressHouseNumberStreet,
                ]
                  .filter(Boolean) // Remove null or undefined values
                  .join(", ")}
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Status:</Box>
              <Box sx={{ flex: "2", color: "green" }}>Available</Box>
            </Typography>
          </div>
        </div>
        <Box mt={2} style={{ textAlign: "center", marginBottom: "50px" }}>
          {step >= 1 && (
            <Button
              variant="contained"
              style={{ backgroundColor: "#05ce80" }}
              onClick={() => {
                if (step !== 1) {
                  dispatch(setStep(step - 1));
                }
                navigate("/add-car-pricing");
              }}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
          )}

          {step === 4 && (
            <Button
              id="nextButton"
              variant="contained"
              style={{ backgroundColor: "#05ce80" }}
              onClick={() => dispatch(addNewCar())}
              sx={{ ml: 2 }}
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
