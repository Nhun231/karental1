import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = "http://localhost:8080/karental/transaction";
export const fetchAllTransactions = async () => {
   try{
    const response= await axios.get(`${BASE_URL}/transaction-list?all=true`,
        {
          withCredentials: true,
        }
      )
        console.log("Fetched transactions:", response.data);
        return response.data; 
   }
      catch(error) {
        console.error("Error fetching transactions:", error);
        return null;
      };
  
};
export const fetchTransactionsByDate = async (fromDate, toDate) => {
    try {
      const response = await axios.get(`${BASE_URL}/transaction-list`, {
        params: {
          from: dayjs(fromDate).format("YYYY-MM-DDTHH:mm:ss"),
          to: dayjs(toDate).format("YYYY-MM-DDTHH:mm:ss"),
        },
        withCredentials: true,
      });
  
      console.log("Fetched transactions by date:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions by date:", error);
      return null;
    }
  };

  export const fetchResponseFromVNPay = async(vnpParams) =>{
     if (!vnpParams.vnp_TxnRef) return;
    try{
      const response =  await axios.get(`${BASE_URL}/${vnpParams.vnp_TxnRef}/status`,{
        params: vnpParams,
        withCredentials: true,
      })
      console.log(response)
      return response;
    }catch(error){
      alert('Error transaction with VNPay: ',error)
      return null;
    }
  }

  export const topup = async (formTopUp) => {
        try{
           const response = await axios.post(`${BASE_URL}/top-up`, formTopUp, {
            withCredentials: true,
          })
          return response.data;
        }catch (error) {
            console.error("Error top-up", error);
            return null;
          }
  }
  export const withdrawFunction = async (formWithdraw) => {
    try{
       const response = await axios.post(`${BASE_URL}/withdraw`, formWithdraw, {
        withCredentials: true,
      })
      return response;
    }catch (error) {
        console.error("Error withdraw", error);
        throw error;
      }
}