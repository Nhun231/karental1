import * as React from "react";
import MyCars from "./pages/MyCars";
import HomePage from "./pages/HomePage";
import {HashRouter, Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom";
import AddCarBasic from "./components/AddCar/AddCarBasic";
import AddCarDetails from "./components/AddCar/AddCarDetails";
import AddCarPricing from "./components/AddCar/AddCarPricing";
import AddCarFinish from "./components/AddCar/AddCarFinish";
import "./App.css";
import {ToastContainer} from "react-toastify";
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
import {SearchResult} from "./pages/SearchResult";
import MyBooking from "./pages/MyBooking";
import MyRentals from "./pages/My_Rentals";
import RentalDetails from "./pages/RentalDetails";
import AuthProvider from "./components/common/AuthProvider";
import SetNewPassword from "./pages/SetNewPassword";
import {useEffect} from "react";
import NotFound from "./components/common/NotFound";

import {BookingList} from "./pages/BookingList";
import MyFeedback from "./pages/MyFeedback";
import ViewListAllCar from "./pages/ViewListAllCar";

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
                    <Route index element={<HomePage/>}/>
                    <Route path="/user/verify-email" element={<HomePage/>}/>
                    <Route path="/auth/forgot-password/verify" element={<SetNewPassword/>}/>
                    <Route path={"/not-found"} element={<NotFound/>}/>
                    <Route element={
                        <PrivateRouter allowedRoles={["OPERATOR"]}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/operator-car-list" element={<ViewListAllCar/>}/>
                        <Route path="/booking-list" element={<BookingList/>}/>
                    </Route>
                    <Route element={
                        <PrivateRouter allowedRoles={["CUSTOMER"]}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/car-detail/:id" element={<CarDetail/>}/>
                        <Route path="/search-result" element={<SearchResult/>}/>
                        <Route path="/my-bookings" element={<MyBooking/>}/>
                        <Route path="/booking-infor/:carId" element={<BookingInfor/>}/>
                        <Route path="/booking-pay/:carId" element={<BookingPayment/>}/>
                        <Route path="/booking-finish/:carId" element={<BookingFinish/>}/>
                        <Route path="/edit-booking/:bookedId" element={<EditBookingDescript/>}/>
                    </Route>
                    <Route element={
                        <PrivateRouter allowedRoles={["CAR_OWNER"]}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/my-rentals" element={<MyRentals/>}/>
                        <Route path="/rental-detail/:id" element={<RentalDetails/>}/>
                        <Route path="/add-car-basic" element={<AddCarBasic/>}/>
                        <Route path="/add-car-details" element={<AddCarDetails/>}/>
                        <Route path="/add-car-pricing" element={<AddCarPricing/>}/>
                        <Route path="/add-car-finish" element={<AddCarFinish/>}/>
                        <Route path="/edit-details/:carId" element={<EditDetails/>}/>
                    </Route>
                    <Route element={
                        <PrivateRouter allowedRoles={["CAR_OWNER", "OPERATOR", 'CUSTOMER']}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/user/profile" element={<UserProfilePage/>}/>
                    </Route>
                    <Route element={
                        <PrivateRouter allowedRoles={["CAR_OWNER", "OPERATOR"]}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/my-cars" element={<MyCars/>}/>
                    </Route>
                    <Route element={
                        <PrivateRouter allowedRoles={["CAR_OWNER", "CUSTOMER"]}>
                            <Outlet/>
                        </PrivateRouter>
                    }>
                        <Route path="/my-wallet" element={<MyWallet/>}/>
                        <Route path="/my-feedback" element={<MyFeedback/>}/>
                    </Route>
                    <Route path={"/*"} element={<NotFound/>}/>
                </Routes>

            </AuthProvider>
        </>
    );
}

export default App;