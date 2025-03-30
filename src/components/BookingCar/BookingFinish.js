import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { store } from "../../redux/store";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { BookingDescript } from "./BookingDescript";
import {
  Typography,
  Box,
  TextField,
  Grid,
  FormHelperText,
  Skeleton,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Button,
  FormControl,
  Autocomplete,
  RadioGroup,
  Radio,
  CardContent,
  Card,
  Divider,
  FormLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState, useEffect, useMemo } from "react";
import {
  fetchInforProfile,
  setStepBooking,
  setInfor,
  setErrorsBooking,
  handleNext,
} from "../../reducers/rentCarReducer";
import axios from "axios";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";
import RentStepper from "./RentStepper";
import { getCarDetail } from "../../reducers/carFetchReducer";
import { Alert, Stack } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PhoneIcon from "@mui/icons-material/Phone";

export default function BookingFinish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setValue] = useState("wallet");

  const { carData = {} } = useSelector((state) => state.carFetch);
  const { wallet = {} } = useSelector((state) => state.rentCar);

  const status = wallet?.data?.status;

  //variable to format date
  const pickUpTime = wallet?.data?.pickUpTime
    ? dayjs(wallet?.data?.pickUpTime).format("DD/MM/YYYY - hh:mm A")
    : "";

  //variable to format date
  const dropOffTime = wallet?.data?.dropOffTime
    ? dayjs(wallet?.data?.dropOffTime).format("DD/MM/YYYY - hh:mm A")
    : "";

  //function to get data from car detail
  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const data = await dispatch(getCarDetail()).unwrap();// use unwrap to get directly the data from the action creator else will return object
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      }
    };
    fetchCarData();
  }, []);

  return (
    <>
      <Header />
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>
      <RentStepper />
      <Box sx={{ mx: "auto", maxWidth: "1200px", p: 2 }}>
        <Grid container justifyContent="center" mt={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 3, textAlign: "center" }}>
              {status === "PENDING_DEPOSIT" ? (
                <Alert
                  severity="warning"
                  icon={<CalendarMonthIcon />}
                  sx={{ fontWeight: "bold", mb: 2 }}
                >
                  The system has recorded your booking. Please complete the
                  payment within <strong>1 hour</strong>.
                </Alert>
              ) : status === "WAITING_CONFIRMED" ? (
                <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3 }}>
                  <CardContent>
                    <Stack spacing={2} alignItems="center">
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        color="primary"
                      >
                         {"\u2705"} Booking Confirmed!
                      </Typography>

                      <Typography variant="body1" align="center">
                        You have successfully booked{" "}
                        <strong>
                          {carData?.data?.brand} {carData?.data?.model}
                        </strong>
                      </Typography>

                      <Divider sx={{ width: "100%" }} />

                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonthIcon color="action" />
                        <Typography variant="body2" color="text.secondary">
                          From <strong>{pickUpTime}</strong> to{" "}
                          <strong>{dropOffTime}</strong>
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <ConfirmationNumberIcon color="action" />
                        <Typography variant="h6" fontWeight="bold">
                          Booking Number: {wallet?.data?.bookingNumber}
                        </Typography>
                      </Stack>

                      <Divider sx={{ width: "100%" }} />

                      <Stack direction="row" spacing={1} alignItems="center">
                        <PhoneIcon color="action" />
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          textAlign="center"
                        >
                          Our operator will contact you with further guidance
                          about pickup.
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Alert severity="info" sx={{ fontWeight: "bold", mb: 2 }}>
                  Booking status is unknown. Please check again.
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box m={2} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          id="nextButton"
          onClick={() => navigate("/my-bookings")}
          sx={{ ml: 2, mb: 4 }}
          style={{ backgroundColor: "#00bfa5" }}
        >
          Next
        </Button>
      </Box>
      <Footer />
    </>
  );
}
