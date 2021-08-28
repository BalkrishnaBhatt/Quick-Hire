import { Badge, Avatar } from "@windmill/react-ui";
import { useSelector } from "react-redux";

const JobProfile = (props) => {

  let activeJob = useSelector((state) => state.jobs.activeJob)
  let activeJobMatching = props.activeJob

  var {
    jobTitle,
    createdTime,
    lastUpdated,
    id,
    roleName,
    location,
    minYearsOfExp,
    maxYearsOfExp,
    minBudget,
    maxBudget,
    descriptions,
    skillsRequirements,
    jobStatus,
    ranking,
  } = props.page == "matching" ? activeJobMatching : activeJob


  let budget = "No budget specified";
  if (minBudget != null && maxBudget != null) {
    budget = `${minBudget} - ${maxBudget}`;
  }

  let yearsOfExp = "No years of experience specified";
  if (minYearsOfExp != null && maxYearsOfExp != null) {
    yearsOfExp = `${minYearsOfExp}  to ${maxYearsOfExp}`;
  }

  return (
    <div className="px-8 py-8" style={{ overflowWrap: 'break-word' }}>
      <div className="flex justify-between">
        <div>
          <span className="font-bold">{jobTitle}</span>

          <Badge
            type={jobStatus === "ACTIVE" ? "success" : "danger"}
            className="ml-4"
          >
            {jobStatus}
          </Badge>
          <span className="text-xs text-gray-600 block">Job #{id}</span>
          <span className="text-xs text-gray-600 block">
            Created on: {new Date(createdTime).toString()}
          </span>
          <span className="text-xs text-gray-600 block">
            Updated on: {new Date(lastUpdated).toString()}
          </span>
          <div className="mt-2">
            <span className="text-xs text-gray-600 block">
              Title: {jobTitle}
            </span>
          </div>
        </div>

        {/*
        <div>
          <Avatar
            className="align-middle w-20 h-20"
            src="https://g.foolcdn.com/art/companylogos/square/jpm.png"
            alt=""
            aria-hidden="true"
          />
        </div>
        */}
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">Requirements</span>
        <span className="text-xs text-gray-600 block mt-2">
          Level: {ranking || "No level specified"}
        </span>
        <span className="text-xs text-gray-600 block">Budgets: {budget}</span>
        <span className="text-xs text-gray-600 block">
          Location: {location || "No location specified"}
        </span>
        <span className="text-xs text-gray-600 block">
          Year/s of experience: {yearsOfExp}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">Descriptions</span>
        <p className="text-xs text-gray-600 mt-2">
          {descriptions || "No description"}
        </p>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">Required Skills</span>
        <p className="text-xs text-gray-600 mt-2">
          {skillsRequirements || "No skill requirements specified"}
        </p>
      </div>
    </div>
  );
};

export default JobProfile;
