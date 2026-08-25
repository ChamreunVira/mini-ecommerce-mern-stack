import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { UserItem } from "@/types";

interface UsersState {
  items: UserItem[];
}

const initialState: UsersState = {
  items: [
    {
      id: "u1",
      firstname: "Tena",
      lastname: "Khimphun",
      email: "thannsopheakboth@gmail.com",
      isAdmin: true,
      avatar: null,
    },
    {
      id: "u2",
      firstname: "Thann",
      lastname: "Sopheakboth",
      email: "boththann76@gmail.com",
      isAdmin: true,
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
      prepare(user: Partial<UserItem> & Pick<UserItem, "firstname" | "lastname" | "email">) {
        return {
          payload: {
            id: nanoid(),
            isAdmin: true,
            avatar: null,
            ...user,
          } as UserItem,
        };
      },
    },
  },
});

export const { addAdmin } = usersSlice.actions;
export default usersSlice.reducer;
