"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Ensure you import jwtDecode properly
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // To check if we're on the client side
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth,
  );
  const authState = useSelector((state: RootState) => state.auth);
  const token = localStorage.getItem("token");
  const tokenExpiry = localStorage.getItem("tokenExpiry");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Skip the router logic if we're not on the client side

    // Check if token exists and is valid
    if (token && tokenExpiry) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now();

        if (currentTime >= Number(tokenExpiry) || !decodedToken) {
          console.log("Token is expired or invalid");
          // Token is expired or invalid
          dispatch(logout()); // Log out and clear the state
          router.push("/auth/signin"); // Redirect to login
        } else {
          // Token is valid, continue loading
          setLoading(false);
        }
      } catch (error) {
        console.log("Guard " + error);
        // If decoding the token fails, log out the user
        dispatch(logout());
        router.push("/auth/signin");
      }
    } else {
      // No token found, redirect to login
      dispatch(logout());
      router.push("/auth/signin");
    }
  }, [token, tokenExpiry, dispatch, router, isClient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthGuard;
