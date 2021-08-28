import API from "./API";

export const GetJobsCount = ({ title = "" }) =>
  API.get(`/jobs/count?title=${title}`);
export const GetJobs = ({ page = 0, size = 10, title = "" }) =>
  API.get(`/jobs?page=${page}&size=${size}&title=${title}`);

export const GetSpecificJob = (id) => API.get(`/jobs/${id}`);

export const CreateJob = (reqBody) => API.post("/jobs", reqBody);
export const UpdateJob = (reqBody) => API.put("/jobs", reqBody);
export const DeleteJob = (id) => API.delete(`/jobs/${id}`);

export const UploadJDToParser = (reqBody) =>
  API.post("/jobs/description", reqBody);
