import useSWR, { useSWRConfig } from "swr";
import { axiosPrivate } from "../config/axios";

const useAxiosSWR = (route: string, method: string) => {
  const controller = new AbortController();
  const fetcher = {
    get: (url: string) =>
      axiosPrivate.get(url, { signal: controller.signal }).then((res) => res.data),
    post: (url: string) =>
      axiosPrivate.post(url, { signal: controller.signal }).then((res) => res.data),
    patch: (url: string) =>
      axiosPrivate.patch(url, { signal: controller.signal }).then((res) => res.data),
    put: (url: string) =>
      axiosPrivate.put(url, { signal: controller.signal }).then((res) => res.data),
    delete: (url: string) =>
      axiosPrivate.delete(url, { signal: controller.signal }).then((res) => res.data),
  };

  return useSWR;
};

export default useAxiosSWR;
