import { Badge, Avatar } from "@windmill/react-ui";
import { connect } from "react-redux";

import { TalentAvailability } from "helpers/constants";

const TalentProfile = (props) => {
  const {
    talentId,
    talents: {
      activeTalent: {
        firstName,
        lastName,
        availability,
        id,
        createdTime,
        lastUpdated,
        talentImageLink,
        phone,
        linkedIn,
        email,
        twitter,
        location,
        education,
        skills,
        experience,
        title,
        department,
        noticePeriodMonths,
        employmentStatus
      },
    },
  } = props;

  let talentAvailability = TalentAvailability.find(
    (x) => x.value === availability
  );

  const dateCreated = new Date(createdTime);
  const dateUpdated = new Date(lastUpdated);

  let name = `${firstName || ""} ${lastName || ""}`;
  if (!name.trim()) {
    name = "No talent name";
  }

  return (
    <div className="px-8 py-8" style={{ overflowWrap: 'break-word' }}>
      <div className="flex justify-between">
        <div style={{ width: 400, wordWrap: 'break-word' }}>
          <div className="font-bold">{name}
            {availability && (
              talentAvailability !== undefined && (
                <Badge type={talentAvailability.badgeType} className="ml-2">
                  {talentAvailability.text}
                </Badge>
              )
            )}</div>
          <span className="text-xs text-gray-600 block">Talent #{id}</span>
          <span className="text-xs text-gray-600 block">
            Created on: {dateCreated.toString()}
          </span>
          <span className="text-xs text-gray-600 block">
            Updated on: {dateUpdated.toString()}
          </span>
        </div>
        <div>
          <Avatar
            className="align-middle w-20 h-20"
            src={talentImageLink || "/images/default-img.jpeg"}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm font-semibold block">
          Contact info
        </span>
        <span className="text-xs text-gray-600 block">
          Phone: {phone || "No phone number"}
        </span>
        <span className="text-xs text-gray-600 block">
          LinkedIn: {linkedIn || "No LinkedIn specified"}
        </span>
        <span className="text-xs text-gray-600 block">
          Email: {email || "No email specified"}
        </span>
        <span className="text-xs text-gray-600 block">
          Twitter: {twitter || "No twitter specified"}{" "}
        </span>
        <span className="text-xs text-gray-600 block">
          Address: {location || "No address specified"}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">
          Position
        </span>
        <span className="text-xs text-gray-600 block">
          {title?.length
            ? title
            : "No position specified"}
        </span>
        <span className="text-xs text-gray-600 block">
          Department: {department || "No phone number"}
        </span>
        <span className="text-xs text-gray-600 block">
          Notice in Months: {noticePeriodMonths}
        </span>
        <span className="text-xs text-gray-600 block">
          Employment Status: {employmentStatus || "No LinkedIn specified"}
        </span>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">
          Education
        </span>
        <p className="text-xs text-gray-600 mt-2">
          {education?.length && education[0]
            ? education.map((item, index) => {
                return item.length > 0 ? <li key={index}>{item}</li> : null;
              })
            : "No education specified"}
        </p>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">Experience</span>
        <p className="text-xs text-gray-600 mt-2">
          {experience?.length && experience[0]
            ? experience.map((item, index) => {
                return item.length > 0 ? <li style={{ flexDirection: 'row' }} key={index}>{item}</li> : null;
              })
            : "No experience specified"}
        </p>
      </div>
      <div className="mt-4">
        <span className="text-sm font-semibold block">Skills</span>

        <p className="text-xs text-gray-600 mt-2">
          {skills || "No skills specified"}
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  talents: state.talents,
});

export default connect(mapStateToProps)(TalentProfile);
