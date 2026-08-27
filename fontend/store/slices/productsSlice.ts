import { createSlice, isFulfilled, isPending, isRejected, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

// const initialState: ProductsState = {
//   items: [
//     {
//       id: "p1",
//       name: "Equipe Jersey",
//       description: "Lightweight performance jersey for everyday wear.",
//       price: 38.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 750,
//       images: [],
//       variants: [
//         { id: "v1a", color: "Navy", size: "S",  price: 38.0, quantity: 120, images: [] },
//         { id: "v1b", color: "Navy", size: "M",  price: 38.0, quantity: 220, images: [] },
//         { id: "v1c", color: "Navy", size: "L",  price: 38.0, quantity: 200, images: [] },
//         { id: "v1d", color: "Navy", size: "XL", price: 38.0, quantity: 210, images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#1e3a8a",
//     },
//     {
//       id: "p2",
//       name: "Test Product V2",
//       description: "A test product — archived.",
//       price: 40.0,
//       discount: 0,
//       category: "Men",
//       quantity: 30,
//       images: [],
//       variants: [],
//       status: "Deleted",
//       imageColor: "#6b7280",
//     },
//     {
//       id: "p3",
//       name: "KADOR THOM BOXER",
//       description: "Original Kador Thom boxers — limited run with 80% discount.",
//       price: 499.99,
//       discount: 80,
//       category: "Men",
//       quantity: 99,
//       images: [],
//       variants: [
//         { id: "v3a", color: "Black", size: "S",  price: 99.99, quantity: 30, images: [] },
//         { id: "v3b", color: "Black", size: "M",  price: 99.99, quantity: 39, images: [] },
//         { id: "v3c", color: "Black", size: "L",  price: 99.99, quantity: 30, images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#111827",
//     },
//     {
//       id: "p4",
//       name: "Test Product V1",
//       description: "Legacy test product — archived.",
//       price: 50.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 50,
//       images: [],
//       variants: [],
//       status: "Deleted",
//       imageColor: "#9ca3af",
//     },
//     {
//       id: "p5",
//       name: "Kdüssy Hoodie",
//       description: "Premium heavyweight hoodie in signature Kdüssy brown.",
//       price: 42.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 250,
//       images: [],
//       variants: [
//         { id: "v5a", color: "Brown", size: "S",  price: 42.0, quantity: 60,  images: [] },
//         { id: "v5b", color: "Brown", size: "M",  price: 42.0, quantity: 80,  images: [] },
//         { id: "v5c", color: "Brown", size: "L",  price: 42.0, quantity: 70,  images: [] },
//         { id: "v5d", color: "Brown", size: "XL", price: 42.0, quantity: 40,  images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#3b2a20",
//     },
//     {
//       id: "p6",
//       name: "Kdüssy Tees",
//       description: "Classic Kdüssy graphic tee in black.",
//       price: 30.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 99,
//       images: [],
//       variants: [
//         { id: "v6a", color: "Black", size: "S",  price: 30.0, quantity: 25, images: [] },
//         { id: "v6b", color: "Black", size: "M",  price: 30.0, quantity: 35, images: [] },
//         { id: "v6c", color: "Black", size: "L",  price: 30.0, quantity: 25, images: [] },
//         { id: "v6d", color: "Black", size: "XL", price: 30.0, quantity: 14, images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#111827",
//     },
//     {
//       id: "p7",
//       name: "PCMKR CENSORSHIP V2 TEES",
//       description: "Bold censorship graphic tee from the Tourist Vs Purist drop.",
//       price: 30.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 400,
//       images: [],
//       variants: [
//         { id: "v7a", color: "Off-White", size: "S",  price: 30.0, quantity: 100, images: [] },
//         { id: "v7b", color: "Off-White", size: "M",  price: 30.0, quantity: 130, images: [] },
//         { id: "v7c", color: "Off-White", size: "L",  price: 30.0, quantity: 110, images: [] },
//         { id: "v7d", color: "Off-White", size: "XL", price: 30.0, quantity: 60,  images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#f5f5f0",
//     },
//     {
//       id: "p8",
//       name: "PCMKR NAGA HOODIE",
//       description: "Naga serpent graphic hoodie — Tourist Vs Purist collection.",
//       price: 50.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 250,
//       images: [],
//       variants: [
//         { id: "v8a", color: "Charcoal", size: "S",  price: 50.0, quantity: 60,  images: [] },
//         { id: "v8b", color: "Charcoal", size: "M",  price: 50.0, quantity: 80,  images: [] },
//         { id: "v8c", color: "Charcoal", size: "L",  price: 50.0, quantity: 70,  images: [] },
//         { id: "v8d", color: "Charcoal", size: "XL", price: 50.0, quantity: 40,  images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#1f2937",
//     },
//     {
//       id: "p9",
//       name: "PCMKR NAGA TEES",
//       description: "Naga graphic tee — Tourist Vs Purist collection.",
//       price: 32.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 300,
//       images: [],
//       variants: [
//         { id: "v9a", color: "Black", size: "S",  price: 32.0, quantity: 75,  images: [] },
//         { id: "v9b", color: "Black", size: "M",  price: 32.0, quantity: 100, images: [] },
//         { id: "v9c", color: "Black", size: "L",  price: 32.0, quantity: 85,  images: [] },
//         { id: "v9d", color: "Black", size: "XL", price: 32.0, quantity: 40,  images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#111827",
//     },
//     {
//       id: "p10",
//       name: "Kdmv X Tena Cap",
//       description: "Structured six-panel cap from the Kdmv X Tena collab.",
//       price: 22.0,
//       discount: 0,
//       category: "Unisex",
//       quantity: 120,
//       images: [],
//       variants: [
//         { id: "v10a", color: "Black", size: "M", price: 22.0, quantity: 60, images: [] },
//         { id: "v10b", color: "Black", size: "L", price: 22.0, quantity: 60, images: [] },
//       ],
//       status: "In Stock",
//       imageColor: "#0f172a",
//     },
//   ],
// };

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: {
      reducer(state, action: PayloadAction<Product>) {
        state.products.unshift(action.payload);
      },
      prepare(product: Partial<Product> & Pick<Product, "name" | "price" | "category" | "quantity">) {
        return {
          payload: {
            id: nanoid(),
            status: "In Stock",
            discount: 0,
            images: [],
            variants: [],
            imageColor: "#111827",
            ...product,
          } as Product,
        };
      },
    },
    removeProduct(state, action: PayloadAction<string>) {
      const item = state.products.find((p) => p.id === action.payload);
      if (item) item.status = "Deleted";
    },
  },

  extraReducers: (builder) => {
    builder
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      })
  },
});

export const { addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
