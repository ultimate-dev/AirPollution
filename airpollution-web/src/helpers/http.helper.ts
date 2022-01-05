import { API_URL } from "../configs";
import ax from "axios";

const axios = ax.create({
  baseURL: API_URL + "/",
});

axios.interceptors.request.use(
  (config: any) => {
    config.headers.common["x-access-token"] = `Bearer ${localStorage.getItem(
      "userToken"
    )}`;
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

async function post(endpoint: string, data?: any) {
  return await axios.post(endpoint, data).then((res) => {
    return res.data;
  });
}
async function put(endpoint: string, data?: any) {
  return await axios.put(endpoint, data).then((res) => {
    return res.data;
  });
}
async function get(endpoint: string, data?: any) {
  return await axios.get(endpoint, { headers: data }).then((res) => {
    return res.data;
  });
}
async function del(endpoint: string, data?: any) {
  return await axios.delete(endpoint, { headers: data }).then((res) => {
    return res.data;
  });
}

export { post, put, get, del };
