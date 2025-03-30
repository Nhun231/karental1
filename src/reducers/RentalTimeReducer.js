import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const today = dayjs().startOf("day");

const MIN_PICKUP_HOUR = 8, MAX_PICKUP_HOUR = 22, MIN_DROPOFF_HOUR = 6, MAX_DROPOFF_HOUR = 22;

const getMinPickUpTime = () => {
    const now = dayjs();
    let pickUp;

    // Round up if minutes or second > 0
    let adjustedNow = now.minute() > 0 || now.second() > 0 ? now.add(1, "hour").startOf("hour") : now;

    if (adjustedNow.hour() + 2 > MAX_PICKUP_HOUR) {
        pickUp = today.add(1, "day").hour(MIN_PICKUP_HOUR);
    } else {
        pickUp = adjustedNow.add(2, "hour");
        if (pickUp.hour() < MIN_PICKUP_HOUR) {
            pickUp = pickUp.startOf("day").hour(MIN_PICKUP_HOUR);
        }
    }
    return pickUp;
};

const getValidDropOffTime = (pickUpTime) => {
    let dropOff = pickUpTime.add(2, "hour");

    if (dropOff.hour() > MAX_DROPOFF_HOUR) {
        dropOff = dropOff.startOf("day").add(1, "day").hour(MIN_DROPOFF_HOUR);
    } else if (dropOff.hour() < MIN_DROPOFF_HOUR) {
        dropOff = dropOff.startOf("day").add(1, "day").hour(MIN_DROPOFF_HOUR);
    }
    return dropOff;
};

const initialPickUpTime = getMinPickUpTime();
const initialDropOffTime = getValidDropOffTime(initialPickUpTime);
// console.log(dayjs(initialPickUpTime).format("YYYY-MM-DDTHH:mm:ss[Z]"))
const rentalSlice = createSlice({
    name: "rental",
    initialState: {
        pickUpTime: dayjs(initialPickUpTime).format("YYYY-MM-DDTHH:mm:ss[Z]"),
        dropOffTime: dayjs(initialDropOffTime).format("YYYY-MM-DDTHH:mm:ss[Z]"),
        address: {
            cityProvince: "",
            district: "",
            ward: "",
        },
    },
    reducers: {
        setRentalTime: (state, action) => {
            const { pickUpTime, dropOffTime } = action.payload;
            state.pickUpTime = pickUpTime;
            state.dropOffTime = dropOffTime;
        },
        setAddress: (state, action) => {
            state.address = action.payload;
        },
    },
});

export const { setRentalTime, setAddress } = rentalSlice.actions;
export default rentalSlice.reducer;
