import { createSelector } from "@reduxjs/toolkit";

export const selectCars = createSelector(
  (state) => state.cars, //Input selector: Lấy toàn bộ state của slice "cars"
  (carsState) => carsState.cars // Output selector: Chỉ lấy danh sách xe
);

