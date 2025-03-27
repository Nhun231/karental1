import axios from "axios";
const BASE_URL = "http://localhost:8080/karental/feedback";
export const getFeedbackByBookingId = async (bookingId) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/view-ratings/${bookingId}`, {
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
export const sendFeedback = async ({ bookingId, rating, comment }) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/customer/give-rating`,
            {
                bookingId,
                rating,
                comment
            },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        alert(error.response?.data?.message || "Failed to submit feedback");
        throw error;
    }
};
export const getFeedbackByCarOwner = async (searchParams) => {
    try {
        console.log(searchParams.size)
        const response = await axios.get(`${BASE_URL}/car-owner/my-feedbacks`, {
            params: {
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                ratingFilter: searchParams.ratingFilter || 0
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
export const getFeedbackByCarId = async (carId) => {
    try {
        const response = await axios.get(`${BASE_URL}/car/${carId}`, {
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
export const getAverageRating = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/car-owner/rating`, {
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
export const getFeedbackByCustomer = async (searchParams) => {
    try {
        const response = await axios.get(`${BASE_URL}/customer/view-feedbacks`, {
            params: {
                page: searchParams.page || 0,
                size: searchParams.size || 10,
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