import React, { useState, useEffect } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    CssBaseline,
    IconButton,
    Container,
    Box,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar"; // Icon xe hơi
import LogoutIcon from '@mui/icons-material/Logout'; import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import ViewListAllCar from "./ViewListAllCar";
import UserMenu from "../components/User/UserMenu";
import { logoutUser } from "../services/UserServices";
import { useNavigate } from "react-router-dom";

const drawerWidth = 280;


export default function AdminLayout() {
    const [selectedTab, setSelectedTab] = useState("List Cars");
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    const renderContent = () => {
        switch (selectedTab) {
            case "List Cars":
                return <ViewListAllCar></ViewListAllCar>;
            case "Logout":
                handleLogout();
                return null;
            default:
                return <ViewListAllCar></ViewListAllCar>;
        }
    };
    useEffect(() => {
        document.title = 'DashBoard';
    }, []);
    return (
        <div style={{ display: "flex", minHeight: "100vh", }}>
            <CssBaseline />
            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: "white", boxShadow: 0.1, borderBottom: "1px solid #ddd" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Link to="/" style={{ textDecoration: "none", borderLeft: "1px" }}>
                            <img src={logo} alt="logo" style={{ maxWidth: "250px", height: "auto" }} />
                        </Link>
                        <IconButton onClick={() => setOpen(!open)} sx={{ color: "black", ml: 1.5 }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                    <UserMenu></UserMenu>
                </Toolbar>
            </AppBar>
            {/* Sidebar */}
            <Drawer
                variant="persistent"
                open={open}
                sx={{
                    position: "absolute",
                    backgroundColor: "#bbb !important",
                    width: open ? drawerWidth : 64,
                    flexShrink: 0,
                    transition: "width 0.3s",
                    [`& .MuiDrawer-paper`]: {
                        width: open ? drawerWidth : 64,
                        transition: "width 0.3s",
                        boxSizing: "border-box",
                        overflowX: "hidden",
                    },
                }}
            >
                <Toolbar />
                <List sx={{ mt: 3 }}>
                    {[
                        { text: "List Cars", icon: <DirectionsCarIcon sx={{ color: "#05ce80" }} /> },
                        { text: "Logout", icon: <LogoutIcon sx={{ color: "#05ce80" }} /> },
                    ].map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => setSelectedTab(item.text)}
                            sx={{
                                backgroundColor: selectedTab === item.text ? "#edfff8" : "transparent", // Highlight tab
                                "&:hover": { backgroundColor: "#d6f5ea" },
                                borderRight: selectedTab === item.text ? "4px solid #05ce80" : "none",
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {open && (
                                <ListItemText
                                    primary={
                                        <Typography
                                            sx={{
                                                fontWeight: "bold",
                                                color: selectedTab === item.text ? "#05ce80" : "#969393",
                                            }}
                                        >
                                            {item.text}
                                        </Typography>
                                    }
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Nội dung chính */}
            <main
                style={{
                    flexGrow: 1,
                    padding: "20px",
                    marginTop: "64px",
                    marginLeft: open ? drawerWidth : 1,
                    transition: "margin 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "calc(100vh - 64px)",
                }}
            >
                <Container disableGutters>{renderContent()}</Container>

            </main>
        </div>
    );
}
