import CarCard from "../components/common/CarCard";
import { useSearchParams } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
  Button,
  Grid,
  Box,
  MenuItem,
  FormControl,
  Select,
  Divider,
} from "@mui/material";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import PaginationComponent from "../components/common/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { clearAllFilesFromDB } from "../Helper/indexedDBHelper";

const MyCars = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(
    parseInt(searchParams.get("size")) || 10
  );
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("newest");

  const getSortQuery = (option) =>
  ({
    newest: "productionYear,DESC",
    oldest: "productionYear,ASC",
    priceHigh: "basePrice,DESC",
    priceLow: "basePrice,ASC",
  }[option] || "productionYear,DESC");

  useEffect(() => {
    setSearchParams({ page, size: pageSize });
    // fetch(
    //   `http://localhost:8080/karental/car/my-cars?page=${
    //     page - 1
    //   }&size=${pageSize}&sort=${getSortQuery(sortOption)}`,
    //   {
    //     method: "GET",
    //     credentials: "include",
    //     headers: { "Content-Type": "application/json" },
    //   }

    //)
    axios
      .get(
        `http://localhost:8080/karental/car/car-owner/my-cars?page=${page - 1
        }&size=${pageSize}&sort=${getSortQuery(sortOption)}`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.data.content)
        setCars(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      })
      .catch((error) => console.error("Error fetching cars:", error));
  }, [page, pageSize, sortOption, setSearchParams]);

  return (
    <div>
      <Header />
      <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>
        <Typography color="text.primary">My Cars</Typography>
      </Breadcrumbs>
      <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", p: 2 }}>List Of Cars</Typography>
      <Grid
        container
        spacing={3}
        sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}
      >
        {/* Filter */}
        <Grid
          item
          xs={12}
          sx={{
            pl: 0,
            pr: 2,
            pt: 0,
            pb: 2,
            height: "fit-content",
            paddingLeft: "0px !important",
            paddingTop: "0px !important",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
            {/*Button Add Car */}
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#05ce80",
                color: "white",
                "&:hover": { backgroundColor: "#04b16d" },
              }}
              component="a"
              href="/basic"
            >
              Add Car
            </Button>
            {/* Filter */}
            <FormControl sx={{ minWidth: 180 }}>
              <Select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="newest">Newest to Oldest</MenuItem>
                <MenuItem value="oldest">Oldest to Newest</MenuItem>
                <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                <MenuItem value="priceLow">Price: Low to High</MenuItem>
              </Select>
            </FormControl>


          </Box>
        </Grid>
        {/* List of Cars */}
        <Grid
          item
          xs={12}
          sx={{ border: "1px solid #ddd", p: 3, borderRadius: "8px" }}
        >

          {/* List of Cars */}
          <Grid container direction="column" spacing={3}>
            {cars.map((car) => (
              <Grid
                item
                xs={12}
                key={car.id}
                sx={{
                  width: "100%",
                  "@media (max-width: 1440px)": {
                    xs: { width: "100%" },
                  },
                }}
              >
                <Grid container spacing={2} alignItems="stretch">
                  <Grid item xs={10}>
                    <CarCard carData={car} />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    container
                    direction="column"
                    spacing={2}
                    alignItems="flex-end"
                    sx={{
                      height: "100%",
                      justifyContent: "space-between",
                      marginTop: "40px",
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        sessionStorage.setItem("selectedCarId", car.id); // Lưu ID vào sessionStorage
                        clearAllFilesFromDB();
                        // navigate("/edit-details");
                      }}
                      sx={{
                        backgroundColor: "#1976d2",
                        color: "white",
                        "&:hover": { backgroundColor: "#1565c0" },
                        width: "80%",
                        paddingY: 0.5,
                        paddingX: 2,
                        fontSize: "0.8rem",
                        height: "auto",
                        mb: 2,
                      }}
                    >
                      View details
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#05ce80",
                        color: "white",
                        "&:hover": { backgroundColor: "#04b16d" },
                        width: "80%",
                        paddingY: 0.5,
                        paddingX: 2,
                        fontSize: "0.8rem",
                        height: "auto",
                      }}
                    >
                      Confirm deposit
                    </Button>
                  </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <PaginationComponent
            page={page - 1}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage + 1)}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Footer />
      </Box>
    </div>
  );
};

export default MyCars;
