import { FormControl, MenuItem, TextField, Box } from "@mui/material";

const Filters = ({ sortOption, setSortOption, statusFilter, setStatusFilter, statusOptions }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormControl sx={{ minWidth: "200px" }}>
                <TextField
                    select
                    label="Sort By"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="newest">Newest to Oldest</MenuItem>
                    <MenuItem value="oldest">Oldest to Newest</MenuItem>
                    <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                    <MenuItem value="priceLow">Price: Low to High</MenuItem>
                </TextField>
            </FormControl>

            <FormControl sx={{ minWidth: "200px", ml: 2 }}>
                <TextField
                    select
                    label="Status Filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    fullWidth
                >
                    {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
};

export default Filters;
