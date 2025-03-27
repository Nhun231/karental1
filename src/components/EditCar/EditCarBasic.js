import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import DocumentEdit from "./DocumentEdit";
import { useDispatch, useSelector } from "react-redux";

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
        <Typography
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {value}
        </Typography>
      </Stack>
    </Stack>
  </Grid>
);

export const EditCarBasic = () => {
  const dispatch = useDispatch();
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
      <Grid container spacing={10} sx={{ p: 4 }}>
        {infoItems.map((item) => (
          <InfoItem key={item.title} {...item} />
        ))}
      </Grid>

      <Divider sx={{ p: 2 }} />

      <Grid container item xs={12} sx={{ p: 4 }}>
        <Grid item xs={8}>
          <Stack direction="column" alignItems="left">
            <Typography
              sx={{ color: "#767676", fontSize: "16px", fontWeight: "bold" }}
            >
              Vehicle Registration Documents
            </Typography>
            <Typography sx={{ fontSize: "24px", fontWeight: "bold" }}>
              <DocumentEdit />
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
