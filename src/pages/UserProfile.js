import { useEffect, useState } from "react";
import { getUserProfile } from "../services/UserServices";
import PersonalInformation from "../components/User/PersonalInfomation";
import SecurityChangePassword from "../components/User/ChangePassword";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer"
import {
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";

export default function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0); // Quản lý tab được chọn

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await getUserProfile();
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    }
    getUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div>
      <Header></Header>
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2, my: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">My Profile</Typography>
      </Breadcrumbs>

      <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", mb: 5 }}>
        {/* Tabs */}
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="user profile tabs" >
          <Tab id="tab-user-info" label="User Info" />
          <Tab id="tab-change-password" label="Change Password" />
        </Tabs>

        {/* Tab Content*/}
        <Box
          sx={{
            display: selectedTab === 0 ? "block" : "none",
            border: "1px solid #ccc",
            padding: 2,
            textAlign: "left",
            borderRadius: 1,
            m: 0
          }}
        >
          <PersonalInformation initialData={userData} />
        </Box>

        <Box
          sx={{
            display: selectedTab === 1 ? "block" : "none",
            border: "1px solid #ccc",
            padding: 2,
            textAlign: "left",
            borderRadius: 1,
          }}
        >
          <SecurityChangePassword />
        </Box>
      </Box>
      <Footer></Footer>
    </div>
  );
}
