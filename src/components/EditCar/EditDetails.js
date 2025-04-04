import * as React from "react";
import {
  Typography,
  Box,
  Rating,
  Select,
  MenuItem,
  Link,
  Breadcrumbs,
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
import Footer from "../common/Footer";
import { saveFileToDB, getFileFromDB } from "../../Helper/indexedDBHelper";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import { updateCar, checkErrors } from "../../reducers/carFetchReducer";
import { store } from "../../redux/store";
import { toast } from "react-toastify";

export default function EditDetails({ selectedCarId }) {
  const dispatch = useDispatch();

  const { carId } = useParams();

  const {
    carData = {},
    status,
    error,
  } = useSelector((state) => state.carFetch);

  const [images, setImages] = useState([]);
  const [value, setValue] = useState(0); // Mặc định 0 sao

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
      } catch (err) {
        console.error("Fetch failed:", err);
      }
      document.title = "Car Details";
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
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Link underline="hover" color="inherit" href="#/my-cars">
          My Cars
        </Link>
        <Typography color="text.primary">Car Details</Typography>
      </Breadcrumbs>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
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
          <div style={{ display: "flex" }}>
            <div>
              <Box
                sx={{
                  width: "500px",
                  marginRight: "50px",
                  ml: 4,
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
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  {carData?.data?.brand ? (
                    `${carData.data.brand} ${carData.data.model}`
                  ) : (
                    <Skeleton variant="text" width={200} height={40} />
                  )}
                </Typography>
              </div>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Ratings:
                  </Typography>
                </Box>

                <Box sx={{ flex: 2 }}>
                  <Rating
                    name="star-rating"
                    value={carData?.data?.averageRatingByCar || 0}
                    icon={
                      <StarIcon
                        sx={{ fontSize: 20, stroke: "gold", strokeWidth: 1.5 }}
                      />
                    }
                    emptyIcon={
                      <StarIcon
                        sx={{
                          fontSize: 20,
                          color: "white",
                          stroke: "black",
                          strokeWidth: 1.5,
                        }}
                      />
                    }
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
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    No. of rides:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, fontWeight: "bold" }}>{carData?.data?.noOfRides || 0}</Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Price:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2, color: "#05CE80", fontWeight: "bold" }}>
                  {carData?.data ? (
                    <>
                      {new Intl.NumberFormat("en-US").format(
                        carData.data.basePrice
                      )}
                      K
                      <span style={{ color: "black", fontWeight: "normal" }}>
                        {" "}
                        /day
                      </span>
                    </>
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Locations:
                  </Typography>
                </Box>

                <Box sx={{ flex: 2 }}>
                  {carData?.data?.address ? (
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {carData.data.address}
                    </Typography>
                  ) : (
                    <Skeleton width={100} />
                  )}
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    Status:
                  </Typography>
                </Box>
                <Box sx={{ flex: 2 }}>
                  {carData?.data?.status ? (
                    <Select
                      value={carData.data.status}
                      id="select-status"
                      onChange={(e) => {
                        const previousStatus = carData.data.status;
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Do you really want to change the car status?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes, change it!",
                          cancelButtonText: "No, keep it",
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await dispatch(checkErrors());
                            const errors = store.getState().carFetch.errors;
                            if (Object.keys(errors).length === 0) {
                              dispatch(
                                setCar({
                                  ...carData.data,
                                  status: e.target.value,
                                })
                              );
                              try {
                                await dispatch(updateCar()).unwrap();
                              } catch (error) {
                                toast.error(
                                  `Some one are renting can not stop now`,
                                  {
                                    position: "top-right",
                                    autoClose: 3000,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    style: {
                                      fontWeight: "bold",
                                      marginTop: "100px",
                                      border: "2px solid #05ce80",
                                      borderRadius: "8px",
                                      boxShadow:
                                        "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                      backgroundColor: "#e6f9f2",
                                      color: "#0a6847",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      padding: "12px 16px",
                                      fontSize: "16px",
                                    },
                                  }
                                );
                                dispatch(
                                  setCar({
                                    ...carData.data,
                                    status: previousStatus,
                                  })
                                );
                              }
                            }
                          }
                        });
                      }}
                      displayEmpty
                      sx={{ minWidth: 150 }}
                    >
                      {["NOT_VERIFIED", "STOPPED", "VERIFIED"].map((status) => {
                        const currentStatus = carData.data.status;
                        const isAllowed =
                          currentStatus === status || // Giữ lại trạng thái hiện tại
                          (currentStatus === "NOT_VERIFIED" &&
                            status === "STOPPED") ||
                          (currentStatus === "VERIFIED" &&
                            status === "STOPPED") ||
                          (currentStatus === "STOPPED" &&
                            status === "NOT_VERIFIED");

                        return isAllowed ? (
                          <MenuItem key={status} value={status} id={`${status.toLowerCase()}`}>
                            <Typography
                              sx={{
                                color:
                                  status === "NOT_VERIFIED"
                                    ? "green"
                                    : status === "STOPPED"
                                    ? "red"
                                    : "blue",
                                fontWeight: "bold",
                              }}
                            >
                              {status.replace("_", " ")}
                            </Typography>
                          </MenuItem>
                        ) : null;
                      })}
                    </Select>
                  ) : (
                    <Skeleton variant="text" width={200} height={40} />
                  )}
                </Box>
              </Box>
            </div>
          </div>
        </Box>

        <TabEditCar></TabEditCar>
      </Box>
      <Footer />
    </>
  );
}
