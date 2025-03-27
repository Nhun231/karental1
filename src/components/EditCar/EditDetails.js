import * as React from "react";
import {
  Typography,
  Box,
  Button,
  Rating,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import {
  fetchCarById,
  setCar,
  setFetchedCarData,
} from "../../reducers/carFetchReducer";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import TabEditCar from "./TabEditCar";
import Header from "../common/Header";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";
import Footer from "../common/Footer";
import { saveFileToDB, getFileFromDB } from "../../Helper/indexedDBHelper";
import Swal from "sweetalert2";

export default function EditDetails({ selectedCarId }) {
  const dispatch = useDispatch();

  //get carId from session
  const carId = sessionStorage.getItem("selectedCarId");
  const {
    carData = {},
    status,
    error,
  } = useSelector((state) => state.carFetch);

  const [images, setImages] = useState([]);
  const [value, setValue] = useState(0); // Mặc định 3 sao

  //function get data car detail
  useEffect(() => {
    const fetchAndProcessCarData = async () => {
      try {
        const data = await dispatch(fetchCarById(carId)).unwrap();

        if (!data?.data) return;

        // pick image from IndexedDB if exist, else not pick from API
        const front = data?.data?.carImageFrontUrl;
        const back = data?.data?.carImageBackUrl;
        const left = data?.data?.carImageLeftUrl;
        const right = data?.data?.carImageRightUrl;

        // update list image display
        setImages([front, back, left, right].filter(Boolean));

        // Save image intp IndexedDB if pick from API
        if (data?.data?.carImageFrontUrl)
          await saveFileToDB("carImageFrontUrl", data?.data?.carImageFrontUrl);
        if (data?.data?.carImageBackUrl)
          await saveFileToDB("carImageBackUrl", data?.data?.carImageBackUrl);
        if (data?.data?.carImageLeftUrl)
          await saveFileToDB("carImageLeftUrl", data?.data?.carImageLeftUrl);
        if (data?.data?.carImageRightUrl)
          await saveFileToDB("carImageRightUrl", data?.data?.carImageRightUrl);

        // process address
        const address = data.data.address || "";
        const parts = address.split(",");
        const part1 = parts[0]?.trim() || "";
        const part2 = parts[1]?.trim() || "";
        const part3 = parts[2]?.trim() || "";
        const part4 = parts.slice(3).join(",").trim() || "";

        // combine data into dispatch only once
        dispatch(
          setFetchedCarData({
            ...data, // keep origin data
            addressCityProvince: part1,
            addressDistrict: part2,
            addressWard: part3,
            addressHouseNumberStreet: part4,
          })
        );
        console.log(carData.data.status);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchAndProcessCarData();
  }, [dispatch]);

  // follow the change of imageKeys
  useEffect(() => {
    const fetchImagesFromIndexedDB = async () => {
      const front =
        (await getFileFromDB("carImageFront")) ||
        (await getFileFromDB("carImageFrontUrl"));
      const back =
        (await getFileFromDB("carImageBack")) ||
        (await getFileFromDB("carImageBackUrl"));
      const left =
        (await getFileFromDB("carImageLeft")) ||
        (await getFileFromDB("carImageLeftUrl"));
      const right =
        (await getFileFromDB("carImageRight")) ||
        (await getFileFromDB("carImageRightUrl"));

      // change blob to URL to display image
      const processFile = (file) =>
        file instanceof Blob ? URL.createObjectURL(file) : file;

      const newImages = [front, back, left, right]
        .filter(Boolean) // filter image not exist
        .map(processFile); // convert Blob to URL

      setImages(newImages);
    };

    fetchImagesFromIndexedDB();

    // listend event change from IndexedDB
    const handleDBUpdate = () => fetchImagesFromIndexedDB();
    window.addEventListener("indexedDBUpdated", handleDBUpdate);

    return () => {
      window.removeEventListener("indexedDBUpdated", handleDBUpdate);
    };
  }, []); // when imageKeys change it will re-run

  return (
    <>
      <Header></Header>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <div style={{ display: "flex" }}>
          <div>
            <Box
              sx={{
                width: "500px",
                margin: "50px 150px",
                marginRight: "50px",
                mt: 4,
                border:
                  images.length === 0 && status !== "loading"
                    ? "2px dashed gray"
                    : "none",
                borderRadius: "8px",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {status === "loading" || images.length === 0 ? (
                <Skeleton variant="rectangular" width={500} height={300} />
              ) : error ? (
                <Typography variant="body1" color="error">
                  Failed to load images
                </Typography>
              ) : (
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
              )}
            </Box>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4" style={{ marginTop: "30px" }}>
                {carData?.data?.brand ? (
                  `${carData.data.brand} ${carData.data.model}`
                ) : (
                  <Skeleton variant="text" width={200} height={40} />
                )}
              </Typography>
            </div>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Ratings:</Box>
              <Box sx={{ flex: "2" }}>
                <Rating
                  name="star-rating"
                  value={value}
                  onChange={(event, newValue) => setValue(newValue)}
                  precision={0.5} // Cho phép chọn 0.5 sao
                />
              </Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>No. of rides:</Box>
              <Box sx={{ flex: "2" }}>0</Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Price:</Box>
              <Box sx={{ flex: "2", color: "red" }}>
                {carData?.data ? (
                  <>
                    {new Intl.NumberFormat("en-US").format(
                      carData.data.basePrice
                    )}
                    K
                  </>
                ) : (
                  <Skeleton variant="text" width={50} />
                )}
                <span style={{ color: "black" }}> /day</span>
              </Box>
            </Typography>

            <Typography
              component={"div"}
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Locations:</Box>
              <Box sx={{ flex: "2", mt: 2 }}>
                {carData?.data?.address ? (
                  carData.data.address
                ) : (
                  <Skeleton width={100} />
                )}
              </Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Status:</Box>
              <Box sx={{ flex: "2" }}>
                {carData?.data?.status ? (
                  <Select
                    value={carData?.data?.status}
                    id="select-status"
                    onChange={(e) => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "Do you really want to change the car status?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, change it!",
                        cancelButtonText: "No, keep it",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          dispatch(
                            setCar({ ...carData.data, status: e.target.value })
                          );
                        }
                      });
                    }}
                    displayEmpty
                    sx={{
                      "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                      },
                    }}
                  >
                    {carData?.data?.status !== "VERIFIED" && (
                      <MenuItem value="NOT_VERIFIED" id="not-verified">
                        <Typography sx={{ color: "green", fontWeight: "bold" }}>
                          Not verified
                        </Typography>
                      </MenuItem>
                    )}

                    <MenuItem value="STOPPED" id="stopped">
                      <Typography sx={{ color: "red", fontWeight: "bold" }}>
                        Stopped
                      </Typography>
                    </MenuItem>
                    {carData?.data?.status === "VERIFIED" && (
                      <MenuItem value="VERIFIED" id="verified">
                        <Typography sx={{ color: "blue", fontWeight: "bold" }}>
                          Verified
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                ) : (
                  <Skeleton variant="text" width={200} height={40} />
                )}
              </Box>
            </Typography>
          </div>
        </div>

        <TabEditCar></TabEditCar>
      </Box>
      <Footer />
    </>
  );
}
