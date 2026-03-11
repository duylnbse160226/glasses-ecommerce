import { Box, Pagination, Typography } from "@mui/material";

export function PaginationBar({
    page,
    totalPages,
    totalItems,
    pageSize,
    displayedCount,
    onChange,
}: {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    /** Số sản phẩm thực tế hiển thị trên trang hiện tại (sau client-side filter) */
    displayedCount?: number;
    onChange: (nextPage: number) => void;
}) {
    const from =
        totalItems === 0 || (displayedCount != null && displayedCount === 0)
            ? 0
            : (page - 1) * pageSize + 1;
    const to =
        totalItems === 0
            ? 0
            : displayedCount != null
              ? displayedCount > 0
                  ? from + displayedCount - 1
                  : 0
              : Math.min(page * pageSize, totalItems);

    return (
        <Box
            sx={{
                mt: 4,
                pt: 2.5,
                borderTop: "1px solid #F1F1F1",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <Typography
                sx={{
                    color: "#6B6B6B",
                    fontWeight: 500,
                    fontSize: 13,
                }}
            >
                Showing{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#171717" }}>
                    {from}
                </Box>
                –
                <Box component="span" sx={{ fontWeight: 600, color: "#171717" }}>
                    {to}
                </Box>{" "}
                of{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#171717" }}>
                    {totalItems}
                </Box>
            </Typography>

            <Pagination
                page={page}
                count={totalPages}
                onChange={(_, v) => onChange(v)}
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                showFirstButton
                showLastButton
                sx={{
                    "& .MuiPagination-ul": {
                        gap: 0.5,
                    },
                    "& .MuiPaginationItem-root": {
                        fontWeight: 500,
                        fontSize: 13,
                        borderRadius: 999,
                        minWidth: 32,
                        height: 32,
                        border: "1px solid transparent",
                        color: "#6B6B6B",
                    },
                    "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: "#FAFAFA",
                        borderColor: "#ECECEC",
                        color: "#171717",
                    },
                    "& .MuiPaginationItem-previousNext, & .MuiPaginationItem-firstLast": {
                        fontSize: 12,
                        color: "#8A8A8A",
                    },
                }}
            />
        </Box>
    );
}
