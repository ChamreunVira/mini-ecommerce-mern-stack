import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { UserItem } from "@/types";

interface UsersState {
  items: UserItem[];
}

const initialState: UsersState = {
  items: [
    {
      id: "u1",
      name: "Tena Khimphun",
      email: "thannsopheakboth@gmail.com",
      phone: "TEMP_1757652256439",
      role: "ADMIN",
      avatar: null,
    },
    {
      id: "u2",
      name: "Thann Sopheakboth",
      email: "boththann76@gmail.com",
      phone: "013222123",
      role: "ADMIN",
      avatar: "profile",
    },
  ],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addAdmin: {
      reducer(state, action: PayloadAction<UserItem>) {
        state.items.push(action.payload);
      },
      prepare(user: Partial<UserItem> & Pick<UserItem, "name" | "email">) {
        return {
          payload: {
            id: nanoid(),
            role: "ADMIN",
            avatar: null,
            phone: "",
            ...user,
          } as UserItem,
        };
      },
    },
  },
});

export const { addAdmin } = usersSlice.actions;
export default usersSlice.reducer;
