import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // API gọi đến backend
import { toast } from "react-toastify";
import { getFileFromDB } from "../Helper/indexedDBHelper";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const fetchInforProfile = createAsyncThunk(
  "rentCar/fetchInforProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/edit-profile`, {
        withCredentials: true, // Để gửi cookie nếu cần
      });

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      return response.data;
    } catch (error) {
      toast.error(`Fetch Profile Failed!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error."
      );
    }
  }
);

export const getWallet = createAsyncThunk(
  "rentCar/getWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/booking/get-wallet`, {
        withCredentials: true, // Để gửi cookie nếu cần
      });

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      return response.data;
    } catch (error) {
      toast.error(`Fetch Wallet Failed!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error."
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "rentCar/createBooking",
  async (carId, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      const state = getState();

      if (state.rentCar.infor.driver === false) {
        const renter = state.rentCar.infor.data;
        Object.entries(renter).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("driver", false);
      } else {
        const renter = state.rentCar.infor.renter;
        const file = await getFileFromDB("driverDrivingLicense");
        formData.append("driverDrivingLicense", file);
        Object.entries(renter).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("driver", true);
      }

      formData.append(
        "pickUpLocation",
        state.rentCar.infor.data.driverCityProvince +
          ", " +
          state.rentCar.infor.data.driverDistrict +
          ", " +
          state.rentCar.infor.data.driverWard +
          ", " +
          state.rentCar.infor.data.driverHouseNumberStreet
      );

      formData.append("pickUpTime", state.rental.pickUpTime.replace("Z", ""));
      formData.append("dropOffTime", state.rental.dropOffTime.replace("Z", ""));
      formData.append("paymentType", state.rentCar.infor.paymentType);

      formData.append("carId", carId);
      const response = await axios.post(
        `${BASE_URL}/booking/customer/create-book`,
        formData,
        {
          withCredentials: true, // Để gửi cookie nếu cần
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      toast.success(`Create Booking Successful!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Network error."
      );
    }
  }
);

export const getBookingDetail = createAsyncThunk(
  "rentCar/getBookingDetail",
  async (bookedId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/customer/${bookedId}`,
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      return response.data;
    } catch (error) {
      toast.error(`Fetch Car Failed!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const saveBooking = createAsyncThunk(
  "rentCar/saveBooking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      const state = getState();
      const renter = state.rentCar.infor.data;

      if (renter.driver === true) {
        const file = await getFileFromDB("driverDrivingLicense");
        if (file) {
          formData.append("driverDrivingLicense", file);
        }
      }

      Object.entries(renter).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.put(
        `${BASE_URL}/booking/customer/edit-book/${renter.bookingNumber}`,
        formData,
        {
          withCredentials: true, // Để gửi cookie nếu cần
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.data) {
        return rejectWithValue("No data received.");
      }

      toast.success(`Save Booking Successful!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Save Booking Failed! Cannot save now!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "rentCar/cancelBooking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const bookingNumber = state.rentCar.infor.data.bookingNumber; // Lấy bookingNumber từ Redux store

      if (!bookingNumber) {
        throw new Error("Booking number is missing.");
      }

      const response = await axios.put(
        `${BASE_URL}/booking/customer/cancel-booking/${bookingNumber}`,
        {},
        { withCredentials: true }
      );
      toast.success(`Canceled Booking successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data || "Cancel booking failed.";
      toast.error(`Failed to cancel booking. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(errorMessage);
    }
  }
);

export const confirmPickup = createAsyncThunk(
  "rentCar/confirmPickup",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const bookingNumber = state.rentCar.infor.data.bookingNumber; // Lấy bookingNumber từ Redux store

      if (!bookingNumber) {
        throw new Error("Booking number is missing.");
      }

      const response = await axios.put(
        `${BASE_URL}/booking/customer/confirm-pick-up/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Confirm pickup successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to confirm pickup. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const returnCar = createAsyncThunk(
  "rentCar/returnCar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const bookingNumber = state.rentCar.infor.data.bookingNumber; // Lấy bookingNumber từ Redux store

      if (!bookingNumber) {
        throw new Error("Booking number is missing.");
      }

      const response = await axios.put(
        `${BASE_URL}/booking/customer/return-car/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Return car successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to return car. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const confirmEarlyReturn = createAsyncThunk(
  "rentCar/confirmEarlyReturn",
  async (bookingNumber, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/car-owner/confirm-early-return/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Return car successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to return car. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const rejectEarlyReturn = createAsyncThunk(
  "rentCar/rejectEarlyReturn",
  async (bookingNumber, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/car-owner/reject-early-return/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Reject return car early successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to reject return car early. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const rejectRentCar = createAsyncThunk(
  "rentCar/rejectRentCar",
  async (bookingNumber, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/car-owner/reject-booking/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Reject return car successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to reject return car. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const payDepositAgain = createAsyncThunk(
  "rentCar/payDepositAgain",
  async (bookingNumber, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/customer/pay-deposit-again/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Pay deposit car successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to pay deposit car. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const payTotalFee = createAsyncThunk(
  "rentCar/payTotalFee",
  async (bookingNumber, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/customer/pay-total-payment-again/${bookingNumber}`,
        {},
        {
          withCredentials: true, // Để gửi cookie nếu cần
        }
      );

      toast.success(`Pay total fee car successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return response.data;
    } catch (error) {
      toast.error(`Failed to pay total fee car. Please try again!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          fontWeight: "bold",
          marginTop: "100px",
          border: "2px solid #05ce80",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#e6f9f2",
          color: "#0a6847",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 16px",
          fontSize: "16px",
        },
      });

      return rejectWithValue(
        error.response?.data || error.message || "Network error"
      );
    }
  }
);

export const rentCarSlice = createSlice({
  name: "rentCar",
  initialState: {
    infor: {
      renter: {},
    },
    statusBooking: "idle",
    errorsBooking: {},
  },
  reducers: {
    setInfor: (state, action) => {
      state.infor = {
        ...state.infor,
        ...action.payload,
      };
    },
    setErrorsBooking: (state, action) => {
      state.errorsBooking = {
        ...state.errorsBooking,
        ...action.payload,
      };
    },
    setStepBooking: (state, action) => {
      state.step = action.payload;
    },

    handleNext: (state) => {
      const currentYear = new Date().getFullYear();
      const dobYear = new Date(state.infor.renter.driverDob).getFullYear();

      let newErrors = {};
      if (state.infor.driver) {
        if (!state.infor.renter.driverFullName) {
          newErrors.fullName = "Full name is required.";
        }
        if (!state.infor.renter.driverDob) {
          newErrors.dob = "Date of birth is required.";
        } else if (currentYear - dobYear < 18) {
          newErrors.dob = "You must be at least 18 years old.";
        }
        if (
          !state.infor.renter.driverPhoneNumber ||
          !/^\d{10}$/.test(state.infor.renter.driverPhoneNumber)
        ) {
          newErrors.phoneNumber = "Phone number is required.";
        }
        if (
          !state.infor.renter.driverNationalId ||
          !/^\d{9,12}$/.test(state.infor.renter.driverNationalId)
        ) {
          newErrors.nationalId = "National ID is required.";
        }
        if (!state.infor.renter.drivingLicenseName) {
          newErrors.drivingLicenseUrl = "Driving license is required.";
        }
        if (!state.infor.renter.driverCityProvince) {
          newErrors.addressCityProvince = "City/Province is required.";
        }
        if (!state.infor.renter.driverDistrict) {
          newErrors.addressDistrict = "District is required.";
        }
        if (!state.infor.renter.driverWard) {
          newErrors.addressWard = "Ward is required.";
        }
        if (!state.infor.renter.driverHouseNumberStreet) {
          newErrors.addressHouseNumberStreet = "House number is required.";
        }
        if (!state.infor.renter.driverEmail) {
          newErrors.email = "Email is required.";
        }
        if (
          state.infor.renter.driverEmail &&
          !/^\S+@\S+\.\S+$/.test(state.infor.renter.driverEmail)
        ) {
          newErrors.email = "Invalid email format.";
        }
      }

      state.errorsBooking = newErrors;

      if (Object.keys(newErrors).length > 0) {
        toast.error(`Please fulfill all the fields!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            fontWeight: "bold",
            border: "2px solid #05ce80",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#e6f9f2",
            color: "#0a6847",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            fontSize: "16px",
          },
        });
        return;
      } else {
        toast.success(`Add Renter information Successful!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            fontWeight: "bold",
            border: "2px solid #05ce80",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#e6f9f2",
            color: "#0a6847",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 16px",
            fontSize: "16px",
          },
        });
      }
    },

    handleSaveBooking: (state) => {
      const currentYear = new Date().getFullYear();
      const dobYear = new Date(state.infor.data.driverDob).getFullYear();

      let newErrors = {};
      if (state.infor.data.driver) {
        if (!state.infor.data.driverFullName) {
          newErrors.fullName = "Full name is required.";
        }
        if (!state.infor.data.driverDob) {
          newErrors.dob = "Date of birth is required.";
        } else if (currentYear - dobYear < 18) {
          newErrors.dob = "You must be at least 18 years old.";
        }
        if (
          !state.infor.data.driverPhoneNumber ||
          !/^\d{10}$/.test(state.infor.data.driverPhoneNumber)
        ) {
          newErrors.phoneNumber = "Phone number is required.";
        }
        if (
          !state.infor.data.driverNationalId ||
          !/^\d{9,12}$/.test(state.infor.data.driverNationalId)
        ) {
          newErrors.nationalId = "National ID is required.";
        }
        if (!state.infor.data.driverDrivingLicenseUrl) {
          newErrors.drivingLicenseUrl = "Driving license is required.";
        }
        if (!state.infor.data.driverCityProvince) {
          newErrors.addressCityProvince = "City/Province is required.";
        }
        if (!state.infor.data.driverDistrict) {
          newErrors.addressDistrict = "District is required.";
        }
        if (!state.infor.data.driverWard) {
          newErrors.addressWard = "Ward is required.";
        }
        if (!state.infor.data.driverHouseNumberStreet) {
          newErrors.addressHouseNumberStreet = "House number is required.";
        }
        if (!state.infor.data.driverEmail) {
          newErrors.email = "Email is required.";
        }
      }

      state.errorsBooking = newErrors;

      if (Object.keys(newErrors).length > 0) {
        toast.error("⚠️ Please fulfill all the fields!");
        return;
      }
      // else {
      //   toast.success("🚗 Add Renter information Successful! 🎉", {
      //     position: "top-right",
      //   });
      // }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchInforProfile.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(fetchInforProfile.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";

      state.infor = {
        ...action.payload,
        driver: false,

        renter: {
          driverFullName: "",
          driverDob: "",
          driverPhoneNumber: "",
          driverNationalId: "",
          drivingLicenseUrl: "",
          driverCityProvince: "",
          drivingLicenseName: "",
          driverDistrict: "",
          driverWard: "",
          driverHouseNumberStreet: "",
          driverEmail: "",
        },

        paymentType: "",
        addressCityProvince: "",
        addressDistrict: "",
        addressWard: "",
        addressHouseNumberStreet: "",
      };
    });
    builder.addCase(fetchInforProfile.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });

    builder.addCase(getWallet.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(getWallet.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.wallet = action.payload;
    });
    builder.addCase(getWallet.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(createBooking.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.wallet = action.payload;
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(getBookingDetail.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(getBookingDetail.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(getBookingDetail.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(saveBooking.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(saveBooking.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(saveBooking.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(cancelBooking.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(cancelBooking.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(cancelBooking.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(confirmPickup.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(confirmPickup.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(confirmPickup.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(returnCar.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(returnCar.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(returnCar.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(confirmEarlyReturn.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(confirmEarlyReturn.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(confirmEarlyReturn.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(rejectEarlyReturn.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(rejectEarlyReturn.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(rejectEarlyReturn.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(rejectRentCar.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(rejectRentCar.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(rejectRentCar.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(payDepositAgain.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(payDepositAgain.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(payDepositAgain.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(payTotalFee.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(payTotalFee.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(payTotalFee.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
  },
});

export const {
  setInfor,
  setErrorsBooking,
  setStepBooking,
  handleNext,
  handleSaveBooking,
} = rentCarSlice.actions;

export default rentCarSlice.reducer;
