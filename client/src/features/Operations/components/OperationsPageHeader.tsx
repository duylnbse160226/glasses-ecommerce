import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface OperationsPageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  rightSlot?: ReactNode;
}

export function OperationsPageHeader({
  title,
  subtitle,
  eyebrow = "Operations center",
  rightSlot,
}: OperationsPageHeaderProps) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {eyebrow}
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            fontSize: { xs: 22, md: 26 },
            fontWeight: 900,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{
              mt: 0.5,
              color: "text.secondary",
              fontSize: 14,
              maxWidth: 560,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {rightSlot && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1.5,
            minWidth: { xs: "100%", md: "auto" },
          }}
        >
          {rightSlot}
        </Box>
      )}
    </Box>
  );
}

