import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFileFromDB } from "../Helper/indexedDBHelper";
import { toast } from "react-toastify";
// import axios from "axios";

const BASE_URL = "http://localhost:3000/karental/cars";
// Fetch danh sách xe từ API môi trường giả lập
export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  const response = await fetch("/api/cars");
  const data = await response.json();
  return data.cars || [];
});

export const addNewCar = createAsyncThunk(
  "cars/addNewCar",
  async (_, { getState }) => {
    try {
      const state = getState();
      const carData = state.cars.carData; // Lấy dữ liệu từ Redux

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
            "registrationPaper",
            "insurance",
            "certificateOfInspection",
          ].includes(key)
        ) {
          formData.append(key, value);
        }
      });

      // Danh sách file cần lấy từ IndexedDB
      const imageKeys = [
        "carImageFront",
        "carImageBack",
        "carImageLeft",
        "carImageRight",
        "registrationPaper",
        "insurance",
        "certificateOfInspection",
      ];

      // Lấy file từ IndexedDB và thêm vào formData
      for (const key of imageKeys) {
        const file = await getFileFromDB(key);
        if (file) {
          formData.append(key, file);
        }
      }

      // Gửi request lên server (cookie sẽ tự động được gửi kèm)
      const response = await fetch(
        "http://localhost:8080/karental/car/car-owner/add-car",
        {
          method: "POST",
          body: formData,
          credentials: "include", // 🔥 Quan trọng: Để gửi cookie
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (!response.ok) {
        alert(data?.message || "Registration failed");
        throw new Error(data?.message || "Registration failed");
      }

      toast.success("🚗 Add Car Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Add Car Failed! 🎉", { position: "top-right" });
      throw error;
    }
  }
);

export const fetchInforProfile = createAsyncThunk(
  "cars/fetchInforProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:8080/karental/user/edit-profile",
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Get profile failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Get Profile Successful! 🎉", {
      //   position: "top-right",
      // });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Profile Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error.");
    }
  }
);


const toggleBoolean = (state, key) => {
  if (state.hasOwnProperty(key)) {
    state[key] = !state[key];
  }
};

const initialState = {
  //steb 1:
  cars: [],
  status: "idle",
  step: 1,
  carData: {
    licensePlate: "",
    brand: "",
    selectedBrand: "", ////
    color: "",
    model: "",
    modelList: [], /////
    productionYear: "",
    numberOfSeats: "",
    automatic: true,
    gasoline: true,
    registrationPaper: "",
    certificateOfInspection: "",
    insurance: "",

    //  steb 2:
    mileage: "",
    fuelConsumption: "",
    selectedCityProvince: "", /////////////
    selectedDistrict: "", /////////////

    addressCityProvince: "",
    addressDistrict: "",
    addressWard: "",
    addressHouseNumberStreet: "",

    address: "", //

    description: "",
    additionalFunctions: {
      Bluetooth: false,
      GPS: false,
      Camera: false,
      SunRoof: false,
      ChildLock: false,
      ChildSeat: false,
      DVD: false,
      USB: false,
    },
    additionalFunction: "",

    carImageFront: "",
    carImageBack: "",
    carImageLeft: "",
    carImageRight: "",

    //  steb 3:
    basePrice: "",
    deposit: "",
    termsOfUses: {
      noSmoking: false,
      noPet: false,
      noFoodInCar: false,
    },
    termsOfOther: false,
    termOfUse: "",
    specify: "",
  },
  errors: {}, // Lưu lỗi của từng trường nhập liệu
};

export const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCarData: (state, action) => {
      state.carData = {
        ...state.carData,
        ...action.payload,
      };
    },

    setErrors: (state, action) => {
      state.errors = {
        ...state.errors,
        ...action.payload,
      };
    },

    setStep: (state, action) => {
      state.step = action.payload;
    },

    resetCarForm: (state) => {
      state.errors = {};
      state.carData = initialState.carData;
    },

    handleNext: (state) => {
      let newErrors = {};
      const regex = /^\d{2}[A-Z]-\d{3}\.\d{2}$/;

      if (state.step === 1) {
        if (
          !state.carData.licensePlate?.trim() ||
          !regex.test(state.carData.licensePlate)
        ) {
          newErrors.licensePlate = "Invalid format! Example: 49F-123.56";
        }
        if (!state.carData.color) {
          newErrors.color = "Color is required.";
        }
        if (!state.carData.brand) {
          newErrors.brand = "Brand name is required.";
        }
        if (!state.carData.model) {
          newErrors.model = "Model is required.";
        }
        if (
          !state.carData.productionYear ||
          state.carData.productionYear > 2030 ||
          state.carData.productionYear < 1990
        ) {
          newErrors.productionYear =
            "Please enter production year from 1990 to 2030";
        }
        if (
          !state.carData.numberOfSeats ||
          (state.carData.numberOfSeats !== 4 &&
            state.carData.numberOfSeats !== 5 &&
            state.carData.numberOfSeats !== 7)
        ) {
          newErrors.numberOfSeats = "Please enter 4, 5, or 7 seats.";
        }

        // Kiểm tra file (chỉ lưu tên file trong Redux)
        if (!state.carData.registrationPaper?.trim()) {
          newErrors.registrationPaper = "Registration paper is required.";
        }
        if (!state.carData.certificateOfInspection?.trim()) {
          newErrors.certificateOfInspection =
            "Certificate of inspection is required.";
        }
        if (!state.carData.insurance?.trim()) {
          newErrors.insurance = "Insurance is required.";
        }
      }

      if (state.step === 2) {
        if (!state.carData.mileage) {
          newErrors.mileage = "Mileage is required.";
        }
        if (!state.carData.fuelConsumption) {
          newErrors.fuelConsumption = "Fuel consumption is required.";
        }
        if (!state.carData.addressCityProvince) {
          newErrors.addressCityProvince = "Address city province is required.";
        }
        if (!state.carData.addressDistrict) {
          newErrors.addressDistrict = "Address district is required.";
        }
        if (!state.carData.addressWard) {
          newErrors.addressWard = "Address ward is required.";
        }
        if (!state.carData.addressHouseNumberStreet) {
          newErrors.addressHouseNumberStreet =
            "Address house number street is required.";
        }
        if (!state.carData.description) {
          newErrors.description = "Description is required.";
        }

        // Kiểm tra file (chị lưu tên file trong Redux)
        if (!state.carData.carImageFront?.trim()) {
          newErrors.carImageFront = "Image front is required.";
        }
        if (!state.carData.carImageBack?.trim()) {
          newErrors.carImageBack = "Image back is required.";
        }
        if (!state.carData.carImageLeft?.trim()) {
          newErrors.carImageLeft = "Image left is required.";
        }
        if (!state.carData.carImageRight?.trim()) {
          newErrors.carImageRight = "Image right is required.";
        }
      }

      if (state.step === 3) {
        if (!state.carData.basePrice) {
          newErrors.basePrice = "Base price is required.";
        }
        if (!state.carData.deposit) {
          newErrors.deposit = "Deposit is required.";
        }
        if (state.carData.termsOfOther && !state.carData.specify) {
          newErrors.specify = "Specify is required.";
        }
      }

      // Cập nhật lỗi
      state.errors = newErrors;

      // Kiểm tra nếu có lỗi thì dừng lại
      if (Object.keys(newErrors).length > 0) {
        toast.error("⚠️ Please fulfill all the fields!");
        return;
      }

      // Nếu không có lỗi, chuyển bước
      if (state.step < 4) {
        state.step += 1;
        if (state.step === 2) {
          toast.success("🚗 Next Step! Basic was filled! 🎉", {
            position: "top-right",
          });
        }
        if (state.step === 3) {
          toast.success("🚗 Next Step! Details was filled! 🎉", {
            position: "top-right",
          });
        }
        if (state.step === 4) {
          toast.success("🚗 Next Step! Pricing was filled! 🎉", {
            position: "top-right",
          });
        }
      } else {
        state.status = "readyToSubmit";
      }
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

    toggleTransmission: (state) => {
      state.automatic = !state.automatic; // Đảo ngược giá trị
    },

    toggleProperty: (state, action) => {
      toggleBoolean(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewCar.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(addNewCar.fulfilled, (state, action) => {
      state.status = "idle";
      state.cars.push(action.payload);
    });
    builder.addCase(addNewCar.rejected, (state, action) => {
      state.status = "failed";
      state.errors = action.error.message;
    });

    builder.addCase(fetchInforProfile.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(fetchInforProfile.fulfilled, (state, action) => {
      state.status = "idle";
      state.carData = action.payload;
    });
    builder.addCase(fetchInforProfile.rejected, (state, action) => {
      state.status = "failed";
      state.errors = action.error.message;
    });
  },
});

export const {
  setCarData,
  setErrors,
  setStep,
  handleNext,
  resetCarForm,
  toggleFunction,
  toggleProperty,
  toggleUse,
} = carsSlice.actions;
export default carsSlice.reducer;
