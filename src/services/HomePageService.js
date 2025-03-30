import axios from "axios";
const BASE_URL = "http://localhost:8080/karental/homepage";
export const getFeedback = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/feedbacks`, {
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
export const getTop6City = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/city`, {
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