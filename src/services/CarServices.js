import axios from "axios";
const CAR_URL = "http://localhost:8080/karental/car";
export const getCarDetail = async (formData) => {
    try {
        const requestUrl = `${CAR_URL}/customer/car-detail`;
        const response = await axios.get(requestUrl, {
            params: formData,
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


export const getSearchResult = async (searchParams) => {
    try {
        const url = `${CAR_URL}/search-car`;
        console.log("Request URL:", url);
        console.log(searchParams.pickUpTime)
        const response = await axios.get(`${CAR_URL}/customer/search-car`, {
            params: {
                address: searchParams.address,
                pickUpTime: searchParams.pickUpTime,
                dropOffTime: searchParams.dropOffTime,
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                sort: searchParams.sort || "productionYear,DESC",
            },
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.error("Error:", error);
        alert(error.response?.data?.message || "Get search results failed");
        throw error;
    }
};

export const getCarDetailbyCarOwner = async (id) => {
    try {
        const requestUrl = `${CAR_URL}/car-owner/${id}`;
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