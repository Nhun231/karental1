
import * as React from "react";
import MyCars from "./pages/MyCars";
import HomePage from "./pages/HomePage";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AddCarBasic from "./components/AddCar/AddCarBasic";
import AddCarDetails from "./components/AddCar/AddCarDetails";
import AddCarPricing from "./components/AddCar/AddCarPricing";
import AddCarFinish from "./components/AddCar/AddCarFinish";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import EditDetails from "./components/EditCar/EditDetails";
import MyWallet from "./pages/MyWallet";
import BookingInfor from "./components/BookingCar/BookingInfor";
import BookingPayment from "./components/BookingCar/BookingPayment";
import BookingFinish from "./components/BookingCar/BookingFinish";
import EditBookingDescript from "./components/EditBooking/EditBookingDescription";
import UserProfilePage from "./pages/UserProfile";
import PrivateRouter from "./utils/PrivateRouter"
import CarDetail from "./pages/CarDetail";
import { SearchResult } from "./pages/SearchResult";
import MyBooking from "./pages/MyBooking";
import AuthProvider from './components/common/AuthProvider';
import SetNewPassword from './pages/SetNewPassword';
import { useEffect } from "react";
import NotFound from "./components/common/NotFound";


function App() {
    const RedirectToHash = () => {
        const location = useLocation();
      
        useEffect(() => {
          if (!location.hash) {  
            const newPath = `#${location.pathname}${location.search}`;  
            window.location.replace(newPath);  
          }
        }, [location]);
    
        return null;
    };
  return (
    <>
 
    <ToastContainer/>   
        <RedirectToHash/>
      <AuthProvider>
      <Routes>
        {/* Route cho trang login-register
        <Route path="/login-register" element={<Login_RegisterPage />} /> */}

        {/* Route cho trang my-cars, chỉ cho phép người dùng có role 'CAR_OWNER' */}
        <Route
          path="my-cars"
          element={<PrivateRouter element={<MyCars />} allowedRoles={['CAR_OWNER']} />}
        />

        {/* Route cho trang change-password */}
        <Route path="" element={<HomePage />} />

        {/* Route cho trang user-profile, chấp nhận cả role 'CAR_OWNER' và 'CUSTOMER' */}
        <Route
          path="user/profile"
          element={<PrivateRouter element={<UserProfilePage />} allowedRoles={['CAR_OWNER', 'CUSTOMER']} />}
        />
        <Route
          path="car-detail/:id"
          element={<PrivateRouter element={<CarDetail />} allowedRoles={['CUSTOMER']} />}
        />
        <Route
          path="search-result"
          element={<PrivateRouter element={<SearchResult />} allowedRoles={['CUSTOMER']} />}
        />
        <Route
          path="my-bookings"
          element={<PrivateRouter element={<MyBooking />} allowedRoles={['CUSTOMER']} />}
        />
        <Route path="my-wallet" element={<PrivateRouter element={<MyWallet />} allowedRoles={['CAR_OWNER', 'CUSTOMER']}/>} />
        <Route path="user/verify-email"  element={<HomePage />} />
        <Route path="auth/forgot-password/verify" element={<PrivateRouter element={<SetNewPassword />} />} />
          <Route
              path="add-car-basic"
              element={
                  <PrivateRouter
                      element={<AddCarBasic />}
                      allowedRoles={["CAR_OWNER"]}
                  />
              }
          />
          <Route
              path="add-car-details"
              element={
                  <PrivateRouter
                      element={<AddCarDetails />}
                      allowedRoles={["CAR_OWNER"]}
                  />
              }
          />
          <Route
              path="add-car-pricing"
              element={
                  <PrivateRouter
                      element={<AddCarPricing />}
                      allowedRoles={["CAR_OWNER"]}
                  />
              }
          />
          <Route
              path="add-car-finish"
              element={
                  <PrivateRouter
                      element={<AddCarFinish />}
                      allowedRoles={["CAR_OWNER"]}
                  />
              }
          />
          <Route
              path="edit-details"
              element={
                  <PrivateRouter
                      element={<EditDetails />}
                      allowedRoles={["CAR_OWNER"]}
                  />
              }
          />
          <Route
              path="booking-infor"
              element={
                  <PrivateRouter
                      element={<BookingInfor />}
                      allowedRoles={["CUSTOMER"]}
                  />
              }
          />
          <Route
              path="booking-pay"
              element={
                  <PrivateRouter
                      element={<BookingPayment />}
                      allowedRoles={["CUSTOMER"]}
                  />
              }
          />
          <Route
              path="booking-finish"
              element={
                  <PrivateRouter
                      element={<BookingFinish />}
                      allowedRoles={["CUSTOMER"]}
                  />
              }
          />
          <Route
              path="edit-booking"
              element={
                  <PrivateRouter
                      element={<EditBookingDescript />}
                      allowedRoles={["CUSTOMER"]}
                  />
              }
          />
          <Route path="not-found" element={<NotFound/>}></Route>
      </Routes>
      </AuthProvider>

    </>
  );
}

export default App;
