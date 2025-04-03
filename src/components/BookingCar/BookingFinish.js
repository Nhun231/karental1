import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import {
  Typography,
  Box,
  Grid,
  Button,
  CardContent,
  Card,
  Link,
  Breadcrumbs,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState, useEffect } from "react";

import RentStepper from "./RentStepper";
import { getCarDetail } from "../../reducers/carFetchReducer";
import { Alert, Stack } from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PhoneIcon from "@mui/icons-material/Phone";
import { setStepBooking } from "../../reducers/rentCarReducer";

export default function BookingFinish() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        const data = await dispatch(getCarDetail()).unwrap(); // use unwrap to get directly the data from the action creator else will return object
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      }
    };
    fetchCarData();
  }, []);

  return (
      <>
        <Header />
        <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>

          <Typography color="text.primary">Booking Finsh</Typography>
        </Breadcrumbs>
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

                                <Typography variant="body2" align="center">
                                    You have successfully booked{" "}
                                    <strong>
                                        {carData?.data?.brand} {carData?.data?.model}
                                    </strong>
                                </Typography>

                                <Divider sx={{ width: "100%" }} />

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CalendarMonthIcon color="action" />
                                    <Typography variant="body2" >
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
                                        variant="body2"
                                        // fontWeight="bold"
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
              onClick={() => {
                navigate("/my-bookings");
              }}
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
