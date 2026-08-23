import { createSlice } from "@reduxjs/toolkit";
import { CurrentUser } from "@/types";

interface AuthState {
  currentUser: CurrentUser;
}

const initialState: AuthState = {
  currentUser: {
    id: "u2",
    firstName: "Chamreun",
    lastName: "Vira",
    email: "boththann76@gmail.com",
    telephone: "013222123",
    role: "ADMIN",
    avatar: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export default authSlice.reducer;
