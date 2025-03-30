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
        // console.log("Request URL:", url);
        // console.log(searchParams.pickUpTime)
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

export const getMyCars = async (searchParams) => {
    try {
        const response = await axios.get(`${CAR_URL}/car-owner/my-cars`, {
            params: {
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
        alert(error.response?.data?.message || "Get data failed");
        throw error;
    }
};

export const getAllCars = async (searchParams) => {
    try {
        const response = await axios.get(`${CAR_URL}/operator/list`, {
            params: {
                page: searchParams.page || 0,
                size: searchParams.size || 10,
                sort: searchParams.sort || "updatedAt,DESC",
                ...(searchParams.status && { status: searchParams.status })
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

export const getCarDocuments = async (id) => {
    try {
        const response = await axios.get(`${CAR_URL}/operator/documents/${id}`, {
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

export const verifyCar = async (id) => {
    try {
        const response = await axios.put(
            `${CAR_URL}/operator/verify/${id}`,
            {},
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error verify Status:", error);
        throw error;
    }
};