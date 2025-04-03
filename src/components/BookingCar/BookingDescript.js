import {
  Typography,
  Box,
  Rating,
  Skeleton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Link,
  Breadcrumbs,
  TableRow,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import RentStepper from "./RentStepper";
import Header from "../common/Header";
import { getCarDetail } from "../../reducers/carFetchReducer";
import { getWallet } from "../../reducers/rentCarReducer";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const BookingDescript = () => {
  //repository of car
  const {
    carData = {},
    status,
    error,
  } = useSelector((state) => state.carFetch);

  // const { pickUpTime = "", dropOffTime = "" } = useSelector(
  //   (state) => state.rental
  // );
    localStorage.setItem("pickUpTime", pickUpTime);
    localStorage.setItem("dropOffTime", dropOffTime);
  const pickUpDate = new Date(pickUpTime);
  const dropOffDate = new Date(dropOffTime);
  const diffInMs = dropOffDate - pickUpDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  const days = Math.ceil(diffInDays);

  const { carId } = useParams();
  const [images, setImages] = useState([]);
  const [value, setValue] = useState(0); // default value is 0
  const dispatch = useDispatch();

  //function get data from wallet and car detail
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        //get car detail
        const data = await dispatch(
          getCarDetail({
            carId: carId,
            pickUpTime: pickUpTime,
            dropOffTime: dropOffTime,
          })
        ).unwrap();
        const dataWallet = await dispatch(getWallet()).unwrap();
        if (!data?.data) return;

        const front = data?.data?.carImageFront;
        const back = data?.data?.carImageBack;
        const left = data?.data?.carImageLeft;
        const right = data?.data?.carImageRight;

        setImages([front, back, left, right].filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      }
      document.title = "Booking Details";
    };

    fetchCarData();
  }, [dispatch]);

  return (
    <>
      <Header />
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>

        <Typography color="text.primary">Booking details</Typography>
      </Breadcrumbs>
      <RentStepper />
      <Box sx={{ mx: "auto", maxWidth: "1200px", p: 4 }}>
        <Box
          display={"flex"}
          gap={4}
          sx={{
            flexDirection: { xs: "column", md: "row" }, // Responsive: Column on mobile, Row on desktop
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: "300px",
              border:
                images.length === 0 && status !== "loading"
                  ? "2px solid #ccc"
                  : "none",
              borderRadius: "8px",
              height: "auto",
              pl: 2,
              pr: 2,
            }}
          >
            {status === "loading" || images.length === 0 ? (
              <Skeleton variant="rectangular" width={400} height={300} />
            ) : error ? (
              <Typography variant="body1" color="error">
                Failed to load images.
              </Typography>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                autoplay={{ delay: 3000 }}
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
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
            <Typography
              variant="h6"
              style={{ marginTop: "30px" }}
              fontWeight="bold"
            >
              {carData?.data?.brand ? (
                `${carData.data.brand} ${carData.data.model}`
              ) : (
                <Skeleton variant="text" width={200} height={40} />
              )}
            </Typography>

            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Ratings:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Rating
                        name="star-rating"
                        value={value}
                        onChange={(event, newValue) => setValue(newValue)}
                        precision={0.5} // Cho phép chọn 0.5 sao
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        No. of rides:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">0</Typography>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Price:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {carData?.data ? (
                        <Typography variant="body1" color="red">
                          {new Intl.NumberFormat("en-US").format(
                            carData.data.basePrice
                          )}
                          k<span style={{ color: "black" }}> /day</span>
                        </Typography>
                      ) : (
                        <Skeleton variant="text" width={50} />
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Locations:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {carData?.data?.address ? (
                        <Typography>{carData.data.address}</Typography>
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        Status:
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {carData?.data?.status ? (
                        <Typography sx={{ color: "green" }}>
                          {carData.data.status}
                        </Typography>
                      ) : (
                        <Skeleton variant="text" width={100} />
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box
            sx={{
              width: "2px",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              minHeight: "100%", // Đảm bảo nó kéo dài hết chiều cao của cha
              display: { xs: "none", md: "block" },
            }}
          />

          <Box sx={{ flex: 1, pl: 2, pr: 2, minWidth: "300px" }}>
            <Typography
              variant="h6"
              sx={{
                position: "sticky",
                top: "150px",
                zIndex: 1000,
                fontWeight: "bold",
              }}
            >
              Booking Summary
            </Typography>
            <Box
              sx={{
                my: 2,
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: 1,
                p: 2,
                position: "sticky",
                top: "200px",
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Number of days:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                  style={{ color: "#05ce80" }}
                >
                  {days}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Price per day:
                </Typography>

                <Typography sx={{ flex: "1", fontWeight: "bold" }}>
                  <span style={{ color: "red" }}>
                    {new Intl.NumberFormat("en-US").format(
                      carData?.data?.basePrice
                    )}{" "}
                    VND
                  </span>
                </Typography>
              </Box>
            </Box>
            <Divider
              sx={{
                my: 2,
                position: "sticky",
                top: "300px",
                zIndex: 1000,
              }}
            />
            <Box
              sx={{
                backgroundColor: "white",
                border: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: 1,
                p: 2,
                position: "sticky",
                top: "320px",
                zIndex: 1000,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  <span style={{ color: "red" }}>
                    {new Intl.NumberFormat("en-US").format(
                      carData?.data?.basePrice * days
                    )}{" "}
                    VND
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Deposit:
                </Typography>

                <Typography sx={{ flex: "1", fontWeight: "bold" }}>
                  <span style={{ color: "red" }}>
                    {new Intl.NumberFormat("en-US").format(
                      carData?.data?.deposit
                    )}{" "}
                    VND
                  </span>
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Pick up Time:
                </Typography>

                <Typography sx={{ flex: "1", fontWeight: "bold" }}>
                  {dayjs.utc(pickUpTime).format("DD/MM/YYYY HH:mm A")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ flex: "1" }}
                >
                  Drop-off Time:
                </Typography>

                <Typography sx={{ flex: "1", fontWeight: "bold" }}>
                  {dayjs.utc(dropOffTime).format("DD/MM/YYYY HH:mm A")}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );
};
