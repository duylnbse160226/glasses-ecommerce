import {
    Box,
    Drawer,
    Button,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { MOCK_PRODUCTS } from "./data/mockProducts";
import type { FiltersState, Product, SortKey } from "./types";

import { CollectionTopBar } from "./components/CollectionPageComponents/CollectionTopBar";
import { FiltersSidebar } from "./components/CollectionPageComponents/FiltersSidebar";
import { ProductGrid } from "./components/CollectionPageComponents/ProductGrid";
import { EmptyState } from "./components/CollectionPageComponents/EmptyState";
import { PaginationBar } from "./components/CollectionPageComponents/PaginationBar";

/* ================== layout const ================== */
const NAV_H = 56;
const GAP_TOP = 24;
const GAP_BOTTOM = 56;
const FOOT_H = 0;

/** mỗi trang 12 sản phẩm */
const PAGE_SIZE = 12;

/* ================== helpers ================== */
function defaultFilters(): FiltersState {
    return {
        keyword: "",
        glassesTypes: [],
        shapes: [],
        colors: [],
        frameSizes: [],
        materials: [],
        genders: [],
    };
}

/* ================== component ================== */
export default function CollectionPage() {
    const { category } = useParams();

    const [sort, setSort] = useState<SortKey>("featured");
    const [filters, setFilters] = useState<FiltersState>(() => defaultFilters());

    /** pagination */
    const [page, setPage] = useState(1);

    /** drawer filter */
    const [openFilter, setOpenFilter] = useState(false);

    /** scroll top */
    const topRef = useRef<HTMLDivElement | null>(null);

    /* ================== category ================== */
    const allInCategory = useMemo(() => {
        const c = (category || "").toLowerCase();
        if (c === "fashion" || c === "glasses" || c === "lens") {
            return MOCK_PRODUCTS.filter((p) => p.category === c);
        }
        return MOCK_PRODUCTS;
    }, [category]);

    /* ================== filtering + sort ================== */
    const filteredProducts = useMemo(() => {
        let list: Product[] = allInCategory;

        // keyword
        const k = filters.keyword.trim().toLowerCase();
        if (k) {
            list = list.filter((p) =>
                `${p.brand} ${p.name} ${p.code}`.toLowerCase().includes(k)
            );
        }

        // glasses type
        if (filters.glassesTypes.length) {
            list = list.filter((p) =>
                p.category !== "glasses"
                    ? true
                    : p.glassesType
                        ? filters.glassesTypes.includes(p.glassesType)
                        : false
            );
        }

        // shape
        if (filters.shapes.length) {
            list = list.filter((p) =>
                p.category !== "glasses"
                    ? true
                    : p.shape
                        ? filters.shapes.includes(p.shape)
                        : false
            );
        }

        // colors
        if (filters.colors.length) {
            list = list.filter(
                (p) =>
                    p.colors?.length &&
                    filters.colors.some((c) => p.colors!.includes(c))
            );
        }

        // frame size
        if (filters.frameSizes.length) {
            list = list.filter((p) =>
                p.category !== "glasses"
                    ? true
                    : p.frameSize
                        ? filters.frameSizes.includes(p.frameSize)
                        : false
            );
        }

        // materials
        if (filters.materials.length) {
            list = list.filter((p) =>
                p.category !== "glasses"
                    ? true
                    : p.material
                        ? filters.materials.includes(p.material)
                        : false
            );
        }

        // genders
        if (filters.genders.length) {
            list = list.filter((p) =>
                p.category !== "glasses"
                    ? true
                    : p.gender
                        ? filters.genders.includes(p.gender)
                        : false
            );
        }

        // sort
        if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
        if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);

        return list;
    }, [allInCategory, filters, sort]);

    /* ================== reset page ================== */
    useEffect(() => {
        setPage(1);
    }, [category, sort, filters]);

    /* ================== pagination ================== */
    const totalItems = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    const pageProducts = useMemo(() => {
        const safePage = Math.min(page, totalPages);
        const start = (safePage - 1) * PAGE_SIZE;
        return filteredProducts.slice(start, start + PAGE_SIZE);
    }, [filteredProducts, page, totalPages]);

    const handleChangePage = (nextPage: number) => {
        setPage(nextPage);
        requestAnimationFrame(() => {
            topRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };

    /* ================== active filter count ================== */
    const activeFilterCount =
        filters.glassesTypes.length +
        filters.shapes.length +
        filters.colors.length +
        filters.frameSizes.length +
        filters.materials.length +
        filters.genders.length;

    /* ================== render ================== */
    return (
        <Box
            component="main"
            sx={{
                position: "relative",
                left: "50%",
                right: "50%",
                ml: "-50vw",
                mr: "-50vw",
                width: "100vw",
                bgcolor: "#fff",
                pt: `calc(${NAV_H}px + ${GAP_TOP}px)`,
                pb: `calc(${FOOT_H}px + ${GAP_BOTTOM}px)`,
                minHeight: `calc(100vh - ${NAV_H}px - ${FOOT_H}px)`,
                px: { xs: 2, md: 4, lg: 6 },
            }}
        >
            {/* ================== TOP BAR + FILTER BTN ================== */}
            <Box ref={topRef} />

            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
                <CollectionTopBar
                    totalItems={totalItems}
                    sort={sort}
                    setSort={setSort}
                />

                <Button
                    variant="outlined"
                    sx={{
                        color: "black",
                        borderColor: "black",
                        "&:hover": {
                            borderColor: "black",
                            color: "black",
                        },
                        borderRadius: 4,
                    }}
                    onClick={() => setOpenFilter(true)}
                >
                    Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </Button>
            </Box>

            {/* ================== PRODUCTS ================== */}
            <Box sx={{ mt: 3 }}>
                {pageProducts.length ? (
                    <ProductGrid products={pageProducts} />
                ) : (
                    <EmptyState />
                )}
            </Box>

            {/* ================== PAGINATION ================== */}
            {totalItems > 0 && (
                <PaginationBar
                    page={Math.min(page, totalPages)}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={PAGE_SIZE}
                    onChange={handleChangePage}
                />
            )}

            {/* ================== FILTER DRAWER ================== */}
            <Drawer
                variant="temporary"
                anchor="left"
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                ModalProps={{
                    disableScrollLock: true,
                }}
                sx={{
                    "& .MuiDrawer-paper": {
                        top: `${NAV_H}px`,
                        height: `calc(100vh - ${NAV_H}px)`,
                        width: { xs: "90vw", sm: 360 },
                        pt: 2,
                        boxSizing: "border-box",
                    },
                    "& .MuiBackdrop-root": {
                        top: `${NAV_H}px`,
                        height: `calc(100vh - ${NAV_H}px)`,
                    },
                }}
            >
                <FiltersSidebar
                    filters={filters}
                    setFilters={setFilters}
                    onReset={() => setFilters(defaultFilters())}
                    stickyTop={0}
                />
            </Drawer>

        </Box>
    );
}
