import { useState, useEffect } from "react";
import { Badge, Avatar } from "@windmill/react-ui";
import { connect } from "react-redux";

import { TalentAvailability } from "helpers/constants";
import { GetSpecificTalent } from "services/Talents";

const MatchedTalentProfile = ({activeTalent}) => {
  /*const {
    activeTalent: {
      firstName,
      middleName,
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
    }
  } = props;*/

  const [talent, setTalent] = useState({});
  const [talentAvailability, setTalentAvailability] = useState({});
  const [dateCreated, setDateCreated] = useState(undefined);
  const [dateUpdated, setDateUpdated] = useState(undefined);
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  

  useEffect(async () => {
    if(activeTalent.talentId) {
      setIsLoading(true);
      let newName = `${activeTalent.firstName || ""} ${activeTalent.middleName || ""} ${activeTalent.lastName || ""}`;
      if (!newName.trim()) {
        newName = "No talent name";
      }
      setName(newName);

      const selectedTalent = await GetSpecificTalent(activeTalent.talentId);
      setTalent(selectedTalent);
      setIsLoading(false);
    }
   
  }, [activeTalent]);

   useEffect(async () => {
    if(talent.id) {
      let newTalentAvailability = TalentAvailability.find(
        (x) => x.value === talent.availability
      );

      const newDateCreated = new Date(talent.createdTime);
      const newDateUpdated = new Date(talent.lastUpdated);

      setTalentAvailability(newTalentAvailability);
      setDateCreated(newDateCreated);
      setDateUpdated(newDateUpdated);
    }  
  }, [talent]);

  return (
    <div className="px-8 py-8" style={{overflowWrap: 'break-word'}}>
      <div className="flex justify-between">
        <div>
          <span className="font-bold">{name}</span>
          {!isLoading && (
            <>
              {talent.availability && (
                <Badge type={talentAvailability.badgeType} className="ml-2">
                  {talentAvailability.text}
                </Badge>
              )}
              <span className="text-xs text-gray-600 block">Talent #{talent.id}</span>
              <span className="text-xs text-gray-600 block">
                Created on: {dateCreated?.toString()}
              </span>
              <span className="text-xs text-gray-600 block">
                Updated on: {dateUpdated?.toString()}
              </span>
            </>
          )}
        </div>
        <div>
          <Avatar
            className="align-middle w-20 h-20"
            src={talent.talentImageLink || "/images/default-img.jpeg"}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
      {!isLoading && (
        <>
          <div className="mt-2">
            <span className="text-sm font-semibold block">
              Contact info
            </span>
            <span className="text-xs text-gray-600 block">
              Phone: {talent.phone || "No phone number"}
            </span>
            <span className="text-xs text-gray-600 block">
              LinkedIn: {talent.linkedIn || "No LinkedIn specified"}
            </span>
            <span className="text-xs text-gray-600 block">
              Email: {talent.email || "No email specified"}
            </span>
            <span className="text-xs text-gray-600 block">
              Twitter: {talent.twitter || "No twitter specified"}{" "}
            </span>
            <span className="text-xs text-gray-600 block">
              Address: {talent.location || "No address specified"}
            </span>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold block">
              Education
            </span>
            <p className="text-xs text-gray-600 mt-2">
              {talent.education?.length && talent.education[0]
                ? talent.education.map((item) => {
                    return <li>{item}</li>;
                  })
                : "No education specified"}
            </p>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold block">Experience</span>
            <p className="text-xs text-gray-600 mt-2">
              {talent.experience?.length && talent.experience[0]
                ? talent.experience.map((item) => {
                    return <li>{item}</li>;
                  })
                : "No education specified"}
            </p>
          </div>
          <div className="mt-4">
            <span className="text-sm font-semibold block">Skills</span>

            <p className="text-xs text-gray-600 mt-2">
              {talent.skills || "No skills specified"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchedTalentProfile;
