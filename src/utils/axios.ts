import axios from "axios";

export default axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_BACK,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_BACK,
  headers: { "Content-Type": "application/json" },
});

export const axiosPrivateMultipart = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_BACK,
  headers: { "Content-Type": "multipart/form-data" },
});
