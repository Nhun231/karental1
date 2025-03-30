import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { EditCarBasic } from "./EditCarBasic";
import EditCarDetail from "./EditCarDetail";
import EditCarPricing from "./EditCarPricing";


const TabEditCar = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="Add Car Tabs"
        sx={{
          "& .MuiTabs-indicator": {
            display: "none", // 
          },
          "& .MuiTab-root": {
            border: "1px solid #ccc",
            borderRadius: "4px 4px 0 0",
            backgroundColor: "#f5f5f5",
            marginRight: "4px",
            "&.Mui-selected": {
              backgroundColor: "white",
              borderBottom: "none",
            },
          },
        }}
      >
        <Tab label="Basic Information" onClick={() => setSelectedTab(0)} />
        <Tab label="Details" onClick={() => setSelectedTab(1)} />
        <Tab label="Pricing" onClick={() => setSelectedTab(2)} />
      </Tabs>

      <div
        id="tab-basic"
        style={{ display: selectedTab === 0 ? "block" : "none" }}
      >
        <EditCarBasic />
      </div>
      <div
        id="tab-detail"
        style={{ display: selectedTab === 1 ? "block" : "none" }}
      >
        <EditCarDetail />
      </div>
      <div
        id="tab-pricing"
        style={{ display: selectedTab === 2 ? "block" : "none" }}
      >
        <EditCarPricing />
      </div>
    </Box>
  );
};

export default TabEditCar;
