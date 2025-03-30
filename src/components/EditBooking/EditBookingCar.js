import { Grid } from "@mui/joy";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Paper,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import DocumentBookingEdit from "./DocumentBookingEdit";
import { useSelector } from "react-redux";
import {
  Bluetooth,
  GpsFixed,
  CameraAlt,
  Lock,
  ChildCare,
  Dvr,
  Usb,
  WbSunny,
} from "@mui/icons-material";

export const EditBookingCar = () => {
  const { carData = {} } = useSelector((state) => state.carFetch);

  const additionalFunctions = [
    {
      label: "Bluetooth",
      icon: <Bluetooth />,
      checked: !!carData.additionalFunctions?.Bluetooth,
    },
    {
      label: "GPS",
      icon: <GpsFixed />,
      checked: !!carData.additionalFunctions?.GPS,
    },
    {
      label: "Camera",
      icon: <CameraAlt />,
      checked: !!carData.additionalFunctions?.Camera,
    },
    {
      label: "Sun roof",
      icon: <WbSunny />,
      checked: !!carData.additionalFunctions?.SunRoof,
    },
    {
      label: "Child lock",
      icon: <Lock />,
      checked: !!carData.additionalFunctions?.ChildLock,
    },
    {
      label: "Child seat",
      icon: <ChildCare />,
      checked: !!carData.additionalFunctions?.ChildSeat,
    },
    {
      label: "DVD",
      icon: <Dvr />,
      checked: !!carData.additionalFunctions?.DVD,
    },
    {
      label: "USB",
      icon: <Usb />,
      checked: !!carData.additionalFunctions?.USB,
    },
  ];

  const termsOfUse = [
    { label: "No smoking", checked: !!carData.termsOfUses?.noSmoking },
    { label: "No food in car", checked: !!carData.termsOfUses?.noFoodInCar },
    { label: "No pet", checked: !!carData.termsOfUses?.noPet },
  ];

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mt: 2,
          maxWidth: 1200,
          mx: "auto",
          boxShadow: 3,
          width: "1200px",
        }}
      >
        <Grid container spacing={2}>
          {/* License plate */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              License plate:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18} color="red">
              {carData?.data?.licensePlate}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Brand name */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Brand name:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.brand}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Production year */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Production year:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.productionYear}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Transmission */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Transmission:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.transmission === "true" ? "Automatic" : "Manual"}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Color */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Color:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.color}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Model */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Model:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.model}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* No. of seats */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              No. of seats:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.numberOfSeats}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Fuel */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Fuel:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.fuel === "true" ? "Gasoline" : "Diesel"}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Mileage */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Mileage:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.mileage}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Fuel consumption */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Fuel consumption:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.fuelConsumption}
            </Typography>
          </Grid>
          <Divider sx={{ width: "100%", my: 1 }} />

          {/* Address */}
          <Grid item xs={4}>
            <Typography fontWeight="bold" fontSize={18} sx={{ color: "gray" }}>
              Address:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography fontWeight={"bold"} fontSize={18}>
              {carData?.data?.address}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Vehicle Registration Documents */}
      <Grid
        container
        item
        xs={12}
        sx={{
          mt: 4,
          mb: 3,
          maxWidth: 1400,
          mx: "auto",
          boxShadow: 3,
          width: "1220px",
        }}
      >
        <Grid item xs={12}>
          <Stack direction="column" alignItems="left">
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Vehicle Registration Documents
            </Typography>

            <DocumentBookingEdit />
          </Stack>
        </Grid>
      </Grid>

      <div style={{ maxWidth: 1200, margin: "auto" }}>
        {/* Description */}
        <Typography fontWeight="bold">Description:</Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {carData?.data?.description}
        </Typography>

        {/* Additional Functions */}
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Additional functions:
        </Typography>
        <Grid container spacing={2}>
          {additionalFunctions.map((item, index) => (
            <Grid
              item
              xs={6}
              sm={4}
              key={index}
              display="flex"
              alignItems="center"
            >
              {item.icon}
              <FormControlLabel
                control={<Checkbox checked={item.checked} />}
                label={item.label}
                sx={{ ml: 1 }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Terms of Use */}
        <Typography fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
          Terms of use
        </Typography>
        <Grid container spacing={2}>
          {termsOfUse.map((item, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <FormControlLabel
                control={<Checkbox checked={item.checked} />}
                label={item.label}
              />
            </Grid>
          ))}
        </Grid>

        {/* Other term if exist*/}
        {carData?.other && (
          <>
            <Typography fontWeight="bold" sx={{ mt: 3, mb: 1 }}>
              Other terms:
            </Typography>
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              {carData?.other}
            </Typography>
          </>
        )}
      </div>
    </Box>
  );
};
