import React, { useEffect } from 'react'
import Layout from '../components/common/Layout'
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchCar from '../components/SearchCar/SearchCar';


const HomePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t");
  const nav = useNavigate()
  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        return;
      }
      try {
        const res = await axios.get(`http://localhost:8080/karental/user/verify-email?t=${token}`);
        alert(res.message); // Show success message from backend
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
  
  return (
    <Layout>
      <SearchCar/>
    </Layout>
  )
}

export default HomePage