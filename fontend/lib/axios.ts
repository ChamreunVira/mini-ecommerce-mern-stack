import axios, { AxiosResponse } from "axios";
import { error } from "node:console";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

http.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error) => error
);