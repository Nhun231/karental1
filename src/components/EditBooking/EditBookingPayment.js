import { Grid } from "@mui/joy";
import {
  Box,
  Typography,
  FormControlLabel,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
} from "@mui/material";
import { useSelector } from "react-redux";

export const EditBookingPayment = () => {
  //   const [loading, setLoading] = useState(false);

  const { wallet = {} } = useSelector((state) => state.rentCar);
  const { carData = {} } = useSelector((state) => state.carFetch);
  const { infor = {} } = useSelector((state) => state.rentCar);

  return (
    <Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px", pt: 2 }}>
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
            <RadioGroup sx={{ ml: 2 }} value={infor?.data?.paymentType || ""}>
              <FormControlLabel
                value="WALLET"
                id="wallet"
                control={<Radio disabled />}
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
                value="CASH"
                control={<Radio disabled />}
                label="Cash"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
              <FormControlLabel
                value="BANK_TRANSFER"
                control={<Radio disabled />}
                label="Bank transfer"
              />
              <Typography sx={{ pl: 4, fontSize: 14, color: "gray" }}>
                Our operator will contact you for further instruction
              </Typography>
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};
