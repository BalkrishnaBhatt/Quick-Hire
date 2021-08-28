import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MatchedTalentProfile from "./MatchedTalentProfile";
import { Button, Dropdown, DropdownItem } from "@windmill/react-ui";
import ReactPaginate from "react-paginate";

import TalentCard from "components/cards/talentCard";
import { FilterIcon, SearchIcon } from "icons";
import { GetMatchedTalentsRequest, GetSearchedMatchedTalents } from "store/ActionCreators/matching";
import { MatchStatuses } from "helpers/constants";
import { GetMatchedTalentsCount } from "services/Matching";
import * as MatchingAPI from "services/Matching";
import { DebounceInput } from 'react-debounce-input';

const PAGE_SIZE = 10;

const Matching = (props) => {
  const dispatch = useDispatch();
  const { 
    UpdateMatchTabStatus, 
    activeTalent, 
    setActiveTalent, 
    matchId,
    activeTab,
    tabIndex 
  } = props;

  const [activePage, setActivePage] = useState(0);
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  const [talents, setTalents] = useState([]);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const currentMatchingActivities = useSelector(state => state.matching.matchingActivities)
  const { isLoading } = useSelector((state) => state.matching);

  useEffect(() => {
    if(activeTab.hasOwnProperty('matchId')) {      
      const init = async() => {
        setMatchLoading(true)
        try {
          const talentsArr = await MatchingAPI.GetMatchedTalents({ matchId: activeTab.matchId, page: activePage, size: PAGE_SIZE })
          const count = await MatchingAPI.GetMatchedTalentsCount(activeTab.matchId)
  
          setTalents(talentsArr)
          setCount(count.count)
          setMatchLoading(false)
        } catch (error) {
          console.log('Error --> ', error)
          setMatchLoading(false)
        }
      }

      init()
    }
  }, [activeTab, activePage])

  useEffect(() => {
    const init = async () => {
      if(matchId > 0) {
        new Promise(( resolve, reject ) => {
          dispatch(GetSearchedMatchedTalents({ resolve, reject, matchId: matchId, page: activePage, size: PAGE_SIZE, keyword: searchQuery }))
        })
        .then((res) => {
          setTalents(res.talents)
          setCount(res.talentCount.count)
        })
        .catch((err) => {
          console.log(err)
        })
      }
    }

    init()
  }, [activePage, searchQuery])
  
  useEffect(async () => {
    if(matchId > 0) {   
      new Promise((resolve, reject) => {
        dispatch(GetMatchedTalentsRequest({ resolve, reject, matchId: matchId, page: activePage, size: PAGE_SIZE }));
      })
      .then((res) => {
        setTalents(res);
        
      })
      .catch((err) => {
        console.log(err);
      })
    }
    if(matchId > 0 && count < 1) {
      const {count} = await GetMatchedTalentsCount(matchId);
      setCount(count);
    }
    
  }, [matchId, activePage]);

  const runSearchAfterTyping = (value) => {
    setSearchQuery(value);
    setActivePage(0)
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4">
        {/* <div className="h-16 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2">
          <span className="px-3 py-3 relative text-sm border0 outline-none focus:outline-none  w-full pr-10 bg-gray-100 cursor-pointer">
            <span className="text-xs text-gray-400">
              Filter by:
              <span className="text-xs text-gray-800 ml-2">
                All results({count})
              </span>
            </span>
          </span>
          <FilterIcon className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3" />
        </div>  */}

        <div className="h-16 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2">
            <DebounceInput
              value={searchQuery}
              onChange={(e) => runSearchAfterTyping(e.target.value)}
              className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative text-sm border0 outline-none focus:outline-none focus:ring w-full pr-10 bg-gray-100"
              placeholder="Search talent"
              debounceTimeout={300}
            />
            <SearchIcon
              className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 cursor-pointer"
            />
          </div>
          
        <ul className="overflow-y-scroll" style={{ maxHeight: "550px" }}>
          {(matchLoading || isLoading) ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "500px" }}
              >
                <h1>Loading...</h1>
              </div>
            ) : talents.length > 0 ? (
              talents.map((item, index) => {
                return (
                  <TalentCard
                    position={item.title}
                    talentImg={item.talentImageLink}
                    talentName={(item.firstName || '') + ' ' + (item.middleName || '') + ' ' + (item.lastName || '')}
                    id={item.talentId}
                    key={item.talentId}
                    active={activeTalent === index}
                    onClick={() => setActiveTalent(item)}
                    showPercentage
                    score={item.score}
                  />
                );
              })
            ) : (
              <div
                className="flex justify-center items-center"
                style={{ height: "500px" }}
              >
                <h1>No talents yet</h1>
              </div>
            )}
        </ul>

        <div className="py-5 px-10">
          <ReactPaginate
              pageCount={Math.ceil(count / PAGE_SIZE)}
              previousLabel="&#8592;"
              nextLabel="&#8594;"
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              breakLabel={"..."}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"}
              onPageChange={(page) => setActivePage(page.selected)}
              forcePage={activePage}
            />
        </div>
      </div>
      <div className="col-span-8 shadow">
        {activeTalent && (
          <>
            <div className="h-16 bg-gray-100 py-4 flex justify-end px-4 mb-2">
              <div className="relative">
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
                layout="outline"
                className="ml-2 h-7 border-blue blue bg-white"
                size="small"
                onClick={() => setShowChatDropdown(true)}
              >
                Start Chat
              </Button>
              <Button
                className="bg-blue h-7 ml-1"
                size="small"
                onClick={() => UpdateMatchTabStatus(MatchStatuses.engaged, tabIndex, matchId)}
              >
                Engage
              </Button>
            </div>
            <MatchedTalentProfile activeTalent={activeTalent} />
          </>
        )}
      </div>
    </div>
  );
};

export default Matching;
