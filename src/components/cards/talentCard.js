import { Badge, Avatar } from "@windmill/react-ui";
import classNames from "classnames";

import { TalentAvailability } from "helpers/constants";

const TalentCard = (props) => {
  const {
    position,
    talentName,
    id,
    active,
    onClick,
    showPercentage,
    talentImg,
    availability,
    score,
  } = props;

  let talentAvailability = TalentAvailability.find(
    (x) => x.value === availability
  );

  return (
    <li onClick={onClick} className="cursor-pointer">
      <div
        className={classNames(
          "h-24 bg-white border relative",
          showPercentage ? "px-2 py-2 h-full" : "px-5 py-5"
        )}
      >
        {active && (
          <>
            <span
              className="absolute inset-y-0 left-0 w-1  bg-blue rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
            <span
              className="absolute inset-y-0 left-0 w-1  bg-blue rounded-tr-lg rounded-br-lg"
              aria-hidden="true"
            ></span>
          </>
        )}
        <div className="grid grid-cols-5">
          <div className="col-span-3">
            <h1 className="font-bold">
              {talentName.trim() || "No talent name"}
            </h1>
            <span className="text-xs text-gray-400">
              {position || "No position specified"}
            </span>
            <br />
            <span className="text-xs text-gray-300">Talent #{id}</span>
          </div>
          <div className="col-span-2 text-right">
            {talentImg && (
              <Avatar
                src={talentImg}
                size="large"
              />
            )}
            <br />
            {showPercentage && (
              <Badge
                type="success"
                className="border border-green-500 mr-1"
                style={{ backgroundColor: "white" }}
              >
                {score}%
              </Badge>
            )}
            {/* {availability && (
              <Badge type={talentAvailability.badgeType}>
                {talentAvailability.text}
              </Badge>
            )} */}
          </div>
        </div>
      </div>
    </li>
  );
};

export default TalentCard;
