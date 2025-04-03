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
import { setInfor, setStepBooking } from "../../reducers/rentCarReducer";
import { createBooking } from "../../reducers/rentCarReducer";
import { useParams } from "react-router-dom";

export default function BookingPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { carId } = useParams();
  const [loading, setLoading] = useState(false);

  const { wallet = {} } = useSelector((state) => state.rentCar);
  const { carData = {} } = useSelector((state) => state.carFetch);
  const { infor = {}, step } = useSelector((state) => state.rentCar);
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
              <FormControlLabel value="CASH" control={<Radio />} label="Cash" />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
              <FormControlLabel
                value="BANK_TRANSFER"
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
          onClick={() => {
            dispatch(setStepBooking(1));
            dispatch(setInfor({ ...infor, paymentType: "" }));
            navigate(`/booking-infor/${carId}`);
          }}
          sx={{ ml: 2 }}
          style={{ backgroundColor: "#05ce80" }}
        >
          Back
        </Button>
        {step === 2 && (
          <Button
            variant="contained"
            id="nextButton"
          disabled={infor.paymentType === "" || loading === true}
          onClick={async () => {
              setLoading(true);
              const result = await dispatch(createBooking(carId)).unwrap();
              if (result) {
                dispatch(setStepBooking(1));
                navigate(`/booking-finish/${carId}`); // just navigate when success
            }
          }}
          sx={{ ml: 2 }}
          style={{ backgroundColor: "#00bfa5" }}
        >
          {loading ? "Booking..." : "Confirm payment"}
        </Button>
        )}
      </Box>

      <Footer />
    </>
  );
}
