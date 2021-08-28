import API from "./API";

export const GetJobsForMatching = ({ page = 0, size = 10, keyword = "" }) =>
  API.get(`/jobs/matching?keyword=${keyword}&page=${page}&size=${size}`);

export const GetJobsForMatchingCount = ({ keyword = "" }) =>
  API.get(`/jobs/matching/count?keyword=${keyword}`);

export const GetMatchingActivitiesCount = (jobId) =>
  API.get(`/jobs/matches/activities/count/${jobId}`);

export const GetMatchingActivities = ({ jobId = "", page = 0, size = 10 }) =>
  API.get(`/jobs/matches/activities/${jobId}?page=${page}&size=${size}`);

export const GetMatchedTalents = ({matchId, page, size}) =>
  API.get(`/jobs/matches/talents/${matchId}?page=${page}&size=${size}`);

export const GetMatchedTalentsCount = (matchId) =>
  API.get(`/jobs/matches/activities/talent/count/${matchId}`);

export const GetSearchedMatchedTalentsCount = ({matchId, keyword = ''}) =>
API.get(`/jobs/matches/activities/talent/count/${matchId}?keyword=${keyword}`);

export const GetSearchedMatchedTalents = ({matchId, keyword = '', page = 0, size = 10}) => 
  API.get(`/jobs/matches/talents/${matchId}?keyword=${keyword}&page=${page}&size=${size}`);

export const CreateMatch = ({jobId, criteria}) =>
  API.post(`/jobs/matches/activities/${jobId}`, criteria);

export const GetMatchingActivityDetails = (matchId) =>
  API.get(`/matches/activities/${matchId}`);

export const GetMatchingActivityTalent = (matchingActivityId, page = 0, size = 10) => 
API.get(`/jobs/matches/talents/${matchingActivityId}?page=${page}&size=${size}`);