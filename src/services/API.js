import axios from "axios";

const api = axios.create({
  // baseURL: process.env.REACT_APP_BASE_API_URL,
  baseURL: "http://superecruiterusermanagerphase01hk-env.eba-qcp3rdm9.ap-east-1.elasticbeanstalk.com/api/v1/",
});

const responseBody = (res) => res.data;
const errResponse = (err) => {
  throw err;
};

const API = {
  get: (URL) => api.get(`${URL}`).then(responseBody, errResponse),
  getWithReqBody: (URL, reqBody) =>
    api.get(`${URL}`, reqBody).then(responseBody, reqBody),
  post: (URL, reqBody) =>
    api.post(`${URL}`, reqBody).then(responseBody, errResponse),
  put: (URL, reqBody) =>
    api.put(`${URL}`, reqBody).then(responseBody, errResponse),
  patch: (URL, reqBody) =>
    api.patch(`${URL}`, reqBody).then(responseBody, errResponse),
  delete: (URL) => api.delete(`${URL}`).then(responseBody, errResponse),
};

export default API;
