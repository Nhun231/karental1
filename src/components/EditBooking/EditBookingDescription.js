import * as React from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  Select,
  Skeleton,
  ListItem,
  ListItemIcon,
  List,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { getCarDetail } from "../../reducers/carFetchReducer";
import {
  getBookingDetail,
  setInfor,
  getWallet,
  cancelBooking,
  confirmPickup,
  returnCar,
} from "../../reducers/rentCarReducer";
import { useDispatch, useSelector } from "react-redux";
import TabEditBooking from "./TabEditBooking";
import Header from "../common/Header";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";
import Footer from "../common/Footer";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import EventIcon from "@mui/icons-material/Event";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import InfoIcon from "@mui/icons-material/Info";
import { useParams } from "react-router-dom";
import GiveRating from "../Feedback/GiveRating"
import ViewFeedback from "../Feedback/ViewFeedback"
import { getFeedbackByBookingId } from "../../services/FeedbackServices";
dayjs.extend(duration);

export default function EditBookingDescription() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // Get id from URL
  const { id } = useParams();
  // State handle open/close feedback modal
  const [open, setOpen] = useState(false);
  // State to track whether the user has submitted a feedback 
  const [hasReviewed, setHasReviewed] = useState(false);
  const [feedback, setFeedback] = useState(null);
  //get carId from session
  //   const carId = sessionStorage.getItem("selectedCarId");
  const {
    carData = {},
    status,
    error,
  } = useSelector((state) => state.carFetch);

  const { infor = {}, wallet = {} } = useSelector((state) => state.rentCar);

  const [images, setImages] = useState([]);

  const statusColors = {
    CONFIRMED: "green",
    IN_PROGRESS: "orange",
    PENDING_DEPOSIT: "red",
    COMPLETED: "blue",
    CANCELLED: "grey",
    "PENDING PAYMENT": "red",
    "WAITTING PAYMENT": "orange",
    WAITING_CONFIRMED: "orange",
  };

  //function get data car detail
  useEffect(() => {
    const fetchAndProcessCarData = async () => {
      try {
        const dataWallet = await dispatch(getWallet()).unwrap();
        const bookingData = await dispatch(getBookingDetail(id)).unwrap();
        if (!bookingData?.data) return;
        const data = await dispatch(
          getCarDetail({
            carId: bookingData.data.carId, // get carId from bookingData
            pickUpTime: "2025-03-30T06:00:00",
            dropOffTime: "2025-03-31T06:59:00",
          })
        ).unwrap();

        if (!data?.data) return;

        // pick image from IndexedDB if exist, else not pick from API
        const front = data?.data?.carImageFront;
        const back = data?.data?.carImageBack;
        const left = data?.data?.carImageLeft;
        const right = data?.data?.carImageRight;

        // update list image display
        setImages([front, back, left, right].filter(Boolean));

        const pickUp = dayjs(bookingData?.data?.pickUpTime);
        const dropOff = dayjs(bookingData?.data?.dropOffTime);

        const minutes = dropOff.diff(pickUp, "minute"); // coutn the munite between
        const days = Math.ceil(minutes / (24 * 60)); // convert minute to day
        dispatch(setInfor({ ...infor, days }));
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchAndProcessCarData();
  }, [dispatch]);

  // Get feedback status
  useEffect(() => {
    const getFeedbackStatus = async () => {
      try {
        const result = await getFeedbackByBookingId(id);
        setHasReviewed(result.data !== null);
        setFeedback(result.data)
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    getFeedbackStatus();
  }, [id, hasReviewed]);

  // If feedback has sent, disable modal
  const handleGivefeedback = (data) => {
    console.log("Review Submitted:", data);
    setHasReviewed(true);
  };
  return (
    <>
      <Header></Header>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>

      <Box sx={{ mx: "auto", maxWidth: "1200px", mt: 3, p: 2 }}>
        {/* Title */}
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
        >
          Booking Details
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 4,
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {/* Image Section */}
          <Box
            sx={{
              marginTop: "4px",
              width: "600px",
              height: "448px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 4,
              border:
                images.length === 0 && status !== "loading"
                  ? "2px dashed gray"
                  : "none",
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
                        height: "453px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>

          {/* Booking Details */}
          <Card sx={{ maxWidth: 800, boxShadow: 5, width: "450px" }}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                {carData?.data?.brand ? (
                  `${carData.data.brand} ${carData.data.model}`
                ) : (
                  <Skeleton variant="text" width={200} height={40} />
                )}
              </Typography>

              <List>
                <ListItem>
                  <ListItemIcon>
                    <TodayIcon sx={{ color: "#05CE80" }} />
                  </ListItemIcon>
                  <Typography variant="body1">
                    From:{" "}
                    {dayjs(infor?.data?.pickUpTime).format(
                      "DD/MM/YYYY - hh:mm A"
                    )}
                  </Typography>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EventIcon sx={{ color: "#05CE80" }} />
                  </ListItemIcon>
                  <Typography variant="body1">
                    To:{" "}
                    {dayjs(infor?.data?.dropOffTime).format(
                      "DD/MM/YYYY - hh:mm A"
                    )}
                  </Typography>
                </ListItem>
              </List>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CalendarMonthIcon sx={{ mr: 1, color: "#05CE80" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: 1 }}
                >
                  Number of days:
                </Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  {infor?.days}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <MonetizationOnIcon sx={{ color: "#05CE80", mr: 1 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: 1 }}
                >
                  Base price:
                </Typography>
                <Typography variant="body2" sx={{ flex: 2, color: "red" }}>
                  {infor?.data?.basePrice ? (
                    `${new Intl.NumberFormat("en-US").format(
                      infor.data.basePrice
                    )}K`
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                  /day
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <AttachMoneyIcon sx={{ mr: 1, color: "#05CE80" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: 1 }}
                >
                  Total:
                </Typography>
                <Typography variant="body2" sx={{ flex: 2, color: "red" }}>
                  {infor?.data?.totalPrice ? (
                    `${new Intl.NumberFormat("en-US").format(
                      infor.data.totalPrice
                    )}K`
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <ReceiptLongIcon sx={{ mr: 1, color: "#05CE80" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: 1 }}
                >
                  Deposit:
                </Typography>
                <Typography variant="body2" sx={{ flex: 2, color: "red" }}>
                  {infor?.data?.deposit ? (
                    `${new Intl.NumberFormat("en-US").format(
                      infor.data.deposit
                    )}K`
                  ) : (
                    <Skeleton variant="text" width={50} />
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <ConfirmationNumberIcon sx={{ mr: 1, color: "#05CE80" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: 1 }}
                >
                  Booking No.:
                </Typography>
                <Typography variant="body2" sx={{ flex: 2 }}>
                  {infor?.data?.bookingNumber}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <InfoIcon sx={{ mr: 1, color: "#05CE80" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", flex: "1" }}
                >
                  Booking status:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: "2",
                    color: statusColors[infor?.data?.status] || "black",
                  }}
                >
                  {infor?.data?.status?.replace("_", " ").toUpperCase()}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  id="detailButton"
                  color="info"
                  sx={{
                    fontWeight: "bold",
                    flex: "0.25",
                    minWidth: "100px",
                    fontSize: "12px",
                  }}
                >
                  Details
                </Button>
                {infor?.data?.status === "IN_PROGRESS" && (
                  <Button
                    variant="contained"
                    id="cancelButton"
                    color="info"
                    disabled={loading}
                    sx={{
                      fontWeight: "bold",
                      flex: "0.25",
                      minWidth: "100px",
                      fontSize: "12px",
                    }}
                    onClick={(e) => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "Do you really want to return this car?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setLoading(true);
                          dispatch(returnCar()).finally(() => {
                            setLoading(false);
                          });
                        }
                      });
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Return Car"
                    )}
                  </Button>
                )}
                <Button
                  variant="contained"
                  id="pickupButton"
                  color="inherit"
                  disabled={loading}
                  sx={{
                    fontWeight: "bold",
                    flex: "0.25",
                    minWidth: "100px",
                    fontSize: "12px",
                  }}
                  onClick={(e) => {
                    if (wallet?.data?.balance < infor?.data?.totalPrice) {
                      Swal.fire({
                        title: "Return car?",
                        text: "Please confirm to return the car. The remaining amount of 1,500,000 VND will be deducted from your wallet.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setLoading(true);
                          dispatch(confirmPickup()).finally(() => {
                            setLoading(false);
                          });
                        }
                      });
                    } else {
                      Swal.fire({
                        title: "Return car?",
                        text: "Please confirm to return the car. The exceeding amount of 1,500,000 VND will be return to your wallet.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          setLoading(true);
                          dispatch(confirmPickup()).finally(() => {
                            setLoading(false);
                          });
                        }
                      });
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Pick-up"
                  )}
                </Button>
                {infor?.data?.status !== "PENDING_PAYMENT" &&
                  infor?.data?.status !== "CANCELLED" &&
                  infor?.data?.status !== "COMPLETED" &&
                  infor?.data?.status !== "IN_PROGRESS" && (
                    <Button
                      variant="contained"
                      id="cancelButton"
                      color="error"
                      disabled={loading}
                      sx={{
                        fontWeight: "bold",
                        flex: "0.25",
                        minWidth: "100px",
                        fontSize: "12px",
                      }}
                      onClick={(e) => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Do you really want to cancel this booking?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "No",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            setLoading(true);
                            dispatch(cancelBooking()).finally(() => {
                              setLoading(false);
                            });
                          }
                        });
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Cancel"
                      )}
                    </Button>
                  )}
                {/* User can feedback after booking completed */}
                {infor?.data?.status === "COMPLETED" && <div>
                  {hasReviewed && <>
                    <Button
                      variant="contained"
                      id="feedback-button"
                      sx={{
                        backgroundColor: "#555",
                        color: "white",
                        "&:hover": { backgroundColor: "#444" },
                        fontWeight: "bold",
                        flex: "0.25",
                        minWidth: "100px",
                        fontSize: "12px",
                      }}
                      onClick={() => setOpen(true)}
                    >
                      View Feedback
                    </Button>
                    <ViewFeedback feedback={feedback} open={open}
                      onClose={() => setOpen(false)}></ViewFeedback>
                  </>}
                  {!hasReviewed && <><Button
                    variant="contained"
                    id="feedback-button"
                    sx={{
                      backgroundColor: "#555",
                      color: "white",
                      "&:hover": { backgroundColor: "#444" },
                      fontWeight: "bold",
                      flex: "0.25",
                      minWidth: "100px",
                      fontSize: "12px",
                    }}
                    onClick={() => setOpen(true)}
                    disabled={hasReviewed}  // User can feedback only one time, after send feedback, button will be disable
                  >
                    Feedback
                  </Button>
                    <GiveRating
                      open={open}
                      onClose={() => setOpen(false)}
                      onSubmit={handleGivefeedback}
                      bookingDate={infor?.data?.dropOffTime}
                      hasReviewed={hasReviewed}
                      bookingId={id}
                    /></>}
                </div>}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Edit Booking Section */}
        <TabEditBooking />
      </Box>
      <Footer />
    </>
  );
}
