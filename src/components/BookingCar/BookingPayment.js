import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../common/Footer";
import { BookingDescript } from "./BookingDescript";
import {
  Typography,
  Box,
  FormControlLabel,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { useState } from "react";
import { setInfor } from "../../reducers/rentCarReducer";
import { createBooking } from "../../reducers/rentCarReducer";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

export default function BookingPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { carId } = useParams();
  const [loading, setLoading] = useState(false);

  const { wallet = {} } = useSelector((state) => state.rentCar);
  const { carData = {} } = useSelector((state) => state.carFetch);
  const { infor = {} } = useSelector((state) => state.rentCar);
  return (
    <>
      <BookingDescript />
      <Box sx={{ mx: "auto", maxWidth: "1200px", p: 2 }}>
        <Box
          sx={{
            maxWidth: "1200px",
            margin: "auto",
            p: 3,
            mb: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: "white",
          }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Please select your payment method
          </Typography>
          <FormControl>
            <FormLabel>Payment method</FormLabel>
            <RadioGroup
              // value={value}
              onChange={(e) => {
                // setValue(e.target.value);
                dispatch(setInfor({ ...infor, paymentType: e.target.value }));
              }}
              sx={{ ml: 2 }}
            >
              <FormControlLabel
                value="WALLET"
                id="wallet"
                control={<Radio />}
                label="My wallet"
              />
              <Typography
                sx={{
                  pl: 4,
                  color:
                    wallet?.data?.balance >= carData?.data?.deposit
                      ? "green"
                      : "red",
                  fontWeight: "bold",
                }}
              >
                Current balance:{" "}
                {new Intl.NumberFormat("en-US").format(wallet?.data?.balance) ||
                  wallet?.data?.balance}{" "}
                VND
              </Typography>
              <FormControlLabel
                value="option2"
                control={<Radio />}
                label="Cash"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
              <FormControlLabel
                value="option3"
                control={<Radio />}
                label="Bank transfer"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <Box m={2} style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          id="nextButton"
          disabled={infor.paymentType === "" || loading === true}
          onClick={async () => {
            try {
              setLoading(true);
              const result = await dispatch(createBooking(carId)).unwrap();
              if (result) {
                navigate(`/booking-finish/${carId}`); // Chỉ chuyển hướng nếu gửi thành công
              }
            } catch (error) {
              toast.error(
                "Car booking failed! Someone has already booked this car",
                {
                  position: "top-right",
                }
              );
            }
          }}
          sx={{ ml: 2 }}
          style={{ backgroundColor: "#00bfa5" }}
        >
          {loading ? "Booking..." : "Confirm payment"}
        </Button>
      </Box>
      <Footer />
    </>
  );
}
