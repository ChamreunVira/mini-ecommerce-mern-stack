import { http } from "../axios"

const endPoin = "/categories"

export const categoryService = {
    getAll: async () => {
        const response = await http.get(endPoin);
        return response.data;
    }
}