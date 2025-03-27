import { Grid } from "@mui/joy";
import { Box, Typography, Stack, Divider } from "@mui/material";
import Documents from "../common/Document";

const InfoItem = ({ icon, title, value }) => (

  <Grid item xs={4}>
    <Stack direction="row" alignItems="center" spacing={2} sx={{ display: "flex", justifyContent: "center" }}>
      <img width="80" height="80" src={icon} alt={title} />
      <Stack direction="column" alignItems="center" sx={{ width: "150px" }}>
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

export const BasicInformation = ({ CarData }) => {
  const infoItems = [
    {
      title: "License Plate",
      icon: "https://img.icons8.com/?size=100&id=32294&format=png&color=40C057",
      value: CarData.licensePlate || "",
    },
    {
      title: "Color",
      icon: "https://img.icons8.com/?size=100&id=25945&format=png&color=40C057",
      value: CarData.color || "",
    },
    {
      title: "Brand Name",
      icon: "https://img.icons8.com/?size=100&id=EfPWEq9XYdxP&format=png&color=40C057",
      value: CarData.brand || "",
    },
    {
      title: "Model",
      icon: "https://img.icons8.com/?size=100&id=32722&format=png&color=40C057",
      value: CarData.model || "",
    },
    {
      title: "Production Year",
      icon: "https://img.icons8.com/?size=100&id=Ck0t2l1fp3Wa&format=png&color=40C057",
      value: CarData.productionYear || "",
    },
    {
      title: "No. of Seats",
      icon: "https://img.icons8.com/?size=100&id=yuvJ0WW58Rci&format=png&color=40C057",
      value: CarData.numberOfSeats || "0",
    },
    {
      title: "Transmission",
      icon: "https://img.icons8.com/?size=100&id=N09LiGodnV7F&format=png&color=40C057",
      value:
        CarData.automatic === true
          ? "Automatic"
          : CarData.automatic === false
            ? "Manual"
            : "",
    },
    {
      title: "Fuel",
      icon: "https://img.icons8.com/?size=100&id=24723&format=png&color=40C057",
      value:
        CarData.gasoline === true
          ? "Gasoline"
          : CarData.gasoline === false
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
        <Grid item xs={12}>
          <Stack direction="column" alignItems="left">
            <Typography
              sx={{ color: "#767676", fontSize: "24px", fontWeight: "bold" }}
            >
              Vehicle Registration Documents
            </Typography>
            <Documents CarData={CarData} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
