import { useState, useEffect } from "react";
//import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import MatchBadge from "components/MatchBadge";

import MatchingTabContent from "./MatchingTabContent";
import { PlusIcon } from "icons";
import { MatchStatuses } from "helpers/constants";

//Statuses:
//  - initial
//  - scoring
//  - engaged
//  - matching

/*
const initialTabs = [
  { status: MatchStatuses.initial },
  { status: MatchStatuses.scoring },
  { status: MatchStatuses.engaged },
  { status: MatchStatuses.matching },
];

const ActiveTabContent = (props) => {
  const { activeTab } = props;

  switch (activeTab.status) {
    default:
      return <EmptyMatching {...props} />;
  }
};
*/

const Matching = (props) => {
  // const [tabs, setTabs] = useState([{ status: MatchStatuses.initial }]);
  const [tabs, setTabs] = useState([]);

  //const [tabs, setTabs] = useState(initialTabs);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const currentMatchingActivities = useSelector(state => state.matching.matchingActivities)

  useEffect(() => {
    let statusArr = []

    const localStorageActiveJob = JSON.parse(localStorage.getItem('ActiveJob'))

    if(Object.keys(currentMatchingActivities).length > 0) {
      Object.keys(currentMatchingActivities).map(item => {
        statusArr.push({ 
          status: ((currentMatchingActivities[item].status === MatchStatuses.matching) || (currentMatchingActivities[item].status === MatchStatuses.done)) ? currentMatchingActivities[item].status : MatchStatuses.initial,
          matchId: currentMatchingActivities[item].matchId,
          currentJob: currentMatchingActivities[item].currentJob
        })
      })

      if(localStorageActiveJob !== null) {
        statusArr.push({ status: MatchStatuses.initial, currentJob: JSON.parse(localStorage.getItem('ActiveJob'))})
        setActiveTabIndex(Object.keys(currentMatchingActivities).length)
      }

      setTabs(statusArr)
    } else {
      setTabs([{ status: MatchStatuses.initial }])
    }

  }, [])

  const AddTab = (data) => {
    if(data){
      // tabs[activeTabIndex + 1]
      setTabs([...tabs, { status: MatchStatuses.initial }]);
    }
    else{
      setTabs([...tabs, { status: MatchStatuses.initial }]);
    }
   
  };

  const UpdateMatchTabStatus = (status, index, matchId) => {
    let udpatedTab = tabs[index];
    udpatedTab.status = status;
    udpatedTab.matchId = matchId

    let tabsCopy = [...tabs];
    tabsCopy[index] = udpatedTab;
    setTabs(tabsCopy);
  };

  const activeTab = tabs[activeTabIndex];

  return (
    <div className="ml-6 mt-6 overflow-y-scroll h-full">
      <ul className="flex mb-0 list-none ml-2">
        {tabs.map((tab, index) => (
          <li className="-mb-px mr-1 last:mr-0 text-center" key={index}>
            <a
              style={{ fontSize: "10px" }}
              className={
                "text-xs font-bold uppercase px-5 py-3  rounded-t-lg block leading-normal border border-b-0 " +
                (activeTabIndex === index
                  ? tab.status ==='matching'?"red bg-white-500": "blue bg-gray-100"
                  : "text-gray-300 bg-white")
              }
              onClick={(e) => {
                e.preventDefault();
                setActiveTabIndex(index);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              Matching {index + 1}{" "}
              <MatchBadge
                status={tab.status}
                active={activeTabIndex === index}
              />
            </a>
          </li>
        ))}
        <li className="-mb-px mr-1 last:mr-0 text-center">
          <PlusIcon
            className="h-6 w-6 mt-3 cursor-pointer hover:text-green-500 text-gray-400"
            onClick={AddTab}
          />
        </li>
      </ul>
      <div>
        {tabs.map((tab, index) => {
          return (
            <div hidden={index !== activeTabIndex} key={index}>
              <MatchingTabContent
                activeTab={activeTab}
                UpdateMatchTabStatus={UpdateMatchTabStatus}
                tabIndex={index}
                tabs={tabs}
                AddTab={AddTab}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Matching;
