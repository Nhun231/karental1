import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // API gọi đến backend
import { toast } from "react-toastify";
// Async Thunk để fetch dữ liệu xe

import { getFileFromDB, getAllKeysFromDB } from "../Helper/indexedDBHelper";

export const fetchCarById = createAsyncThunk(
  "cars/fetchCarById",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8080/karental/car/car-owner/${carId}`,
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Fetch car failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Fetch Car Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Car Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const carData = state.carFetch.carData.data; // Lấy dữ liệu từ Redux

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      // Thêm dữ liệu text vào formData
      Object.entries(carData).forEach(([key, value]) => {
        if (
          ![
            "carImageFront",
            "carImageBack",
            "carImageLeft",
            "carImageRight",
          ].includes(key)
        ) {
          formData.append(key, value);
        }
      });

      // Lấy danh sách key từ IndexedDB
      const existingKeys = await getAllKeysFromDB();

      // Danh sách ảnh cần kiểm tra
      const imageKeys = [
        "carImageFront",
        "carImageBack",
        "carImageLeft",
        "carImageRight",
      ];

      // Lấy file từ IndexedDB và thêm vào formData nếu key tồn tại
      for (const key of imageKeys) {
        if (existingKeys.includes(key)) {
          const file = await getFileFromDB(key);
          if (file) {
            formData.append(key, file);
          }
        }
      }

      // Hiển thị toàn bộ dữ liệu trong FormData
      // console.log("📤 FormData contents:");
      // for (let pair of formData.entries()) {
      //   console.log(`🔹 ${pair[0]}:`, pair[1]);
      // }

      const response = await fetch(
        `http://localhost:8080/karental/car/car-owner/edit-car/${carData.id}`,
        {
          method: "PUT",
          credentials: "include", // Để gửi cookie nếu cần
          body: formData,
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        return rejectWithValue(data?.message || "Failed to update car data");
      }

      toast.success("🚗 Update Car Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Update Car Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message);
    }
  }
);

export const getCarDetail = createAsyncThunk(
  "cars/getCarDetail",
  async ({carId, pickUpTime, dropOffTime}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:8080/karental/car/customer/car-detail?carId=${carId}&pickUpTime=${pickUpTime}&dropOffTime=${dropOffTime}`,
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Fetch car failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Fetch Car Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Car Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error");
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
        toast.error("⚠️ Please fulfill all the fields!");
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
        // Lấy danh sách chức năng từ API (nếu có)
        const additionalFunctionKeys =
          action.payload?.data?.additionalFunction || "";
        const functionArray = additionalFunctionKeys
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        // Danh sách mặc định
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

        // Cập nhật trạng thái của additionalFunctions
        const updatedAdditionalFunctions = Object.keys(
          defaultAdditionalFunctions
        ).reduce(
          (acc, key) => {
            acc[key] = functionArray.includes(key);
            return acc;
          },
          { ...defaultAdditionalFunctions } // Đảm bảo có đủ key
        );

        // Gán dữ liệu vào Redux state
        state.carData = {
          ...action.payload,
          addressCityProvince: "",
          addressDistrict: "",
          addressWard: "",
          addressHouseNumberStreet: "",
          additionalFunctions: updatedAdditionalFunctions, // Cập nhật giá trị mới
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
        state.carData = action.payload;
      })
      .addCase(getCarDetail.rejected, (state, action) => {
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
