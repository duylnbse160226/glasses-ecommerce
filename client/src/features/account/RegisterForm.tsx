import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate, Link } from "react-router";

import { Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";

import { useAccount } from "../../lib/hooks/useAccount";
import TextInput from "../../app/shared/components/TextInput";
import {
  registerSchema,
  type RegisterSchema,
} from "../../lib/schemas/registerSchema";

import Image2 from "../../app/assets/jordan-andrews-dca_s9Wy8c0-unsplash.jpg";

export default function RegisterForm() {
  const { registerUser } = useAccount();
  const navigate = useNavigate();

  const imageUrl = Image2;
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    await registerUser.mutateAsync(data, {
      onError: (error) => {
        if (Array.isArray(error)) {
          error.forEach((err) => {
            if (err.includes("Email")) setError("email", { message: err });
            else if (err.includes("Password"))
              setError("password", { message: err });
          });
        }
      },
      onSuccess: () => {
        navigate("/activities");
      },
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
        background:
          "radial-gradient(900px 500px at 10% 10%, rgba(255,219,191,0.55), transparent 60%), linear-gradient(180deg, #FAFAF8, #F1F3F5)",
      }}
    >
      {/* ================= LEFT: FORM ================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 3, sm: 6, md: 10 },
          overflow: "hidden",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: "100%",
            maxWidth: 460,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* 🔙 Back */}
          <Button
            onClick={() => navigate("/collections")}
            startIcon={<ArrowBack />}
            variant="text"
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
              fontWeight: 700,
              px: 0,
              mb: 0.5,
              color: "rgba(15,23,42,0.75)",
              "&:hover": { color: "rgba(15,23,42,0.95)" },
            }}
          >
            Back to collections
          </Button>

          {/* ===== Header ===== */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                pl: "20px",
              }}
            >
              <Box sx={{ width: 34, height: 1, bgcolor: "rgba(15,23,42,0.35)" }} />
              <Typography
                sx={{
                  fontSize: 12,
                  letterSpacing: 4,
                  color: "rgba(15,23,42,0.65)",
                }}
              >
                EYEWEAR ATELIER
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: 34, md: 40 },
                fontWeight: 900,
                letterSpacing: -1.2,
                color: "rgba(15,23,42,0.92)",
              }}
            >
              Create account
            </Typography>
            <Typography sx={{ color: "rgba(15,23,42,0.60)" }}>
              Join us — curated frames and modern silhouettes.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

          {/* ================= INPUTS ================= */}
          {/* ✅ gap 2 → 3 */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
            {/* EMAIL */}
            <Box sx={{ position: "relative" }}>
              {errors.email && (
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: -22,
                    left: 4,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {errors.email.message}
                </Typography>
              )}

              <TextInput
                label="Email"
                control={control}
                name="email"
                hideError
              />
            </Box>

            {/* DISPLAY NAME */}
            <Box sx={{ position: "relative" }}>
              {errors.displayName && (
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: -22,
                    left: 4,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {errors.displayName.message}
                </Typography>
              )}

              <TextInput
                label="Display Name"
                control={control}
                name="displayName"
                hideError
              />
            </Box>

            {/* PASSWORD */}
            <Box sx={{ position: "relative", "& input": { pr: 5 } }}>
              {errors.password && (
                <Typography
                  fontSize={13}
                  fontWeight={600}
                  color="error"
                  sx={{
                    position: "absolute",
                    top: -22,
                    left: 4,
                    whiteSpace: "nowrap",
                    lineHeight: 1.2,
                  }}
                >
                  {errors.password.message}
                </Typography>
              )}

              <TextInput
                label="Password"
                type={showPassword ? "text" : "password"}
                control={control}
                name="password"
                hideError
              />

              <IconButton
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                sx={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(15,23,42,0.55)",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Box>

            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                py: 1.25,
                borderRadius: 999,
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "0 16px 36px rgba(25,118,210,0.18)",
              }}
            >
              {isSubmitting ? "Creating..." : "Sign up"}
            </Button>

            <Typography sx={{ textAlign: "center", color: "rgba(15,23,42,0.65)" }}>
              Already have an account?
              <Typography
                component={Link}
                to="/login"
                sx={{ ml: 1, fontWeight: 900, textDecoration: "none" }}
                color="primary"
              >
                Sign in
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= RIGHT: IMAGE ================= */}
      <Box
        sx={{
          position: "relative",
          display: { xs: "none", md: "block" },
          overflow: "hidden",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.18), rgba(0,0,0,0.18))",
          }}
        />
      </Box>
    </Box>
  );
}
