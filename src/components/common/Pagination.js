import { Pagination, MenuItem, Select, Stack, Typography } from "@mui/material";
/**
 * 
 * Pagination
 * Display Pagination UI and handle logic change page, size
 */
const PaginationComponent = ({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  if (page < 0) {
    onPageChange(0);
    return null;
  } else if (page >= totalPages) {
    onPageChange(Math.max(totalPages - 1, 0));
    return null;
  }

  if (pageSize < 1) {
    onPageSizeChange(10);
    return null;
  }

  const handlePageChange = (event, value) => {
    onPageChange(value - 1);
  };

  const handlePageSizeChange = (event) => {
    onPageSizeChange(event.target.value);
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ mt: 2 }}
    >
      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={handlePageChange}
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#05ce80",
            borderColor: "#05ce80",
          },
          "& .Mui-selected": {
            backgroundColor: "#05ce80 !important",
            color: "#fff",
          },
          "& .MuiPaginationItem-root:hover": {
            backgroundColor: "rgba(5, 206, 128, 0.2)",
          },
        }}
      />
      <Select
        value={pageSize || 10}
        onChange={handlePageSizeChange}
        size="small"
        id="pageSizeSelect"
      >
        {[10, 15, 20, 25, 30].map((size) => (
          <MenuItem key={size} value={size} id={`pageSizeOption-${size}`} >
            {size}
          </MenuItem>
        ))}
      </Select>
      <Typography>items per page</Typography>
    </Stack>
  );
};

export default PaginationComponent;
