import React, { useEffect, useState } from 'react'
import Layout from '../components/common/Layout'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchCar from '../components/SearchCar/SearchCar';
import HomePageCarOwner from './HomePageCarOwner';
import HomePageGuest from './HomePageGuest';
import HomePageCustomer from './HomePageCustomer';
import ViewListAllCar from "./ViewListAllCar";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const roleParam = searchParams.get("role");

  const storedRole = localStorage.getItem("role");
  let roleToUse = storedRole || roleParam || "GUEST";
  // State handle open modal login
  const [openLogin, setOpenLogin] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const nav = useNavigate()
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await axios.get(
          `${BASE_URL}/user/verify-email?t=${token}`
        );
        console.log(res);
        alert(res.data.message); // Show success message from backend
        setTimeout(() => {
          nav("/", { replace: true });
        }, 1000);
      } catch (error) {
        alert("Verification failed. Your link may have expired.");
        setTimeout(() => {
          nav("/", { replace: true });
        }, 1000);
      }
    };
    verifyEmail();
  }, [token]);
  useEffect(() => {
    document.title = 'Home Page';
  }, []);
  return (
    <>
      {roleToUse !== "OPERATOR" && (
        <Layout>
          {roleToUse === "GUEST" && <HomePageGuest />}
          {roleToUse === "CAR_OWNER" && <HomePageCarOwner />}
          {roleToUse === "CUSTOMER" && <HomePageCustomer />}
        </Layout>
      )}
      {roleToUse === "OPERATOR" && <ViewListAllCar />}
    </>
  );

}

export default HomePage;
