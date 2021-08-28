import { useState } from "react";

import { Button, Pagination, Dropdown, DropdownItem } from "@windmill/react-ui";
import TalentCard from "components/cards/talentCard";
import TalentProfile from "pages/dashboard/talents/main/TalentProfile";

import { MatchStatuses } from "helpers/constants";
const MatchEngaged = (props) => {
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const { UpdateMatchTabStatus, activeTalent, setActiveTalent } = props;
  return (
    <div className="grid grid-cols-12">
      <div className="h-16 bg-gray-200 py-4 flex justify-between px-4 col-span-12 rounded rounded-b-none">
        <div>
          <span className="text-xs text-blue-800">
            Job #1234 match success!
          </span>
          <span className="text-xs ml-4 text-gray-500 cursor-pointer">
            Jump to job profile
          </span>
          <span
            className="text-xs ml-4 text-gray-500 cursor-pointer"
            onClick={() => UpdateMatchTabStatus(MatchStatuses.matching)}
          >
            Cancel Engage(30s)
          </span>
        </div>
        <div>
          <div className="relative z-10">
            <Dropdown
              isOpen={showChatDropdown}
              onClose={() => setShowChatDropdown(false)}
            >
              <DropdownItem
                onClick={() => alert("This part under construction")}
              >
                Email
              </DropdownItem>
              <DropdownItem
                onClick={() => alert("This part is under construction")}
              >
                WhatsApp
              </DropdownItem>
            </Dropdown>
          </div>
          <Button
            className="bg-blue h-7 ml-1"
            size="small"
            onClick={() => setShowChatDropdown(true)}
          >
            Start Chat
          </Button>
        </div>
      </div>
      <div className="col-span-4">
        <ul style={{ maxHeight: "550px" }} className="overflow-y-scroll">
          {[
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ].map((item, index) => (
            <TalentCard
              position="IT, Software Developer"
              talentName="JP Morgan"
              id="1234"
              key={index}
              active={activeTalent === index}
              onClick={() => setActiveTalent(index)}
              showPercentage
            />
          ))}
        </ul>
        <div className="py-5 px-5">
          <Pagination
            totalResults={40}
            resultsPerPage={35}
            onChange={() => {}}
            label=""
          />
        </div>
      </div>
      <div className="col-span-8 shadow">
        <TalentProfile />
      </div>
    </div>
  );
};

export default MatchEngaged;
