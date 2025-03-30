import { Grid } from "@mui/material";
import { Box, Typography, Stack, Divider, Button } from "@mui/material";
import DocumentEdit from "./DocumentEdit";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  updateCar,
  checkErrors,
  fetchCarById,
} from "../../reducers/carFetchReducer";
import { store } from "../../redux/store";
import { useParams } from "react-router-dom";

const InfoItem = ({ icon, title, value }) => (
  <Grid item xs={4}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <img width="80" height="80" src={icon} alt={title} />
      <Stack direction="column" alignItems="center">
        <Typography
          sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}
        >
          {title}
        </Typography>

        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {value}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);

export const EditCarBasic = () => {
  const dispatch = useDispatch();
  const { carId } = useParams();
  const [loading, setLoading] = useState(false);
  const { carData = {} } = useSelector((state) => state.carFetch);

  const infoItems = [
    {
      title: "License Plate",
      icon: "https://img.icons8.com/?size=100&id=32294&format=png&color=40C057",
      value: carData?.data?.licensePlate || "",
    },
    {
      title: "Color",
      icon: "https://img.icons8.com/?size=100&id=25945&format=png&color=40C057",
      value: carData?.data?.color || "",
    },
    {
      title: "Brand Name",
      icon: "https://img.icons8.com/?size=100&id=EfPWEq9XYdxP&format=png&color=40C057",
      value: carData?.data?.brand || "",
    },
    {
      title: "Model",
      icon: "https://img.icons8.com/?size=100&id=32722&format=png&color=40C057",
      value: carData?.data?.model || "",
    },
    {
      title: "Production Year",
      icon: "https://img.icons8.com/?size=100&id=Ck0t2l1fp3Wa&format=png&color=40C057",
      value: carData?.data?.productionYear || "",
    },
    {
      title: "No. of Seats",
      icon: "https://img.icons8.com/?size=100&id=yuvJ0WW58Rci&format=png&color=40C057",
      value: carData?.data?.numberOfSeats || "0",
    },
    {
      title: "Transmission",
      icon: "https://img.icons8.com/?size=100&id=N09LiGodnV7F&format=png&color=40C057",
      value:
        carData?.data?.automatic === true
          ? "Automatic"
          : carData?.data?.automatic === false
          ? "Manual"
          : "",
    },
    {
      title: "Fuel",
      icon: "https://img.icons8.com/?size=100&id=24723&format=png&color=40C057",
      value:
        carData?.data?.gasoline === true
          ? "Gasoline"
          : carData?.data?.gasoline === false
          ? "Diesel"
          : "",
    },
  ];

  return (
    <Box>
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
        <Grid container spacing={10} sx={{ p: 4 }}>
          {infoItems.map((item) => (
            <InfoItem key={item.title} {...item} />
          ))}
        </Grid>

        <Divider sx={{ p: 2 }} />

        {/* Sửa lỗi `container item xs={12}` */}
        <Grid container sx={{ p: 4 }}>
          <Grid item xs={10}>
            <Stack direction="column" alignItems="flex-start">
              {" "}
              {/* Sửa "left" thành "flex-start" */}
              <Typography
                sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}
              >
                Vehicle Registration Documents
              </Typography>
              <DocumentEdit />
            </Stack>
          </Grid>
        </Grid>

        {(carData?.data?.status === "NOT_VERIFIED" ||
          carData?.data?.status === "STOPPED") && (
          <Button
            variant="contained"
            id="nextButton"
            sx={{ marginLeft: "46%" }}
            style={{ backgroundColor: "#00bfa5" }}
            onClick={async () => {
              dispatch(checkErrors());
              setTimeout(async () => {
                if (
                  Object.keys(store.getState().carFetch.errors).length === 0
                ) {
                  setLoading(true); // turn loading on

                  try {
                    await dispatch(updateCar()).unwrap(); // wait for the updateCar action to complete
                    await dispatch(fetchCarById(carId)).unwrap();
                  } finally {
                    setLoading(false); // turn loading off
                  }
                }
              }, 0);
            }}
          >
            {loading ? "Saving..." : "Save"}
            {/* change the button text */}
          </Button>
        )}
      </Box>
    </Box>
  );
};
