import { Box, Button, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const NAV_H = 56;

const SECTION_SX = {
    position: "relative",
    left: "50%",
    right: "50%",
    ml: "-50vw",
    mr: "-50vw",
    width: "100vw",
} as const;

const WRAP_SX = {
    // mobile: dùng svh cho đỡ nhảy
    minHeight: { xs: "calc(100svh - 56px)", md: `calc(100vh - ${NAV_H}px)` },
    display: "flex",
    alignItems: "center",
    py: { xs: 6, md: 0 },
} as const;

const CTA_SX = {
    bgcolor: "#171717",
    borderRadius: 999,
    px: 3.25,
    py: 1.25,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    "&:hover": {
        bgcolor: "#111111",
        boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
    },
    "&:focus-visible": {
        outline: "2px solid rgba(182,140,90,0.5)",
        outlineOffset: 3,
    },
} as const;

const IMG_SX = {
    width: "100%",
    height: { xs: 240, md: 360 },
    borderRadius: 2,
    objectFit: "cover",
} as const;

const SERVICES = ["Prescription Glasses", "Blue Light Protection", "Premium Lenses"] as const;

export default function ServicesSection() {
    return (
        <Box component="section" sx={SECTION_SX}>
      <Box sx={WRAP_SX}>
        <Box
          sx={{
            width: "100%",
            px: { xs: 2, md: 4, lg: 8 },
            mx: "auto",
          }}
        >
          <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
                        {/* LEFT */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    letterSpacing: 4,
                                    textTransform: "uppercase",
                                    color: "#8A8A8A",
                                }}
                            >
                                Our services
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 1,
                                    fontWeight: 900,
                                    fontSize: { xs: 32, md: 40 },
                                    lineHeight: 1.05,
                                    color: "#171717",
                                }}
                            >
                                We care about
                                <br />
                                your vision.
                            </Typography>

                            <Typography
                                sx={{
                                    color: "#666666",
                                    mt: 2,
                                    mb: 3,
                                    fontSize: 14,
                                    lineHeight: 1.7,
                                }}
                            >
                                Professional eyewear services focused on comfort, accuracy and modern lifestyle.
                            </Typography>

                            <Button component={NavLink} to="/collections/glasses" variant="contained" sx={CTA_SX}>
                                Book eye test
                            </Button>
                        </Grid>

                        {/* MIDDLE */}
                        <Grid item xs={12} md={4}>
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontSize: 12,
                                    color: "#8A8A8A",
                                }}
                            >
                                What we offer
                            </Typography>

                            <Box
                                component="ul"
                                sx={{
                                    m: 0,
                                    pl: 0,
                                    listStyle: "none",
                                    color: "#171717",
                                    "& li": {
                                        mb: 1.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    },
                                }}
                            >
                                {SERVICES.map((s) => (
                                    <li key={s}>
                                        <Box
                                            sx={{
                                                width: 6,
                                                height: 6,
                                                borderRadius: "50%",
                                                bgcolor: "#B68C5A",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{s}</Typography>
                                    </li>
                                ))}
                            </Box>
                        </Grid>

                        {/* RIGHT */}
                        <Grid item xs={12} md={4}>
                            <Box
                                component="img"
                                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80"
                                alt="Eyewear service"
                                loading="lazy"
                                decoding="async"
                                sx={IMG_SX}
                            />
                        </Grid>
          </Grid>
        </Box>
            </Box>
        </Box>
    );
}
