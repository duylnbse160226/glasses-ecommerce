import { Outlet } from "react-router";
import { Box } from "@mui/material";

export default function AuthLayout() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                overflow: "hidden",
                display: "flex",
                background: "linear-gradient(180deg,#FFFFFF 0%,#FAFAF5 100%)",
            }}
        >
            <Outlet />
        </Box>
    );
}
