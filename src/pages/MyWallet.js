import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../components/common/Breadcrumb";
import Layout from "../components/common/Layout";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { Image } from "@mui/icons-material";
import icon from "../assets/walleticon.png";
import {
  DateCalendar,
  DatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";
import { ModalClose, ModalDialog } from "@mui/joy";
import axios from "axios"
import { fetchAllTransactions, fetchResponseFromVNPay, fetchTransactionsByDate, topup, withdrawFunction } from "../services/WalletServices";
import { useNavigate, useSearchParams } from "react-router-dom";
import NotificationSnackbar from "../components/common/NotificationSnackbar";

const listBreadcrumbData = [
  {
    name: "Home",
    link: "/home", // fix when done home page
  },
  {
    name: "My Wallet",
    link: "/my-wallet",
  },
];
const columns = [
  {
    field: "id",
    headerName: "No.",
    flex: 0.5,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "amount",
    headerName: "Amount",
    flex: 1,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "type",
    headerName: "Transaction Type",
    flex: 1.25,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "createdAt",
    headerName: "Date Time",
    flex: 1.5,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "bookingNo",
    headerName: "Booking No.",
    flex: 1,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "carName",
    headerName: "Car Name",
    flex: 1,
    headerAlign: "start",
    align: "start",
  },
  {
    field: "message",
    headerName: "Note",
    flex: 1,
    headerAlign: "start",
    align: "start",
  },
];

const MyWallet = () => {
  // Handle for day
  // const today = dayjs().endOf('day');
  // const yesterday = today.subtract(1, "day").startOf('day');
    const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
  
  const [fromDate, setFromDate] = useState(dayjs().subtract(1, 'month').startOf("day"));
  const [toDate, setToDate] = useState(dayjs().endOf("day"));
  const [errorDate, setErrorDate] = useState("");

  const [balance, setBalance] = useState();
  //Handle for data to request
  const [transactions, setTransactions] = useState([]);
  const fetchTransactions = async() =>{
    const res = await fetchTransactionsByDate(fromDate, toDate);
    if(!res) return;
  const transactionsWithId = res.data.listTransactionResponse
  .filter(item => item.status === "SUCCESSFUL")
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .map((item, index) => ({
      ...item,
    id: index + 1, // Auto-incrementing "No." column
    createdAt: item.createdAt 
      ? new Date(item.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hourCycle: "h23", // Ensures 24-hour format
        })
      : "N/A", 
    bookingNo: item.bookingNo || "N/A",
    carName: item.carName || "N/A",
    amount: item.amount != null 
  ? `${(item.type !== "PAY_DEPOSIT" && item.type !== "WITHDRAW")? "+" : "-"}${item.amount.toLocaleString()}` 
  : "N/A",
    message: item.message || "N/A",
    }
  )
  );
 setBalance(res.data.balance);
  setTransactions(transactionsWithId);
}
const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    // Fetch all transactions when the page loads
    fetchTransactions();
    
  }, [refresh]);
  const [searchParams] = useSearchParams();
  const nav = useNavigate()
  useEffect(()=>{
    const vnpParams = Object.fromEntries(searchParams.entries())
    const txnRef = vnpParams.vnp_TxnRef;

    if (!txnRef) return; // Don't fetch if txnRef is missing

    const fetchResponseVNPay = async () => {
    try {
      const response = await fetchResponseFromVNPay(vnpParams);
      console.log("VNPay Response:", response); 
      if (response) {
        setTimeout(() => {
          fetchTransactions(); 
      }, 500);
        setAlert({ open: true, message: `Top-up status: ${response.data.data.status}. Amount: ${response.data.data.amount}`, severity: "success" });
        console.log(response)
        console.log("Navigating to /my-wallet..."); // Debugging log
         
      setTimeout(() => {
        nav("/my-wallet", { replace: true }); 
      }, 1000);
      }
    } catch (error) {
      console.error("Error fetching VNPay response:", error);
    }
  };
  
     fetchResponseVNPay();
  },[searchParams, nav])

  useEffect(() => {
    if (!fromDate || !toDate) {
      setErrorDate(""); // Reset error if dates are empty
      return;
    }
    if (fromDate.isAfter(toDate)) {
      setErrorDate("the To date must be later than the From date.");
    } else {
      setErrorDate("");
    }
  }, [fromDate, toDate]);
  const handleSearchDate = async () => {
    if (!fromDate || !toDate) {
      setAlert({ open: true, message: "Please select a valid date range.", severity: "error" });
      return;
    }
    const fetchTransactionsDate = async() =>{
    const res = await fetchTransactionsByDate(fromDate, toDate);
    if (!res || !res.data) return;

    const transactionsWithId = res.data.listTransactionResponse
    .filter(item => item.status === "SUCCESSFUL")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item, index) => ({
      ...item,

      id: index + 1,
      createdAt: item.createdAt 
      ? new Date(item.createdAt).toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hourCycle: "h23", // Ensures 24-hour format
        })
      : "N/A", 
      bookingNo: item.bookingNo || "N/A",
      carName: item.carName || "N/A",
      amount: item.amount != null 
      ? `${(item.type !== "PAY_DEPOSIT" && item.type !== "WITHDRAW")? "+" : "-"}${item.amount.toLocaleString()}` 
      : "N/A",
      message: item.message || "N/A",
    }));

    setTransactions(transactionsWithId);
    setBalance(res.data.balance);
  }
  fetchTransactionsDate();
  };
  //Handle for modal
  const [amountTopUp, setAmountTopUp] = useState("");
  const [amountWithdraw, setAmountWithdraw] = useState("");
  const [openTopUp, setOpenTopUp] = useState(false);

  const handleOpenTopUp = () => {
    setOpenTopUp(true);
  };
  const handleCloseTopUp = () => {
    setOpenTopUp(false);
  };
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const handleOpenWithdraw = () => {
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };

  //Handle topup
  const handleSubmitTopUp = async () => {
    // Add validation for empty amount or invalid amount
    if (!amountTopUp || amountTopUp === "") {
      setAlert({ 
        open: true, 
        message: "Please select an amount before proceeding with top-up.", 
        severity: "error" 
      });
      return;
    }

    if (amountTopUp <= 0) {
      setAlert({ 
        open: true, 
        message: "Please select a valid amount for top-up.", 
        severity: "error" 
      });
      return;
    }

    const formTopUp = {
      type: "TOP_UP",
      bookingNumber: "",
      carName: "",
      amount: Number(amountTopUp),
      message: "",
    };

    try {
      const res = await topup(formTopUp);
      if (!res || !res.data) {
        setAlert({ 
          open: true, 
          message: "Top-up request failed. Please try again.", 
          severity: "error" 
        });
        return;
      }
      window.open(res.data.payment.vnp_url);
      handleCloseTopUp();
    } catch (error) {
      console.error("Top-up Error:", error);
      setAlert({ 
        open: true, 
        message: `Top-up failed: ${error.response?.data?.message || 'Please try again'}`, 
        severity: "error" 
      });
    }
    setRefresh((prev) => !prev);
  };
  const handleSubmitWithdraw = async () => {
    console.log("Withdraw Amount Selected:", amountWithdraw); // Debugging

  if (!amountWithdraw || amountWithdraw <= 0) {
    setAlert({ open: true, message: "Please select a valid amount to withdraw.", severity: "error" });
    return;
  }
    const formWithdraw = {
      type: "WITHDRAW",
      bookingNumber: "",
      carName: "",
      amount: Number(amountWithdraw),
      message: "",
    };
    console.log(amountWithdraw)
    const withdraw = async (formWithdraw)=>{
      try{
        const res = await withdrawFunction(formWithdraw);
        if (!res || !res.data) return;
        setAlert({ open: true, message:  `Successfully withdraw ${res.data.data.amount.toLocaleString()} VND`, severity: "success" });
          handleCloseWithdraw();
      }catch(error){
        console.error("Withdraw Error:", error); // Debugging
         setAlert({ open: true, message: `Withdraw error: ${error.response.data.message}`, severity: "error" });
         handleCloseWithdraw();
      }
      
    }

    await withdraw(formWithdraw);
    setRefresh((prev) => !prev); 
    fetchAllTransactions();
  };
 
  //Handle pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  return (
    <div>
      <Layout>
        <Container sx={{ marginInline: "150px" }}>
          <Breadcrumb listData={listBreadcrumbData} />
          <Box display={"flex"} sx={{ marginBottom: 2 }}>
            <Box
              component="img"
              sx={{
                height: 50,
                width: 50,
              }}
              src={icon}
            />
            <Typography
              variant="h5"
              display={"flex-column"}
              alignContent={"center"}
            >
              My Wallet
            </Typography>
          </Box>
          <Box
            className="account-balance"
            display={"flex"}
            justifyContent={"space-between"}
            marginBottom={"20px"}
          >
            <Box
              sx={{
                backgroundColor: "whitesmoke",
                padding: 3,
                width: "42%",
                borderRadius: 2,
                border: "solid 2px ",
                borderColor: "#05ce80",
              }}
            >
              <Typography variant="h6" color="#333333" marginBottom={"10px"}>
                {" "}
                Your current balance:
              </Typography>
              <Box display={"flex"}>
                <Typography variant="h6" color="#333333" marginRight={"10px"}>
                  VND{" "}
                </Typography>
                <Typography variant="h4" color="#333333">
                {balance ? balance.toLocaleString() : "0"}
                </Typography>
              </Box>
            </Box>
            <Box
              className="list-button"
              display={"flex flex-column"}
              justifyContent={"flex-end"}
              //sx={{ marginBottom: 5 }}
              alignContent={"end"}
            >
              <Button
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor: "#05ce80",
                  marginInline: 2,
                  color: "white",
                  transition: " 0.3s",
                  "&:hover": {
                    backgroundColor: "white",
                    borderRadius: 2,
                    borderColor: "#05ce80",
                    color: "#05ce80",
                  },
                }}
                onClick={handleOpenTopUp}
              >
                Top-Up
              </Button>
              <Modal open={openTopUp} onClose={handleCloseTopUp}>
                <ModalDialog>
                  <ModalClose onClick={handleCloseTopUp} />
                  <Box textAlign={"center"}>
                    <Typography variant={"h6"}>Top-up</Typography>
                    <Typography variant={"h7"}>
                      Your current balance is {balance ? balance.toLocaleString() : "0"} VND.
                    </Typography>
                    <br />
                    <Typography variant={"h7"}>
                      Please select the amount to top-up to your wallet.
                    </Typography>
                    <br />
                    <FormControl sx={{ marginTop: "10px", width: "50%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Amount
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={amountTopUp}
                        label="Amount"
                        onChange={(e) => setAmountTopUp(e.target.value)}
                      >
                        <MenuItem type="Number" value={2000000}>
                          2,000,000 VND
                        </MenuItem>
                        <MenuItem type="Number" value={5000000}>
                          5,000,000 VND
                        </MenuItem>
                        <MenuItem type="Number" value={10000000}>
                          10,000,000 VND
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      sx={{
                        width: 150,
                        height: 50,
                        borderRadius: 2,
                        border: "solid white",
                        backgroundColor: "#05ce80",
                        marginInline: 2,
                        color: "white",
                        transition: " 0.3s",
                        "&:hover": {
                          backgroundColor: "white",
                          borderRadius: 2,
                          borderColor: "#05ce80",
                          color: "#05ce80",
                        },
                      }}
                      onClick={handleSubmitTopUp}
                    >
                      Top-Up
                    </Button>
                  </Box>
                </ModalDialog>
              </Modal>
              <Button
                sx={{
                  width: 150,
                  height: 50,
                  borderRadius: 2,
                  border: "solid ",
                  borderColor: "#05ce80",
                  backgroundColor: "white",
                  marginInline: 2,
                  color: "#05ce80",
                  "&:hover": {
                    backgroundColor: "#05ce80",
                    borderColor: "#05ce80",
                    color: "white",
                  },
                }}
                onClick={handleOpenWithdraw}
              >
                Withdraw
              </Button>
              <Modal open={openWithdraw} onClose={handleCloseWithdraw}>
                <ModalDialog>
                  <ModalClose onClick={handleCloseWithdraw} />
                  <Box textAlign={"center"}>
                    <Typography variant={"h6"}>Withdraw</Typography>
                    <Typography variant={"h7"}>
                      Your current balance is {balance ? balance.toLocaleString() : "0"} VND.
                    </Typography>
                    <br />
                    <Typography variant={"h7"}>
                      Please select the amount to withdraw from your wallet.
                    </Typography>
                    <br />
                    <FormControl sx={{ marginTop: "10px", width: "50%" }}>
                      <InputLabel id="demo-simple-select-label">
                        Amount
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={amountWithdraw}
                        label="Amount"
                        onChange={(e) => setAmountWithdraw(e.target.value)}
                      >
                        <MenuItem type="Number" value={2000000}>2,000,000 VND</MenuItem>
                        <MenuItem type="Number" value={5000000}>5,000,000 VND</MenuItem>
                        <MenuItem type="Number" value={balance}>All balance</MenuItem>
                      </Select>
                    </FormControl>
                    <br/>
                    <Button
                      sx={{
                        width: 150,
                        height: 50,
                        borderRadius: 2,
                        border: "solid white",
                        backgroundColor: "#05ce80",
                        marginInline: 2,
                        color: "white",
                        transition: " 0.3s",
                        "&:hover": {
                          backgroundColor: "white",
                          borderRadius: 2,
                          borderColor: "#05ce80",
                          color: "#05ce80",
                        },
                      }}
                      onClick={handleSubmitWithdraw}
                    >
                      Withdraw
                    </Button>
                  </Box>
                </ModalDialog>
              </Modal>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: "whitesmoke",
              padding: 3,
              borderRadius: 2,
              border: "solid 2px ",
              borderColor: "#05ce80",
              marginBottom: "30px",
            }}
          >
            <Typography variant="h6" color="#333333" marginBottom={"10px"}>
              Your History of Transactions
            </Typography>
            <Box
              display={"flex"}
              justifyContent={"space-around"}
              marginBottom={"10px"}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display={"flex"} sx={{ width: "42%" }}>
                  <Typography
                    variant="h6"
                    color="#333333"
                    marginBottom={"10px"}
                    display={"flex-column"}
                    alignContent={"center"}
                    marginRight={1}
                  >
                    From
                  </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disableFuture
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.startOf("day"));
                      console.log("From date: ", e);
                    }}
                  />
                </Box>
                <Box display={"flex"} sx={{ width: "42%" }}>
                  <Typography
                    variant="h6"
                    color="#333333"
                    marginBottom={"10px"}
                    display={"flex-column"}
                    alignContent={"center"}
                    marginRight={1}
                  >
                    To
                  </Typography>
                  <DatePicker
                    format="DD/MM/YYYY"
                    disableFuture
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.endOf("day"));
                      console.log("To date: ", e);
                    }}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
            {errorDate ? (
              <>
                <Box display={"flex"} justifyContent={"end"}>
                  <Typography
                    color="red"
                    fontSize={"15px"}
                    fontStyle={"italic"}
                  >
                    {errorDate}
                  </Typography>
                </Box>
                <Box display={"flex"} justifyContent={"end"}>
                  <Button
                    disabled
                    sx={{
                      width: 150,
                      height: 50,
                      borderRadius: 2,
                      border: "solid white",
                      backgroundColor: "#05ce80",
                      marginInline: 2,
                      color: "white",
                      transition: " 0.3s",
                      marginBottom: "10px",
                    }}
                  >
                    Search
                  </Button>
                </Box>
              </>
            ) : (
              <Box display={"flex"} justifyContent={"end"}>
                <Button
                  onClick={handleSearchDate}
                  sx={{
                    width: 150,
                    height: 50,
                    borderRadius: 2,
                    border: "solid white",
                    backgroundColor: "#05ce80",
                    marginInline: 2,
                    color: "white",
                    transition: " 0.3s",
                    marginBottom: "10px",
                    "&:hover": {
                      backgroundColor: "white",
                      borderRadius: 2,
                      borderColor: "#05ce80",
                      color: "#05ce80",
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            )}

            <Paper>
              <DataGrid
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                columns={columns}
                rows={transactions}
                disableRowSelectionOnClick
                pagination
                pageSizeOptions={[10, 15, 20, 25, 30]}
              ></DataGrid>
            </Paper>
          </Box>
        </Container>
      </Layout>
      <NotificationSnackbar  alert={alert} onClose={() => setAlert({ ...alert, open: false })} />
    </div>
  );
};

export default MyWallet;
