import { Navigate, Outlet, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { Typography } from "@mui/material";

export default function RequireAuth() {
  const { currentUser, loadingUserInfo } = useAccount();
  const location = useLocation();
  //location is a object contain the first page that user is initially trying to access
  if (loadingUserInfo) return <Typography>Loading...</Typography>;

  //When user does not login, redirect to login page with the state "from" (location)
  //  contain information which page user want to coming
  //And when user login successfully we can redirect user back to that page
  if (!currentUser) return <Navigate to="/login" state={{ from: location }} />;
  return <Outlet />;
}
