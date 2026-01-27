import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import { useLocation, useNavigate } from "react-router";
import type { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  //After user logs in i want to fetch user info to know user already logged in successfully or not
  //Because i can't access to cookies from client side (httpOnly cookies)
  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      await agent.post("/login?useCookies=true", creds);
    },
    onSuccess: async () => {
      //Invalidate user query that force React Query to refetch user info
      //Best practice in react query is using invalidateQueries after mutation that change data
      //But a characteristic of invalidateQueries is not fetch data immediately
      //  unless query is active (component using the query is mounted)
      // -> If query is not active invalidateQueries will just mark the query as stale and not fetch data
      // await queryClient.invalidateQueries({
      //   queryKey: ["user"],
      // });
      //But in this case after login mutation success we need to refetch user info immediately
      //Because <RequireAuth> need to know user is logged in or not to let user access protected routes
      //So if we use invalidateQueries the currentUser value in <RequireAuth> may be still undefined
      //  because the query is not active yet (the component using the query is not mounted yet)
      //  -> user will be redirected to login page even after login successfully
      //So in this case we will use queryClient.fetchQuery to fetch user info immediately after login success

      //In conclusion: The difference between the 2 methods is that invalidateQueries will mark the query as stale,
      //  and if it is currently active it will update immediately otherwise will get the fresh data next time it is used,
      //  the refetch queries is useful when we want to trigger background updates for inactive queries.
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
      navigate("/login");
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: () => {
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
