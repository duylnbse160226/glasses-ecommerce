import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  Radio,
  IconButton,
} from "@mui/material";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import type { AddressDto } from "../../../lib/types/address";

export interface SavedAddressPickerProps {
  addresses: AddressDto[];
  selectedId: string | null;
  onSelect(address: AddressDto): void;
}

export function SavedAddressPicker({ addresses, selectedId, onSelect }: SavedAddressPickerProps) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(false);

  // Deduplicate by composite key, keep newest (by createdAt)
  const deduped = useMemo(() => {
    const map = new Map<string, AddressDto>();
    for (const addr of addresses) {
      const key = [
        addr.recipientPhone,
        addr.venue,
        addr.ward,
        addr.district,
        addr.city,
        addr.postalCode ?? "",
      ]
        .join("|")
        .toLowerCase();

      const existing = map.get(key);
      if (!existing) {
        map.set(key, addr);
        continue;
      }
      const existingTime = existing.createdAt ? Date.parse(existing.createdAt) : 0;
      const currentTime = addr.createdAt ? Date.parse(addr.createdAt) : 0;
      if (currentTime > existingTime) {
        map.set(key, addr);
      }
    }
    return Array.from(map.values());
  }, [addresses]);

  const filtered = useMemo(() => {
    if (!search.trim()) return deduped;
    const q = search.toLowerCase();
    return deduped.filter((addr) => {
      const haystack = [
        addr.recipientName,
        addr.recipientPhone,
        addr.venue,
        addr.ward,
        addr.district,
        addr.city,
        addr.postalCode ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [deduped, search]);

  const maxVisibleCollapsed = 3;
  const visible = expanded ? filtered : filtered.slice(0, maxVisibleCollapsed);

  return (
    <Box
      sx={{
        borderRadius: 2,
        bgcolor: "#FAFAF8",
        p: 1.5,
        mb: 2,
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#171717" }}>
          Saved addresses ({deduped.length})
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {deduped.some((a) => a.isDefault) && (
            <Chip
              label="Default"
              size="small"
              sx={{
                height: 22,
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 600,
                bgcolor: "rgba(182,140,90,0.12)",
                color: "#7A5A33",
              }}
            />
          )}
          <IconButton size="small">
            <AddLocationAltIcon sx={{ fontSize: 18, color: "#B68C5A" }} />
          </IconButton>
        </Box>
      </Stack>

      <TextField
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, phone or address..."
        fullWidth
        sx={{
          mb: 1.5,
          "& .MuiOutlinedInput-root": {
            borderRadius: 1.5,
            fontSize: 13,
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "rgba(0,0,0,0.08)" },
            "&:hover fieldset": { borderColor: "#B68C5A" },
            "&.Mui-focused fieldset": { borderColor: "#B68C5A", borderWidth: 1 },
          },
        }}
      />

      {filtered.length === 0 ? (
        <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)", mt: 0.5 }}>
          No saved addresses yet.
        </Typography>
      ) : (
        <Box
          sx={{
            maxHeight: 240,
            overflowY: "auto",
            pr: 0.5,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(0,0,0,0.16)",
              borderRadius: 999,
            },
          }}
        >
          {visible.map((addr) => {
            const isSelected = selectedId === addr.id;
            return (
              <Paper
                key={addr.id}
                variant="outlined"
                onClick={() => onSelect(addr)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: 72,
                  borderRadius: 1.5,
                  borderColor: isSelected ? "#B68C5A" : "rgba(0,0,0,0.08)",
                  boxShadow: isSelected ? "0 8px 20px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#B68C5A",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 3,
                    bgcolor: isSelected ? "#B68C5A" : "transparent",
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    px: 1.25,
                    py: 1.25,
                    bgcolor: isSelected ? "rgba(182,140,90,0.04)" : "#FFFFFF",
                    gap: 1.25,
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Radio
                      checked={isSelected}
                      size="small"
                      sx={{
                        p: 0,
                        "&.Mui-checked": {
                          color: "#B68C5A",
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#171717",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {addr.recipientName} • {addr.recipientPhone}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "rgba(0,0,0,0.55)",
                        mt: 0.25,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {addr.venue}, {addr.ward}, {addr.district}, {addr.city}{" "}
                      {addr.postalCode ?? ""}
                    </Typography>
                  </Box>
                  {addr.isDefault && (
                    <Chip
                      label="Default"
                      size="small"
                      sx={{
                        height: 22,
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: "rgba(182,140,90,0.12)",
                        color: "#7A5A33",
                      }}
                    />
                  )}
                </Box>
              </Paper>
            );
          })}
          {filtered.length > maxVisibleCollapsed && (
            <Box sx={{ mt: 0.5, textAlign: "right" }}>
              <Typography
                component="button"
                type="button"
                onClick={() => setExpanded((v) => !v)}
                sx={{
                  border: "none",
                  background: "none",
                  p: 0,
                  m: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#B68C5A",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {expanded ? "Collapse" : `Show all (${filtered.length})`}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

