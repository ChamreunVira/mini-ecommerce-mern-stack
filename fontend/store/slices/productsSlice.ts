import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types";

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: [
    {
      id: "p1",
      name: "Equipe Jersey",
      basePrice: 38.0,
      discount: 0,
      category: "Unisex",
      collection: "No Collection",
      stock: 750,
      code: "03580442085",
      status: "In Stock",
      image: "jersey",
      imageColor: "#1e3a8a",
    },
    {
      id: "p2",
      name: "Test Product V2",
      basePrice: 40.0,
      discount: 0,
      category: "Men",
      collection: "Childhood Nostalgia",
      stock: 30,
      code: "07624007510",
      status: "Deleted",
      image: "tshirt",
      imageColor: "#6b7280",
    },
    {
      id: "p3",
      name: "KADOR THOM BOXER",
      basePrice: 499.99,
      discount: 80,
      category: "Men",
      collection: "Childhood Nostalgia",
      stock: 99,
      code: "06762440380",
      status: "In Stock",
      image: "boxer",
      imageColor: "#111827",
    },
    {
      id: "p4",
      name: "Test Product V1",
      basePrice: 50.0,
      discount: 0,
      category: "Unisex",
      collection: "No Collection",
      stock: 50,
      code: "02759012680",
      status: "Deleted",
      image: "tshirt",
      imageColor: "#9ca3af",
    },
    {
      id: "p5",
      name: "Kdüssy Hoodie",
      basePrice: 42.0,
      discount: 0,
      category: "Unisex",
      collection: "No Collection",
      stock: 250,
      code: "07659430760",
      status: "In Stock",
      image: "hoodie",
      imageColor: "#3b2a20",
    },
    {
      id: "p6",
      name: "Kdüssy Tees",
      basePrice: 30.0,
      discount: 0,
      category: "Unisex",
      collection: "No Collection",
      stock: 99,
      code: "03219416659",
      status: "In Stock",
      image: "tshirt",
      imageColor: "#111827",
    },
    {
      id: "p7",
      name: "PCMKR CENSORSHIP V2 TEES",
      basePrice: 30.0,
      discount: 0,
      category: "Unisex",
      collection: "Tourist Vs Purist",
      stock: 400,
      code: "08379922274",
      status: "In Stock",
      image: "tshirt",
      imageColor: "#f5f5f0",
    },
    {
      id: "p8",
      name: "PCMKR NAGA HOODIE",
      basePrice: 50.0,
      discount: 0,
      category: "Unisex",
      collection: "Tourist Vs Purist",
      stock: 250,
      code: "00057073031",
      status: "In Stock",
      image: "hoodie",
      imageColor: "#1f2937",
    },
    {
      id: "p9",
      name: "PCMKR NAGA TEES",
      basePrice: 32.0,
      discount: 0,
      category: "Unisex",
      collection: "Tourist Vs Purist",
      stock: 300,
      code: "05123998410",
      status: "In Stock",
      image: "tshirt",
      imageColor: "#111827",
    },
    {
      id: "p10",
      name: "Kdmv X Tena Cap",
      basePrice: 22.0,
      discount: 0,
      category: "Unisex",
      collection: "Kdmv X Tena",
      stock: 120,
      code: "09918823741",
      status: "In Stock",
      image: "cap",
      imageColor: "#0f172a",
    },
  ],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: {
      reducer(state, action: PayloadAction<Product>) {
        state.items.unshift(action.payload);
      },
      prepare(product: Partial<Product> & Pick<Product, "name" | "basePrice" | "category" | "stock" | "code">) {
        return {
          payload: {
            id: nanoid(),
            status: "In Stock",
            discount: 0,
            collection: "No Collection",
            image: "tshirt",
            imageColor: "#111827",
            ...product,
          } as Product,
        };
      },
    },
    removeProduct(state, action: PayloadAction<string>) {
      const item = state.items.find((p) => p.id === action.payload);
      if (item) item.status = "Deleted";
    },
  },
});

export const { addProduct, removeProduct } = productsSlice.actions;
export default productsSlice.reducer;
