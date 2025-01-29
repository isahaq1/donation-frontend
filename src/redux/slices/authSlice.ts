import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/axiosInstance";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tokenExpiry: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      const { token, isAdmin, status, message } = response.data;
      const decodedToken = jwtDecode(token);

      const tokenExpiry = 5738044606 * 1000;
      const user = response.data.data;
      const { role } = response.data.data;
      localStorage.setItem("roles", JSON.stringify(role));
      localStorage.setItem("isAdmin", isAdmin);
      console.log("user role", role);
      localStorage.setItem("token", token);
      localStorage.setItem(
        "tokenExpiry",
        tokenExpiry ? tokenExpiry.toString() : "",
      );
      localStorage.setItem("authUser", JSON.stringify(user));
      return { token, user, status, message, tokenExpiry };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

export const userRegister = createAsyncThunk(
  "auth/registerUser",
  async (userData: Omit<User, "id">, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "An error occurred",
      );
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("authUser");
      localStorage.removeItem("roles");
      localStorage.removeItem("isAdmin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.tokenExpiry = action.payload.tokenExpiry;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create User
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
