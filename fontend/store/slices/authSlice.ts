import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentUser } from "@/types";

interface AuthState {
  currentUser: CurrentUser | null;
  token: string | null;
}

const initialState: AuthState = {
  token: "mock-jwt-token-12345",
  currentUser: {
    id: "u2",
    firstName: "Chamreun",
    lastName: "Vira",
    email: "boththann76@gmail.com",
    telephone: "013222123",
    role: "ADMIN",
    isAdmin: true,
    avatar: null,
    addresses: [],
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: CurrentUser; token: string }>,
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
