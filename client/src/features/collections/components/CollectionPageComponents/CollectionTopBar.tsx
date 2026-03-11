import { Box, MenuItem, Select, Typography } from "@mui/material";
import type { SortKey } from "../../../../lib/types";

export function CollectionTopBar({
    sort,
    setSort,
}: {
    sort: SortKey;
    setSort: (v: SortKey) => void;
}) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Typography
                sx={{
                    fontSize: 13,
                    color: "#8A8A8A",
                    display: { xs: "none", sm: "block" },
                }}
            >
                Sort by
            </Typography>
            <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                size="small"
        MenuProps={{
          // Không khóa scroll của trang để tránh layout dịch trái/phải
          disableScrollLock: true,
        }}
                sx={{
                    height: 38,
                    minWidth: 210,
                    borderRadius: 999,
                    flexShrink: 0,
                    bgcolor: "#FFFFFF",
                    "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ECECEC",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#E2E2E2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#B68C5A",
                    },
                    "& .MuiSelect-select": {
                        display: "flex",
                        alignItems: "center",
                        py: 0,
                        fontSize: 14,
                        color: "#171717",
                    },
                    "& .MuiSvgIcon-root": {
                        color: "#8A8A8A",
                    },
                    "&.Mui-focused": {
                        boxShadow: "0 0 0 1px rgba(182,140,90,0.16)",
                    },
                }}
            >
                <MenuItem value="featured">Featured</MenuItem>
                <MenuItem value="priceAsc">Price: Low → High</MenuItem>
                <MenuItem value="priceDesc">Price: High → Low</MenuItem>
            </Select>
        </Box>
    );
}
