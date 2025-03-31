import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // API gọi đến backend
import { toast } from "react-toastify";
import axios from "axios";
// Async Thunk to fetch data car

import { getFileFromDB, getAllKeysFromDB } from "../Helper/indexedDBHelper";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchCarById = createAsyncThunk(
  "cars/fetchCarById",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/car/car-owner/${carId}`, {
        withCredentials: true, // Để gửi cookie nếu cần
      });

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

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const carData = state.carFetch.carData.data; // pick data from Redux

      // create formData
      const formData = new FormData();

      // add data to formData
      Object.entries(carData).forEach(([key, value]) => {
        if (
          ![
            "carImageFront",
            "carImageBack",
            "carImageLeft",
            "carImageRight",
            "registrationPaper",
            "insurance",
            "certificateOfInspection",
          ].includes(key)
        ) {
          formData.append(key, value);
        }
      });

      // get list key from IndexedDB
      const existingKeys = await getAllKeysFromDB();

      // list key image
      const imageKeys = [
        "carImageFront",
        "carImageBack",
        "carImageLeft",
        "carImageRight",
        "registrationPaper",
        "insurance",
        "certificateOfInspection",
      ];

      // get image from IndexedDB
      for (const key of imageKeys) {
        if (existingKeys.includes(key)) {
          const file = await getFileFromDB(key);
          if (file) {
            formData.append(key, file);
          }
        }
      }

      // send request
      const response = await axios.put(
        `${BASE_URL}/car/car-owner/edit-car/${carData.id}`,
        formData,
        {
          withCredentials: true, // send cookie
          headers: {
            "Content-Type": "multipart/form-data", // set content type
          },
        }
      );

      toast.success(`Update Car Successful!`, {
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
      toast.error(`Update Car failed!`, {
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
        error.response?.data?.message ||
          error.message ||
          "Failed to update car data"
      );
    }
  }
);

export const getCarDetail = createAsyncThunk(
  "cars/getCarDetail",
  async ({ carId, pickUpTime, dropOffTime }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/car/customer/car-detail`, {
        params: { carId, pickUpTime, dropOffTime },
        withCredentials: true, // send cookie
      });

      return response.data;
    } catch (error) {
      toast.error(`Fetch car failed!`, {
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
        error.response?.data?.message || "Fetch car failed."
      );
    }
  }
);

export const getBookingListOperator = createAsyncThunk(
  "carFetch/getBookingListOperator",
  async ({ page, size, sort, status }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/booking/operator/all-bookings`,
        {
          params: { page, size, sort, status },
          withCredentials: true, // send cookie
        }
      );

      return response.data;
    } catch (error) {
      toast.error(`Fetch car failed!`, {
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
        error.response?.data?.message || "Fetch car failed."
      );
    }
  }
);

export const confirmDeposit = createAsyncThunk(
  "carFetch/confirmDeposit",
  async (bookingNumber, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/operator/confirm-deposit/${bookingNumber}`,
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

export const rejectDeposit = createAsyncThunk(
  "carFetch/rejectDeposit",
  async (bookingNumber, { getState, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/booking/operator/reject-deposit/${bookingNumber}`,
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

export const carFetchSlice = createSlice({
  name: "carFetch",
  initialState: {
    carData: {},
    status: "idle",
    errors: {
      mileage: "",
      fuelConsumption: "",
      addressCityProvince: "",
      addressDistrict: "",
      addressWard: "",
      addressHouseNumberStreet: "",
      description: "",
      basePrice: "",
      deposit: "",
      specify: "",
      carImageFront: "",
      carImageBack: "",
      carImageLeft: "",
      carImageRight: "",
    },
  },
  reducers: {
    checkErrors: (state) => {
      // Kiểm tra nếu có bất kỳ lỗi nào tồn tại
      const hasError = Object.values(state.errors).some(
        (error) => error !== ""
      );
      if (hasError) {
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

        return;
      }
      // Nếu không có lỗi, reset errors để đảm bảo không có lỗi cũ còn lưu lại
      state.errors = {};
    },

    setFetchedCarData: (state, action) => {
      state.carData = {
        ...state.carData,
        ...action.payload,
      };
    },

    setCar: (state, action) => {
      state.carData.data = {
        ...state.carData.data,
        ...action.payload,
      };
    },

    setErrors: (state, action) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    toggleFunction: (state, action) => {
      state.carData.additionalFunctions = {
        ...state.carData.additionalFunctions,
        [action.payload]: !state.carData.additionalFunctions[action.payload],
      };
    },

    toggleUse: (state, action) => {
      state.carData.termsOfUses = {
        ...state.carData.termsOfUses,
        [action.payload]: !state.carData.termsOfUses[action.payload],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCarById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // get additional function if exist
        const additionalFunctionKeys =
          action.payload?.data?.additionalFunction || "";
        const functionArray = additionalFunctionKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        // list default additional function
        const defaultAdditionalFunctions = {
          Bluetooth: false,
          GPS: false,
          Camera: false,
          SunRoof: false,
          ChildLock: false,
          ChildSeat: false,
          DVD: false,
          USB: false,
        };

        // update additional function
        const updatedAdditionalFunctions = Object.keys(
          defaultAdditionalFunctions
        ).reduce(
          (acc, key) => {
            acc[key] = functionArray.includes(key);
            return acc;
          },
          { ...defaultAdditionalFunctions } // sure that enough keys
        );

        // update data in Redux state
        state.carData = {
          ...action.payload,
          addressCityProvince: "",
          addressDistrict: "",
          addressWard: "",
          addressHouseNumberStreet: "",
          additionalFunctions: updatedAdditionalFunctions, // update additional function
          termsOfUses: {
            noSmoking: false,
            noPet: false,
            noFoodInCar: false,
          },
          termsOfOther: false,
          specify: "",
        };
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.error.message;
      });

    builder
      .addCase(getCarDetail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCarDetail.fulfilled, (state, action) => {
        state.status = "succeeded";

        // get additional function if exist
        const additionalFunctionKeys =
          action.payload?.data?.additionalFunction || "";
        const termsOfOthers = action.payload?.data?.termOfUse || "";

        const functionArray = additionalFunctionKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        const termsOfOtherArray = termsOfOthers
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        // list default additional function
        const defaultAdditionalFunctions = {
          Bluetooth: false,
          GPS: false,
          Camera: false,
          SunRoof: false,
          ChildLock: false,
          ChildSeat: false,
          DVD: false,
          USB: false,
        };

        const defaultTermsOfUses = {
          noSmoking: false,
          noPet: false,
          noFoodInCar: false,
          other: false,
        };

        const validKeys = ["noSmoking", "noPet", "noFoodInCar"];

        // update termsOfOther
        const updatedTermsOfOther = Object.keys(defaultTermsOfUses).reduce(
          (acc, key) => {
            acc[key] = termsOfOtherArray.includes(key);
            return acc;
          },
          {
            ...defaultTermsOfUses, // sure that enough keys
          }
        );

        updatedTermsOfOther.other = termsOfOtherArray.some(
          (key) => !validKeys.includes(key)
        );

        // update additional function
        const updatedAdditionalFunctions = Object.keys(
          defaultAdditionalFunctions
        ).reduce(
          (acc, key) => {
            acc[key] = functionArray.includes(key);
            return acc;
          },
          { ...defaultAdditionalFunctions } // sure that enough keys
        );

        state.carData = {
          ...action.payload,
          additionalFunctions: updatedAdditionalFunctions, // update additional function
          termsOfUses: updatedTermsOfOther,
          other:
            termsOfOtherArray
              .filter((key) => !validKeys.includes(key))
              .join(", ") || "",
        };
      })
      .addCase(getCarDetail.rejected, (state, action) => {
        state.status = "failed";
        state.errors = action.error.message;
      });
    builder.addCase(getBookingListOperator.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(getBookingListOperator.fulfilled, (state, action) => {
      state.status = "idle";
      state.bookings = action.payload;
    });
    builder.addCase(getBookingListOperator.rejected, (state, action) => {
      state.status = "failed";
      state.errors = action.error.message;
    });

    builder.addCase(confirmDeposit.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(confirmDeposit.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(confirmDeposit.rejected, (state, action) => {
      state.status = "failed";
      state.errors = action.error.message;
    });
    builder.addCase(rejectDeposit.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(rejectDeposit.fulfilled, (state, action) => {
      state.status = "idle";
    });
    builder.addCase(rejectDeposit.rejected, (state, action) => {
      state.status = "failed";
      state.errors = action.error.message;
    });
  },
});

export const {
  setFetchedCarData,
  setErrors,
  setCar,
  toggleFunction,
  toggleUse,
  checkErrors,
} = carFetchSlice.actions;

export default carFetchSlice.reducer;
