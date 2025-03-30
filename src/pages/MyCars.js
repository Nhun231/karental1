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
  InputLabel
} from "@mui/material";
import Layout from "../components/common/Layout";
import PaginationComponent from "../components/common/Pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { clearAllFilesFromDB } from "../Helper/indexedDBHelper";
import { getMyCars } from '../services/CarServices';
import Breadcrumb from "../components/common/Breadcrumb";
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
    setSearchParams({ page, size: pageSize, sort: getSortQuery(sortOption) });
    async function fetchMyCars() {
      try {
        const searchParams = {
          page: page - 1,
          size: pageSize,
          sort: getSortQuery(sortOption),
        };
        const response = await getMyCars(searchParams);
        setCars(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        console.error("Failed to fetch car data:", error);
      }
    }
    fetchMyCars();
  }, [page, pageSize, sortOption, setSearchParams]);

  useEffect(() => {
    document.title = 'My Cars';
  }, []);
  return (
    <Layout>
      <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
        {/* Breadcrumbs */}
        <Breadcrumb
          listData={[
            { name: "Home", link: "/" },
            { name: "My Cars", link: "" }
          ]}
        />
      </Box>
      {/* Page title */}
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
            pt: 0,
            pr: 0,
            pb: 2,
            height: "fit-content",
            px: 0
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
              href="/add-car-basic"
            >
              Add Car
            </Button>
            {/* Filter */}
            <FormControl sx={{ minWidth: 300 }}>
              <InputLabel id="sort-by-label" sx={{
                backgroundColor: "white",
                px: 0.5,
              }}>Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="newest">Production Year: Newest to Oldest</MenuItem>
                <MenuItem value="oldest">Production Year: Oldest to Newest</MenuItem>
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
          {cars.length === 0 ? (
            <Typography
              variant="h6"
              sx={{ textAlign: "center", my: 4, color: "gray" }}
            >
              No cars available.
            </Typography>
          ) : (
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
                          sessionStorage.setItem("selectedCarId", car.id);
                          clearAllFilesFromDB();
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
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2 }} />
                </Grid>
              ))}
            </Grid>
          )}
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

    </Layout>
  );
};

export default MyCars;
