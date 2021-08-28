import * as MatchingServices from "services/Matching";
import * as JobServices from "services/Jobs";

export const GetMatches = async () => {
  let { count: JobCount } = await JobServices.GetJobsCount({});
  let jobs = await JobServices.GetJobs({ page: 0, size: JobCount });

  let MatchingActivities = jobs.map(async (job) => {
    const { count } = await MatchingServices.GetMatchingActivitiesCount(job.id);

    let matchingActivity = await MatchingServices.GetMatchingActivities({
      jobId: job.id,
      page: 0,
      size: count,
    });
    return matchingActivity;
  });

  let fulfilled = await Promise.all(MatchingActivities).then((res) => res);

  fulfilled = [].concat.apply([], fulfilled);

  console.log(fulfilled);
};
