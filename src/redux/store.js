import { configureStore } from "@reduxjs/toolkit";
import { carsSlice } from "../reducers/carReducer";
import { carFetchSlice } from "../reducers/carFetchReducer";
import { rentCarSlice } from "../reducers/rentCarReducer";
import rentalReducer from "../reducers/RentalTimeReducer";


export const store = configureStore({
  reducer: {
    cars: carsSlice.reducer,
    carFetch: carFetchSlice.reducer,
    rentCar: rentCarSlice.reducer,
    rental: rentalReducer,
  },
});
