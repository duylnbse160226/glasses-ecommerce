import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSearchParams } from "react-router-dom";
import { useStaffOrder, useStaffOrders, useUpdateStaffOrderStatus } from "../../../lib/hooks/useStaffOrders";
import type { StaffOrderDto, StaffOrderDetailDto } from "../../../lib/types/staffOrders";

function getStatusColors(status: string) {
  switch (status) {
    case "Pending":
      return { border: "#8b5cf6", bg: "rgba(139,92,246,0.12)", color: "#5b21b6" };
    case "Confirmed":
      return { border: "#0ea5e9", bg: "rgba(14,165,233,0.12)", color: "#0369a1" };
    case "Cancelled":
      return { border: "#94a3b8", bg: "rgba(148,163,184,0.18)", color: "#475569" };
    default:
      return { border: "rgba(148,163,184,0.8)", bg: "rgba(148,163,184,0.18)", color: "#475569" };
  }
}

function SalesOrderRow({ summary }: { summary: StaffOrderDto }) {
  const [expanded, setExpanded] = useState(false);
  const updateStatus = useUpdateStaffOrderStatus();
  const { data, isLoading } = useStaffOrder(expanded ? summary.id : undefined);
  const detail = data as StaffOrderDetailDto | undefined;
  const { border, bg, color } = getStatusColors(summary.orderStatus);
  const isPending = summary.orderStatus === "Pending";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        px: 3,
        py: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.25,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Typography sx={{ fontWeight: 700 }}>Order ID: {summary.id}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {isPending && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                size="small"
                disabled={updateStatus.isPending}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "#16a34a",
                  "&:hover": { bgcolor: "#15803d" },
                }}
                onClick={() =>
                  updateStatus.mutate({
                    id: summary.id,
                    newStatus: 1,
                  })
                }
              >
                Confirm
              </Button>
              <Button
                variant="outlined"
                size="small"
                disabled={updateStatus.isPending}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2,
                  borderColor: "#dc2626",
                  color: "#dc2626",
                  "&:hover": { borderColor: "#b91c1c", bgcolor: "rgba(220,38,38,0.04)" },
                }}
                onClick={() =>
                  updateStatus.mutate({
                    id: summary.id,
                    newStatus: 6,
                  })
                }
              >
                Reject
              </Button>
            </Stack>
          )}
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: `1px solid ${border}`,
              bgcolor: bg,
              color,
              fontSize: 12,
              fontWeight: 700,
              textTransform: "capitalize",
            }}
          >
            {summary.orderStatus}
          </Box>
          <IconButton size="small" onClick={() => setExpanded((e) => !e)} aria-label={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          fontSize: 13,
          color: "text.secondary",
        }}
      >
        <Typography sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <b>Source:</b>
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: "1px solid #22c55e",
              bgcolor: "rgba(34,197,94,0.12)",
              color: "#15803d",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {summary.orderSource}
          </Box>
        </Typography>
        <Typography sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <b>Type:</b>
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 1,
              border: "1px solid #0ea5e9",
              bgcolor: "rgba(14,165,233,0.12)",
              color: "#0369a1",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {summary.orderType}
          </Box>
        </Typography>
        <Typography>
          <b>Items:</b> {summary.itemCount}
        </Typography>
        <Typography>
          <b>Created:</b> {new Date(summary.createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Total amount</Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
          {summary.finalAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </Typography>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 1.5 }} />
        {isLoading || !detail ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Loading detail...</Typography>
        ) : (
          <Box sx={{ fontSize: 13, color: "text.secondary", display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography sx={{ fontWeight: 700, color: "text.primary" }}>Items</Typography>
            {detail.items.map((item) => {
              const lineTotal = item.totalPrice ?? item.unitPrice * item.quantity;
              return (
                <Box
                  key={item.id}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: "text.primary" }}>{item.productName}</Typography>
                    <Typography>
                      {item.variantName} · Qty {item.quantity}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600 }}>
                    {lineTotal.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                  </Typography>
                </Box>
              );
            })}
            {detail.payment && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography sx={{ fontWeight: 700, color: "text.primary" }}>Payment</Typography>
                <Typography>
                  <b>Method:</b> {detail.payment.paymentMethod}
                </Typography>
                <Typography>
                  <b>Status:</b> {detail.payment.paymentStatus}
                </Typography>
                <Typography>
                  <b>Amount:</b>{" "}
                  {detail.payment.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </Typography>
              </>
            )}
            {detail.statusHistories && detail.statusHistories.length > 0 && (
              <>
                <Divider sx={{ my: 1.5 }} />
                <Typography sx={{ fontWeight: 700, color: "text.primary" }}>Status history</Typography>
                {detail.statusHistories.map((h, idx) => (
                  <Box key={idx}>
                    <Typography>
                      {h.fromStatus} → <b>{h.toStatus}</b>
                    </Typography>
                    <Typography sx={{ fontSize: 12 }}>
                      {h.notes ? `${h.notes} · ` : ""}
                      {new Date(h.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export function OrdersScreen() {
  const [searchParams] = useSearchParams();

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const rawStatus = searchParams.get("status") ?? "Pending";
  const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];
  const statusFilter = allowedStatuses.includes(rawStatus) ? rawStatus : "Pending";

  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter]);

  const { data, isLoading } = useStaffOrders({ pageNumber, pageSize, status: statusFilter });
  const safeOrders = Array.isArray(data?.items) ? data!.items : [];
  const filteredOrders = safeOrders.filter((o) => o.orderStatus === statusFilter);
  const meta = data ? { totalPages: data.totalPages } : null;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4, lg: 6 },
        py: 4,
        height: "calc(100vh - 56px)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography sx={{ fontSize: 24, fontWeight: 900, mb: 2 }}>
        Orders
      </Typography>

      {isLoading ? (
        <Box sx={{ maxWidth: 720, mx: "auto", mt: 2 }}>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      ) : filteredOrders.length === 0 ? (
        <Box sx={{ maxWidth: 720, mx: "auto", mt: 3 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.08)",
              px: 3,
              py: 4,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">No orders yet.</Typography>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 2,
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              pr: { md: 1 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {filteredOrders.map((o) => (
              <SalesOrderRow key={o.id} summary={o} />
            ))}
          </Box>

          {meta && meta.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, pt: 1 }}>
              <Pagination
                count={meta.totalPages}
                page={pageNumber}
                onChange={(_, page) => setPageNumber(page)}
                color="primary"
                size="small"
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
