import { Box, Card, CardActionArea, IconButton, Typography } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import { NavLink } from "react-router-dom";
import type { Product } from "../../../../lib/types";
import { formatMoney } from "../../../../lib/utils/format";

export function ProductCard({ p }: { p: Product }) {
    return (
        <Card
            sx={{
                borderRadius: 2.5,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                bgcolor: "#FFFFFF",
                overflow: "hidden",
                transition: "all 180ms ease",
                "&:hover .ProductCard-name": {
                    borderBottomColor: "#B68C5A",
                },
                "&:hover": {
                    borderColor: "#E0D0B8",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    transform: "translateY(-2px)",
                },
            }}
        >
            <CardActionArea
                component={NavLink}
                to={`/product/${p.id}`}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}
            >
                {/* Image block */}
                <Box
                    sx={{
                        position: "relative",
                        bgcolor: "#F6F4F2",
                        px: 2.5,
                        pt: 2.5,
                        pb: 2,
                        aspectRatio: "4 / 3",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        component="img"
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transform: "scale(1.01)",
                            transition: "transform .4s ease",
                            ".MuiCardActionArea-root:hover &": {
                                transform: "scale(1.06)",
                            },
                        }}
                    />

                    {/* Tag */}
                    {p.tag ? (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 14,
                                left: 14,
                                px: 1.2,
                                py: 0.6,
                                borderRadius: 999,
                                bgcolor: "rgba(17,24,39,0.9)",
                                color: "#FFFFFF",
                                fontSize: 12,
                                fontWeight: 900,
                                letterSpacing: "0.06em",
                            }}
                        >
                            {p.tag}
                        </Box>
                    ) : null}

                    {/* Action icons (top-right) */}
                    <Box
                        sx={{
                            position: "absolute",
                            right: 12,
                            top: 12,
                            display: "flex",
                            gap: 1,
                            opacity: 0,
                            transform: "translateY(4px)",
                            transition: "all 180ms ease",
                            ".MuiCardActionArea-root:hover &": {
                                opacity: 1,
                                transform: "translateY(0)",
                            },
                            "@media (max-width:900px)": {
                                opacity: 1,
                                transform: "none",
                            },
                        }}
                        onClick={(e) => e.preventDefault()}
                    >
                        <IconButton
                            size="small"
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "rgba(255,255,255,0.9)",
                                border: "1px solid #ECECEC",
                                backdropFilter: "blur(4px)",
                                "&:hover": { bgcolor: "#FFFFFF" },
                            }}
                        >
                            <SearchIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "rgba(255,255,255,0.9)",
                                border: "1px solid #ECECEC",
                                "&:hover": { bgcolor: "#FFFFFF" },
                                "& .MuiSvgIcon-root": {
                                    color: "#6B6B6B",
                                },
                            }}
                        >
                            <FavoriteBorderIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                {/* Swatches */}
                {p.colors?.length ? (
                    <Box sx={{ display: "flex", gap: 1, px: 2, pt: 1.2 }}>
                        {p.colors.slice(0, 4).map((c) => (
                            <Box
                                key={c}
                                sx={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: "999px",
                                    bgcolor: c,
                                    border: "1px solid rgba(17,24,39,0.18)",
                                }}
                            />
                        ))}
                    </Box>
                ) : null}

                {/* Text: brand, tên sản phẩm, giá */}
                <Box sx={{ px: 2, pt: 1.3, pb: 2 }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "#8A8A8A",
                        }}
                    >
                        {p.brand}
                    </Typography>

                    <Typography
                        className="ProductCard-name"
                        sx={{
                            color: "#171717",
                            fontSize: 14,
                            mt: 0.6,
                            fontWeight: 600,
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            borderBottom: "1px solid transparent",
                            paddingBottom: 0.2,
                        }}
                    >
                        {p.name}
                    </Typography>
                    {p.code && p.code !== p.name ? (
                        <Typography
                            sx={{
                                color: "#6B6B6B",
                                fontSize: 12,
                                mt: 0.35,
                            }}
                        >
                            {p.code}
                            {p.frameSize ? `  /  Size: ${p.frameSize}` : ""}
                        </Typography>
                    ) : null}

                    <Typography
                        sx={{
                            mt: 1.1,
                            fontWeight: 700,
                            fontSize: 16,
                            color: "#171717",
                        }}
                    >
                        {formatMoney(p.price)}
                    </Typography>
                </Box>
            </CardActionArea>
        </Card>
    );
}
