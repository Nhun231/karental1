import { FormControl, MenuItem, TextField, Box } from "@mui/material";
/**
 * 
 * Filters Component
 * Display filter(sort, status)
 */
const Filters = ({ sortOption, setSortOption, statusFilter, setStatusFilter, statusOptions }) => {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Sorting */}
            <FormControl sx={{ minWidth: "200px" }}>
                <TextField
                    id="sortByDropdown"
                    select
                    label="Sort By"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    fullWidth
                >
                    <MenuItem id="newestOption" value="newest">Update At: Newest to Oldest</MenuItem>
                    <MenuItem id="oldestOption" value="oldest">Update At: Oldest to Newest</MenuItem>
                    <MenuItem id="priceHighOption" value="priceHigh">Price: High to Low</MenuItem>
                    <MenuItem id="priceLowOption" value="priceLow">Price: Low to High</MenuItem>
                </TextField>
            </FormControl>
            {/* Status Filter */}
            <FormControl sx={{ minWidth: "200px", ml: 2 }}>
                <TextField
                    id="statusFilterDropdown"
                    select
                    label="Status Filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    fullWidth
                >
                    {statusOptions.map((status) => (
                        <MenuItem key={status} id={`statusOption-${status}`} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
        </Box>
    );
};

export default Filters;
