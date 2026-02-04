import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import { useLocation, useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

type LoginResponse = {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export const useAccount = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  // After user logs in we now store JWT and then fetch user-info using Authorization header
  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      const response = await agent.post<LoginResponse>("/login", {
        email: creds.email,
        password: creds.password,
        twoFactorCode: null,
        twoFactorRecoveryCode: null,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
    },
    onSuccess: async () => {
      await queryClient.fetchQuery({
        queryKey: ["user"],
      });
    },
  });

  const registerUser = useMutation({
    mutationFn: async (creds: RegisterSchema) => {
      await agent.post("/account/register", creds);
    },
    onSuccess: () => {
      toast.success("Register successful - you can now login");
      navigate("/collections");
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      // Optional: also call backend logout if available
      try {
        await agent.post("/account/logout");
      } catch {
        // ignore backend logout errors; client will still clear auth state
      }
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["activities"] });
      navigate("/");
    },
  });

  //if we don't set the query to enabled -> default value is true
  //  it will re run hook (re run useQuery) every time component re renders, every time useAccount is called
  //And this may be go to api and fetch user info again and again if state of query is stale
  // we don't want that because we just want to fetch user info once when app loads
  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      console.log("USER_INFO from backend:", response.data);
      return response.data;
    },
    //it mean that if we already have user data in cache we don't need to run this query again and the path is not /register
    // enabled:
    //   !queryClient.getQueryData(["user"]) && location.pathname !== "/register",
    //   && location.pathname !== "/login"
    //When user login, we need to fetch user info and store it in state,
    //  if disable location.pathname !== "/login" then the loginUser
    // will not work properly if we are using invalidateQueries (not fetch immediately),
    //  <RequireAuth> will redirect user to login page forever
    //  instead of letting user access /activities page

    //In this case it mean that if we already have user data in cache we don't need to run this query again
    //  and the path is not /register and the path is not /login
    enabled:
      !queryClient.getQueryData(["user"]) &&
      location.pathname !== "/register" &&
      location.pathname !== "/login",
  });

  return { loginUser, registerUser, currentUser, logoutUser, loadingUserInfo };
};
