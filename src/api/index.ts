import axios from "axios";

const axiosApiInstance = axios.create();
axiosApiInstance.defaults.headers.common["Content-Type"] = "application/json";

axiosApiInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log("================interceptors error====================");
    console.log(originalRequest);
    console.log("====================================");
    return error.response;
  }
);

export const Axios = axiosApiInstance;
