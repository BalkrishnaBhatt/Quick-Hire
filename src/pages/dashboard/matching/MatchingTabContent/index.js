import { useState } from "react";

import EmptyMatching from "./Empty";
import MatchingDetails from "./Matching";
import MatchEngaged from "./MatchEngaged";

import { MatchStatuses } from "helpers/constants";
import Loading from '../../../../icons/loading.png'

const MatchingTabContent = (props) => {
  const [activeTalent, setActiveTalent] = useState("");
  const [matchId, setMatchId] = useState(0);
  const { activeTab } = props;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <EmptyMatching 
          {...props}
          UpdateMatchId={setMatchId}
        />
      </div>
      <div className="col-span-8">
        {
          activeTab.status === MatchStatuses.matching &&(
            <div
            className="flex justify-center items-center"
            style={{ height: "500px",width:'100%' }}
          >
            <img src={Loading} 
            alt={""} style={{height:50,width:40}} />
          </div>
          )
        }
        {activeTab.status === MatchStatuses.done && (
          <MatchingDetails
            {...props}
            activeTalent={activeTalent}
            setActiveTalent={setActiveTalent}
            matchId={matchId}
          />
        )}
        {activeTab.status === MatchStatuses.engaged && (
          <MatchEngaged
            {...props}
            activeTalent={activeTalent}
            setActiveTalent={setActiveTalent}
          />
        )}
      </div>
    </div>
  );
};

export default MatchingTabContent;
