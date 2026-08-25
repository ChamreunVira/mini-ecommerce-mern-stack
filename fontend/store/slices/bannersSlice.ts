import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Banner } from "@/types";

interface BannersState {
  items: Banner[];
}

const initialState: BannersState = {
  items: [
    {
      id: "b1",
      title: "Kdmv: The Revenge",
      description: "Sdach Game Ft. Tena",
      order: 1,
      status: "Active",
      imageColor: "#14532d",
    },
    {
      id: "b2",
      title: "Childhood Nostalgia",
      description: "Childhood sucks!",
      order: 2,
      status: "Active",
      imageColor: "#374151",
    },
    {
      id: "b3",
      title: "Tourist Vs Purist 2.0",
      description: "",
      order: 3,
      status: "Active",
      imageColor: "#78350f",
    },
    {
      id: "b4",
      title: "Kdmv X Tena",
      description: "Limited Edition Collection",
      order: 4,
      status: "Active",
      imageColor: "#1f2937",
    },
  ],
};

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    addBanner: {
      reducer(state, action: PayloadAction<Banner>) {
        state.items.push(action.payload);
      },
      prepare(banner: Partial<Banner> & Pick<Banner, "title">) {
        return {
          payload: {
            id: nanoid(),
            status: "Active",
            order: 0,
            imageColor: "#111827",
            description: "",
            ...banner,
          } as Banner,
        };
      },
    },
    toggleBannerStatus(state, action: PayloadAction<string>) {
      const item = state.items.find((b) => b.id === action.payload);
      if (item) item.status = item.status === "Active" ? "Inactive" : "Active";
    },
  },
});

export const { addBanner, toggleBannerStatus } = bannersSlice.actions;
export default bannersSlice.reducer;