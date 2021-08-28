import { useState, createRef, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";
import { Switch, Route } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDispatch, connect, useSelector } from "react-redux";
import moment from "moment";
import { DebounceInput } from 'react-debounce-input';
import ReactTooltip from "react-tooltip";

import TalentCard from "components/cards/talentCard";
import Tabs from "components/tabs";

import UpdateTalent from "../UpdateTalent";
import TalentProfile from "./TalentProfile";
import MatchedJobs from "./matchedJobs";
import MatchingActivities from "./matchingActivities";
import Resumes from "./Resumes";
import { 
  DUPLICATE_PHONE_IN_UPLOADED_RESUME_TALENT,
  DUPLICATE_EMAIL_IN_UPLOADED_RESUME_TALENT,
  DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME_TALENT,
} from "helpers/constants";

import {
  GetTalents,
  GetActiveTalent,
  SetActiveTalent,
  DeleteActiveTalent,
  ResumeCreateRequest,
  ResumeUpdateRequest,
  SetAfterCreateTalent
} from "store/ActionCreators/talents";

import {
  SearchIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  UploadIcon,
  DocumentIcon,
} from "icons";

const PAGE_SIZE = 10;

const Talents = (props) => {
  const { id } = props.match.params;
  const { talentCount, talents, isLoading, afterCreate } = props.talents;

  //HOOKS
  const dispatch = useDispatch();

  // STATES
  const [activeTalent, setActiveTalent] = useState(id);
  const [isCreateTalentOpen, setIsCreateTalentOpen] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [activePage, setActivePage] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedTalent, setDeletedTalent] = useState(false);

  const data = useSelector(state => state.talents)

  useEffect(() => {
    if(!deletedTalent) {
      dispatch(GetTalents({ page: activePage, size: PAGE_SIZE, search: searchQuery }));
    }
  }, [activePage, searchQuery]);  
  useEffect(async () => {
    if(deletedTalent) {
      await dispatch(GetTalents({ page: activePage, size: PAGE_SIZE, search: searchQuery }));
      setDeletedTalent(false);
    }
  }, [deletedTalent]);

  useEffect(async () => {
    if(afterCreate.page !== undefined) {
      setActivePage(afterCreate.page)
    }
    
  }, [afterCreate]);

  useEffect(() => {
    if(talents.length < 1) {
      props.history.push(`/home/talents`);
      setActiveTalent("");
      dispatch(SetActiveTalent({}));
      return;
    }
    //from create, select new created talent
    if(afterCreate.talent !== undefined && afterCreate.page === activePage) {
      dispatch(SetAfterCreateTalent({}));
      const createdTalentIndex = talents.findIndex((item) => item.id === afterCreate.talent);
      onTalentCardClick(talents[createdTalentIndex]);
      var objDiv = document.getElementById("talent-list"); //scroll to bottom of list
      objDiv.scrollTop = objDiv.scrollHeight;
      return;
    }
    if(talents.length > 0) {
      // onTalentCardClick(talents[0]);
      setActiveTalent(data.activeTalent.id);
      return;
    }
  }, [talents]);

  useEffect(() => {
    if(talents.length > 0) {
      onTalentCardClick(talents[0]);
      return;
    }    
  }, [])

  //REFS
  const CreateUploadResumeRef = createRef(null);
  const UpdateUploadResumeRef = createRef(null);

  //EVENT HANDLERS
  const CreateUploadResumeChangeHandler = (e) => {
    let file = e.target.files[0];
    let payload = new FormData();

    payload.append("resume", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYYMMDD")
    );

    setIsUploading(true);

    new Promise((resolve, reject) => {
      dispatch(ResumeCreateRequest({ resolve, reject, data: payload }));
    })
      .then(() => {
        setIsCreateTalentOpen(false);
        props.history.push("/home/talents/create");
      })
      .catch((err) => {
        // alert("Something went wrong while uploading file...");
        if(err !== undefined) {
          const errorMessage = err.response?.data?.errorMessage ?  err.response?.data?.errorMessage : "";

          if(errorMessage === 'DUPLICATE_PHONE_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_PHONE_IN_UPLOADED_RESUME_TALENT);
          } else if(errorMessage === 'DUPLICATE_EMAIL_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_EMAIL_IN_UPLOADED_RESUME_TALENT)
          } else if(errorMessage === 'DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME_TALENT)
          } else {
            alert("Something went wrong while uploading file...");
          }
        } else {
          alert("Something went wrong while uploading file...");
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const UpdateUploadResumeHandler = (e) => {
    let file = e.target.files[0];
    console.log(file);

    setIsUploading(true);

    let payload = new FormData();

    payload.append("resume", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYYMMDD")
    );
    payload.append("talentId", id);

    new Promise((resolve, reject) => {
      dispatch(ResumeUpdateRequest({ resolve, reject, data: payload }));
    })
      .then(() => {
        props.history.push(props.match.url + "/update");
        setIsUpdateDropdownOpen(false);
      })
      .catch((err) => {
        // alert("Something went wrong while uploading file...");
        if(err !== undefined) {
          const errorMessage = err.response?.data?.errorMessage ?  err.response?.data?.errorMessage : "";

          if(errorMessage === 'DUPLICATE_PHONE_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_PHONE_IN_UPLOADED_RESUME_TALENT);
          } else if(errorMessage === 'DUPLICATE_EMAIL_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_EMAIL_IN_UPLOADED_RESUME_TALENT)
          } else if(errorMessage === 'DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME') {
            alert(DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME_TALENT)
          } else {
            alert("Something went wrong while uploading file...");
          }
        } else {
          alert("Something went wrong while uploading file...");
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const onTalentCardClick = (talent) => {
    const { id } = talent;
    props.history.push(`/home/talents/${id}`);
    setActiveTalent(id);
    dispatch(SetActiveTalent(talent));
  };

  const resetTalents = async () => {
    setActivePage(0);
    setSearchQuery("");
    setActiveTalent(undefined);
    await dispatch(GetTalents({ page: 0, size: PAGE_SIZE }));
  };

  const deleteTalent = async (talentId) => {
    let { payload } = await dispatch(DeleteActiveTalent({ talentId }));
    
    if(activePage > 0 && (talents.length - 1 < 1)) {
      setActivePage(activePage-1);
    }
    
    setTimeout(()=>{
      setDeletedTalent(payload);
      setDeleteModalOpen(false);
    }, 1000); //Back end needs delay before delete is registered?
  };

  const runSearchAfterTyping = (value) => {
    setSearchQuery(value);
    setActivePage(0)
  };

  const pageSizeFrom = activePage * PAGE_SIZE + 1;
  const pageSizeTo = (activePage + 1) * PAGE_SIZE;

  return (
    <div className="ml-10">
      <Modal isOpen={isUploading} onClose={() => {}}>
        <ModalBody>
          <div className="flex justify-center items-center">
            <h1>Uploading Resume...</h1>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalBody>
          <div className="flex justify-center items-center">
            <h1>Delete Talent?</h1>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="text-red-500 border-red-500 mr-2" 
                  size="small" 
                  type="button" 
                  layout="outline"
                  onClick={() => deleteTalent(activeTalent)}>
            Delete
          </Button>
          <Button size="small" layout="outline" 
                  onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <div className="grid grid-cols-10">
        <div className="col-span-9 flex justify-between py-4">
          <div>
            <span className="font-semibold text-gray-500">
              TALENTS OVERVIEW
            </span>
            <span className="text-xs text-gray-400 ml-4">
              {pageSizeFrom}-
              {pageSizeTo < talentCount ? pageSizeTo : talentCount} of{" "}
              {talentCount} talents
            </span>
            {/*
            <span className="text-xs ml-4 text-gray-400">
              Sort by:
              <select>
                <option>Date Created</option>
                <option>Date Updated</option>
              </select>
            </span>
            */}
          </div>

          <div className="relative">
            <Button
              size="small"
              iconRight={PlusIcon}
              style={{ backgroundColor: "#0f9367" }}
              onClick={() => setIsCreateTalentOpen(!isCreateTalentOpen)}
              className="rounded-full"
              disabled={props.location.pathname.includes("/update")}
            >
              Create new talent
            </Button>
            <input
              type="file"
              hidden
              ref={CreateUploadResumeRef}
              onChange={CreateUploadResumeChangeHandler}
            />
            <Dropdown
              isOpen={isCreateTalentOpen}
              align="right"
              onClose={() => setIsCreateTalentOpen(false)}
            >
              <DropdownItem
                onClick={() => CreateUploadResumeRef.current.click()}
              >
                <span>
                  <UploadIcon className="h-3 w-3 mr-2" />
                </span>
                <span>Upload Resume</span>
              </DropdownItem>
              <DropdownItem
                onClick={() => props.history.push("/home/talents/create")}
              >
                <span>
                  <DocumentIcon className="h-4 w-4 mr-1" />
                </span>
                <span>Empty Profile</span>
              </DropdownItem>{" "}
            </Dropdown>
          </div>
        </div>
        <div className="col-span-3 shadow" style={{ maxHeight: "680px" }}>        
          <div className="h-16 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2">
            <DebounceInput
              data-tip data-for="searchTip"
              value={searchQuery}
              onChange={(e) => runSearchAfterTyping(e.target.value)}
              className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative text-sm border0 outline-none focus:outline-none focus:ring w-full pr-10 bg-gray-100"
              placeholder="Search talents"
              debounceTimeout={300}
            />
            <SearchIcon
              className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 cursor-pointer"
              
            />
            <ReactTooltip id="searchTip" place="bottom" effect="solid" backgroundColor="white" textColor="black" border={true} borderColor="black">
              Search talents by first name or middle name or last name or phone or title
            </ReactTooltip>
          </div>
          
          <ul id="talent-list"
            className="overflow-y-scroll"
            style={{ maxHeight: "550px", height: "550px" }}
          >
            {isLoading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "500px" }}
              >
                <h1>Loading...</h1>
              </div>
            ) : talents.length > 0 ? (
              talents.map((item) => {
                const {
                  firstName,
                  lastName,
                  id,
                  talentImageLink,
                  availability,
                  title,
                } = item;
                return (
                  <TalentCard
                    talentImg={talentImageLink || "/images/default-img.jpeg"}
                    position={title}
                    talentName={`${firstName || ""} ${lastName || ""}`}
                    id={id}
                    key={id}
                    active={activeTalent == id}
                    availability={availability}
                    onClick={() => onTalentCardClick(item)}
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
          <div className="py-5 px-5 flex justify-center">
            <ReactPaginate
              pageCount={Math.ceil(talentCount / 10)}
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
        {!isLoading && activeTalent && (
          <div className="col-span-6" key={activeTalent.toString()}>
            <div className="h-full bg-white ml-4 shadow">
              <Switch>
                <Route
                  path={"/home/talents/:id?/update"}
                  component={UpdateTalent}
                />
                <Route path={props.match.url + "/:id?"}>
                  <div className="h-16 bg-gray-100 py-4 flex justify-end px-4 mb-2">
                    <Button
                      layout="outline"
                      size="small"
                      iconLeft={TrashIcon}
                      className="text-red-500 border-red-500 px-5 h-6 ml-2"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete
                    </Button>
                    <Button
                      layout="outline"
                      size="small"
                      iconLeft={PencilIcon}
                      className="blue border-blue px-5 h-6 ml-2"
                      onClick={() => setIsUpdateDropdownOpen(true)}
                    >
                      Update
                    </Button>
                    <input
                      type="file"
                      hidden
                      onChange={UpdateUploadResumeHandler}
                      ref={UpdateUploadResumeRef}
                    />
                    <div className="relative">
                      <Dropdown
                        isOpen={isUpdateDropdownOpen}
                        align="right"
                        onClose={() => setIsUpdateDropdownOpen(false)}
                      >
                        <DropdownItem
                          onClick={() => UpdateUploadResumeRef.current.click()}
                        >
                          <span>
                            <UploadIcon className="h-3 w-3 mr-2" />
                          </span>
                          <span>Upload Resume</span>
                        </DropdownItem>
                        <DropdownItem
                          onClick={() => {
                            props.history.push(props.match.url + "/update");
                            setIsUpdateDropdownOpen(false);
                          }}
                        >
                          <span>
                            <PencilIcon className="h-4 w-4 mr-1" />
                          </span>
                          <span>Edit Profile</span>
                        </DropdownItem>
                      </Dropdown>
                    </div>
                  </div>
                  <Tabs
                    tabList={[
                      {
                        name: "Profile",
                        Component: () => (
                          <TalentProfile talentId={activeTalent} />
                        ),
                      },
                      {
                        name: "Resumes",
                        Component: Resumes,
                      },
                      {
                         name: "Matched Jobs",
                      Component: () => ( 
                      <MatchedJobs talentId={activeTalent} activePage={activePage} /> 
                      )
                    },
                      {
                        name: "Matching Activities",
                        Component: () => (
                          <MatchingActivities talentId={activeTalent}/>
                        ),
                      },
                    ]}
                  />
                </Route>
              </Switch>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  talents: state.talents,
});

export default connect(mapStateToProps)(Talents);
