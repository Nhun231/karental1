import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Rating,
  Link,
  Breadcrumbs,
} from "@mui/material";
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
  // State variables

  const dispatch = useDispatch(); // Retrieves the Redux dispatch function to send actions to the store
  const navigate = useNavigate(); // Retrieves the navigation function
  const [loading, setLoading] = useState(false);

  // pick up image from indexedDB
  const imageKeys = [
    "carImageFront",
    "carImageBack",
    "carImageLeft",
    "carImageRight",
  ];
  const [images, setImages] = useState([]);

  const { carData = {}, step } = useSelector((state) => state.cars); // get data from store

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
      document.title = "Add Car Finish";
    };

    fetchImages();
  }, []);

  return (
    <>
      <Header />
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#/my-cars">
          My Cars
        </Link>
        <Typography color="text.primary">Add Car Finish</Typography>
      </Breadcrumbs>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <CarStepper />
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "auto",
            p: 3,
            mt: 2,
            width: "100%",
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginTop: "30px",
              marginLeft: "12%",
              fontWeight: "bold",
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "2px",
              padding: "10px 20px",
              display: "inline-block",
              background:
                "linear-gradient(45deg,rgb(46, 199, 79),rgb(168, 255, 86))",
              borderRadius: "8px",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            Preview
          </Typography>
          <div style={{ display: "flex" }}>
            <div>
              <Box
                sx={{
                  width: "499px",
                  margin: "50px 150px",
                  marginRight: "50px",
                  mt: 4,
                  border: images.length === 0 ? "2px dashed gray" : "none",
                  borderRadius: "10px",
                  height: "300px",
                  display: "flex",
                  border: "8px solid #05CE80",
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
                          height: "305px",
                          objectFit: "cover",
                          borderRadius: "5px",
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
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Box sx={{ flex: "1", fontWeight: "bold", fontSize: "1.2rem" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Ratings:
                  </Typography>
                </Box>

                <Box sx={{ flex: "2", color: "red" }}>
                  <Rating
                    name="star-rating"
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                    precision={0.5} // Set precision to 0.5 for half stars
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: "120px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    No. of rides:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, fontSize: "1rem" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    0
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: "80px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Price:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, fontSize: "1rem" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {carData.basePrice
                        ? new Intl.NumberFormat("en-US").format(
                            carData.basePrice
                          )
                        : "0"}
                      K
                    </span>
                    /day
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: "100px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Locations:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, fontSize: "1rem" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {[
                      carData.addressCityProvince,
                      carData.addressDistrict,
                      carData.addressWard,
                      carData.addressHouseNumberStreet,
                    ]
                      .filter(Boolean) // remove null values
                      .join(", ") || "N/A"}{" "}
                    {/* replace null with "N/A" */}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box
                  sx={{
                    minWidth: "100px",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    flex: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Status:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flex: 2,
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  Available
                </Box>
              </Box>
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
              <>
                <Button
                  id="nextButton"
                  variant="contained"
                  style={{ backgroundColor: "#05ce80" }}
                  onClick={async () => {
                    setTimeout(async () => {
                      setLoading(true);
                      try {
                        await dispatch(addNewCar());
                      } finally {
                        setLoading(false);
                      }
                    }, 0);
                  }}
                  sx={{ ml: 2 }}
                >
                  {loading ? "Loading..." : "Submit"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
