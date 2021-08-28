import React, { useState, useRef, useEffect } from "react";
import { Switch, Route, NavLink } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { DebounceInput } from 'react-debounce-input';

import {
  Button,
  Dropdown,
  DropdownItem,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
} from "@windmill/react-ui";

import JobCards from "components/cards/jobCards";
import JobProfile from "./JobProfile";
import MatchedTalents from "./matchedTalents";
import MatchingActivities from "./matchingActivities";
import JDFiles from "./JDFiles";
import UpdateJob from "../UpdateJob";
import Tabs from "components/tabs";

import {
  GetJobs,
  SetActiveJob,
  GetActiveJob,
  DeleteActiveJob,
  JDCreateRequest,
  JDUpdateRequest,
  SetJobCount,
  SetAfterCreateJob
} from "store/ActionCreators/jobs";

import { SearchIcon, PlusIcon, Clipboard, PencilIcon, UploadIcon, TrashIcon } from "icons";

const PAGE_SIZE = 10;

const Jobs = (props) => {
  const { id } = props.match.params;
  const dispatch = useDispatch();

  const { list: jobList, isLoading, jobCount, afterCreate } = useSelector(
    (state) => state.jobs
  );

  const data = useSelector(state => state.jobs)

  // STATES
  const [activeJob, setActiveJob] = useState({});
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [activePage, setActivePage] = useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletedJob, setDeletedJob] = useState(false);

  // REFS
  const JDFileInputRef = useRef(null);
  const UpdateJDFileInputRef = useRef(null);

  useEffect(() => {
    if (!deletedJob) {
      dispatch(GetJobs({ page: activePage, size: PAGE_SIZE, title: searchQuery }));
    }
  }, [activePage, searchQuery]);

  useEffect(async () => {
    if (deletedJob) {
      await dispatch(GetJobs({ page: activePage, size: PAGE_SIZE, title: searchQuery }));
      setDeletedJob(false);
    }
  }, [deletedJob]);

  useEffect(async () => {
    if (afterCreate.page !== undefined) {
      setActivePage(afterCreate.page)
    }

  }, [afterCreate]);

  useEffect(() => {
    // empty list
    if (jobList.length < 1) {
      props.history.push(`/home/jobs`);
      setActiveJob({});
      dispatch(SetActiveJob({}));
      return;
    }
    //from create, select new created job
    if (afterCreate.job !== undefined && afterCreate.page === activePage) {
      dispatch(SetAfterCreateJob({}));
      const createdJobIndex = jobList.findIndex((item) => item.id === afterCreate.job);
      onJobCardClick(jobList[createdJobIndex]);
      var objDiv = document.getElementById("job-list"); //scroll to bottom of list
      objDiv.scrollTop = objDiv.scrollHeight;
      return;
    }
    //default, select first from list
    if (jobList.length > 0) {
      // onJobCardClick(jobList[0]);
      setActiveJob(data.activeJob)
      return;
    }
  }, [jobList]);

  useEffect(() => {
    if (jobList.length > 0) {
      onJobCardClick(jobList[0]);
      return
    }
  }, [])

  // EVENT HANDLERS
  const CreateEmptyProfileHandler = () => {
    props.history.push("/home/jobs/create");
  };

  const JDFileInputChangeHandler = (e) => {
    let file = e.target.files[0];

    let payload = new FormData();
    payload.append("jobDescriptionFile", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYY-MM-DD")
    );

    setIsUploading(true);

    new Promise((resolve, reject) => {
      dispatch(JDCreateRequest({ resolve, reject, data: payload }));
    })
      .then(() => {
        props.history.push("/home/jobs/create");
        setIsUpdateDropdownOpen(false);
      })
      .catch((err) => {
        alert("Something went wrong while uplading file!");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const UpdateJDFileInputChangeHandler = (e) => {
    let file = e.target.files[0];

    let payload = new FormData();

    payload.append("jobDescriptionFile", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYY-MM-DD")
    );
    payload.append("jobId", id);

    setIsUploading(true);

    new Promise((resolve, reject) => {
      dispatch(JDUpdateRequest({ resolve, reject, data: payload }));
    })
      .then(() => {
        props.history.push(props.match.url + "/update");
        setIsUpdateDropdownOpen(false);
      })
      .catch((err) => {
        alert("Something went wrong while uploading file!");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const onJobCardClick = (job) => {
    const { id } = job;
    props.history.push(`/home/jobs/${id}`);
    setActiveJob(job);
    dispatch(SetActiveJob(job));
  };

  const onMatchClick = (job) => {
    let newJob = job
    newJob.page = "JOB"
    localStorage.setItem('ActiveJob', JSON.stringify(newJob))
    window.history.replaceState(null, "", `/home/matching`)
    setActiveJob(newJob);
    dispatch(SetActiveJob(newJob));
  };


  const resetJobs = async () => {
    setActivePage(0);
    setSearchQuery("");
    setActiveJob({});
    await dispatch(GetJobs({ page: 0, size: PAGE_SIZE }));
  };

  const deleteJob = async (jobId) => {
    let { payload } = await dispatch(DeleteActiveJob({ jobId }));

    if (activePage > 0 && (jobList.length - 1 < 1)) {
      setActivePage(activePage - 1);
    }

    setTimeout(() => {
      setDeletedJob(payload);
      setDeleteModalOpen(false);
    }, 1000); //Back end needs delay before delete is registered?
  }

  const runSearchAfterTyping = (value) => {
    setSearchQuery(value);
    setActivePage(0)
  };

  const pageSizeFrom = activePage * PAGE_SIZE + 1;
  const pageSizeTo = (activePage + 1) * PAGE_SIZE;

  return (
    <div className="ml-10">
      <Modal isOpen={isUploading} onClose={() => { }}>
        <ModalBody>
          <div className="flex justify-center items-center">
            <h1>Uploading JD file...</h1>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalBody>
          <div className="flex justify-center items-center">
            <h1>Delete Job?</h1>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="text-red-500 border-red-500 mr-2"
            size="small"
            type="button"
            layout="outline"
            onClick={() => deleteJob(activeJob.id)}>
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
            <span className="font-semibold text-gray-500">JOBS OVERVIEW</span>
            <span className="text-xs text-gray-400 ml-4">
              {pageSizeFrom}-{pageSizeTo < jobCount ? pageSizeTo : jobCount} of{" "}
              {jobCount} jobs {activePage}
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
          <Input
            ref={JDFileInputRef}
            onChange={JDFileInputChangeHandler}
            type="file"
            style={{ display: "none" }}
          />
          <div className="relative">
            <Button
              size="small"
              iconRight={PlusIcon}
              className="rounded-full bg-green"
              onClick={() => setIsCreateJobOpen(!isCreateJobOpen)}
              disabled={props.location.pathname.includes("/update")}
            >
              Create new job
            </Button>
            <Dropdown
              isOpen={isCreateJobOpen}
              align="right"
              onClose={() => setIsCreateJobOpen(false)}
            >
              <DropdownItem onClick={() => JDFileInputRef.current.click()}>
                <span>Upload JD Files</span>
              </DropdownItem>
              <DropdownItem onClick={CreateEmptyProfileHandler}>
                <span>Empty Profile</span>
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="col-span-3 shadow" style={{ maxHeight: "680px" }}>

          <div className="h-16 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2">
            <DebounceInput
              value={searchQuery}
              onChange={(e) => runSearchAfterTyping(e.target.value)}
              className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative text-sm border0 outline-none focus:outline-none focus:ring w-full pr-10 bg-gray-100"
              placeholder="Search jobs by title"
              debounceTimeout={300}
            />
            <SearchIcon
              className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 cursor-pointer"

            />
          </div>

          <ul id="job-list"
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
            ) : jobList && jobList.length > 0 ? (
              jobList.map((item, index) => {
                let ActiveJob = activeJob ? parseInt(activeJob.id) : item.id;
                return (
                  <JobCards
                    jobStatus={item.jobStatus}
                    position={item.jobTitle}
                    talentName=""
                    id={item.id}
                    key={item.id}
                    active={ActiveJob === item.id}
                    onClick={() => onJobCardClick(item)}
                  />
                );
              })
            ) : (
              <div
                className="flex justify-center items-center"
                style={{ height: "500px" }}
              >
                <h1>No jobs yet</h1>
              </div>
            )}
          </ul>
          <div className="py-5 px-5 flex justify-center">
            <ReactPaginate
              pageCount={Math.ceil(jobCount / PAGE_SIZE)}
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

        {!isLoading && Object.keys(activeJob).length > 0 && (
          <div className="col-span-6 overflow-hidden" key={activeJob.id.toString()} style={{ height: "680px" }}>
            <div className="h-full bg-white ml-4 shadow shadow-lg overflow-auto">
              <Switch>
                <Route
                  path={"/home/jobs/:id?/update"}
                  exact
                  component={UpdateJob}
                />
                <Route path={props.match.url}>
                  <div className="h-16 bg-gray-100 py-4 flex justify-end px-4 mb-10">
                    <NavLink
                      exact
                      to="/home/matching"
                    >
                      <Button
                        size="small"
                        className="bg-blue h-7"
                        iconLeft={Clipboard}
                        onClick={() => onMatchClick(activeJob)}
                      >
                        Match with talents
                    </Button>
                    </NavLink>
                    <Button
                      layout="outline"
                      className="ml-2 h-7 border-blue blue"
                      size="small"
                      iconLeft={PencilIcon}
                      onClick={() => setIsUpdateDropdownOpen(true)}
                    >
                      Update
                    </Button>
                    <Button
                      layout="outline"
                      size="small"
                      iconLeft={TrashIcon}
                      className="text-red-500 border-red-500 ml-2 h-7"
                      onClick={() => setDeleteModalOpen(true)}
                    >
                      Delete
                    </Button>
                    {/*UPDATE JD FILE INPUT*/}
                    <input
                      type="file"
                      hidden
                      onChange={UpdateJDFileInputChangeHandler}
                      ref={UpdateJDFileInputRef}
                    />
                    <div className="relative">
                      <Dropdown
                        isOpen={isUpdateDropdownOpen}
                        align="right"
                        onClose={() => setIsUpdateDropdownOpen(false)}
                      >
                        <DropdownItem
                          onClick={() => UpdateJDFileInputRef.current.click()}
                        >
                          <span>
                            <UploadIcon className="h-3 w-3 mr-2" />
                          </span>
                          <span>Update JD File</span>
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
                      { name: "Profile", Component: JobProfile },
                      { name: "JD file", Component: JDFiles },
                      { name: "Currently Engaged", Component: MatchedTalents },
                      {
                        name: "Matching Activities",
                        Component: () => <MatchingActivities jobId={id} />,
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

export default Jobs;
