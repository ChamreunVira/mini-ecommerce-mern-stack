import axios from "axios";

const BASE_URL = "http://localhost:500/api";

export const http =  axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

