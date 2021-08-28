import API from "./API";

const SearchQuery = (q) => {
  if (q) {
    return `title=${q}&first-name=${q}&last-name=${q}&phone=${q}&email=${q}`;
  }
};

export const GetTalentsCount = ({ search = "" }) =>
  API.get(`/talents/count?searchKeyword=${search}`);

export const GetTalents = ({ page = 0, size = 10, search = "" }) =>
  API.get(`/talents?page=${page}&size=${size}&searchKeyword=${search}`);

export const GetSpecificTalent = (id) => API.get(`/talents/${id}`);

export const CreateTalent = (reqBody) => API.post("/talents", reqBody);
export const UpdateTalent = (reqBody) => API.put("/talents", reqBody);

export const DeleteTalent = (id) => API.delete(`/talents/${id}`);

export const UploadResumeToParser = (reqBody) =>
  API.post("/talents/resume", reqBody);

export const CheckDeleteFileError = (data) => 
  API.post(`/talents/profile/${data.id}`, data.deleteFiles);

export const CheckLatestResumeFileError = (data) => 
  API.get(`/talents/profile/resume/check/${data.id}`)