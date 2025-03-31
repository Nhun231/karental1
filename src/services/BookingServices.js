import axios from "axios";
const BOOK_URL = `${process.env.REACT_APP_BASE_URL}/booking`;
export const getMyBookings = async (searchParams) => {
    try {
        const response = await axios.get(`${BOOK_URL}/customer/my-bookings`, {
            params: {
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                sort: searchParams.sort || "updatedAt,DESC",
                status: searchParams.status || null
            },
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Get data failed");
        throw error;
    }
};
export const getMyRentals = async (searchParams) => {
    try {
        const response = await axios.get(`${BOOK_URL}/car-owner/rentals`, {
            params: {
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                sort: searchParams.sort || "updatedAt,DESC",
                status: searchParams.status || null
            },
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Get data failed");
        throw error;
    }
};
export const getRentalsDetail = async (id) => {
    try {
        const requestUrl = `${BOOK_URL}/car-owner/${id}`;
        const response = await axios.get(requestUrl, {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Response data:", error.response?.data);
        alert(error.response?.data?.message || "Get data failed");
        throw error;
    }
};

export const confirmBooking = async (bookingNumber) => {
    try {
        const response = await axios.put(
            `${BOOK_URL}/car-owner/${bookingNumber}/confirm`,
            {},
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error confirming booking:", error);
        throw error;
    }
};