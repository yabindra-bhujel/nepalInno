import axios from "axios";

const BaseUrl = () => {
  return `http://localhost:8000/api/`;
};

const instance = axios.create({
  baseURL: BaseUrl(),
});

instance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;

