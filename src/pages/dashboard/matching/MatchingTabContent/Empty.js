import {
  Avatar,
  Badge,
  Label,
  Button,
  Input,
  HelperText,
  Dropdown,
  DropdownItem
} from "@windmill/react-ui";
import { Switch, Route } from "react-router-dom";
import moment from "moment";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  CreateMatchingActivityRequest,
  UpdateMatchingActivityDetails,
} from "store/ActionCreators/matching";

import {
  SetActiveJob,
  JDUpdateRequest
} from "store/ActionCreators/jobs";

import { SearchIcon, FilterIcon, ChevronRightIcon, Clipboard, PencilIcon, UploadIcon, TrashIcon } from "icons";
import ReactPaginate from "react-paginate";
import { DebounceInput } from 'react-debounce-input';
import Select from "react-select/creatable";
import { MatchStatuses } from "helpers/constants";
import { LANGUAGES_LIST } from "helpers/languages";
import * as MatchingAPI from "services/Matching";

import JobCards from "../../../../components/cards/jobCards";
import JobProfile from "../../jobs/main/JobProfile";
import MatchedTalents from "../../jobs/main/matchedTalents";
import MatchingActivities from "../../jobs/main/matchingActivities";
import JDFiles from "../../jobs/main/JDFiles";
import UpdateJob from "../../jobs/UpdateJob/index";
import Tabs from "components/tabs";

const PAGE_SIZE = 10;

const EmptyMatching = (props) => {

  const dispatch = useDispatch();
  const { UpdateMatchTabStatus, activeTab, UpdateMatchId, tabIndex, tabs, AddTab } = props;
  const [jobsForMatching, setJobsForMatching] = useState([]);
  const [count, setCount] = useState(0);
  const [filterBy, setFilterBy] = useState("");
  const [activeJob, setActiveJob] = useState(activeTab?.currentJob ? activeTab.currentJob : undefined);
  const [activePage, setActivePage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activity, setActivity] = useState({});
  const [finishTime, setFinishTime] = useState(undefined);
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState(undefined);
  const [matchLoading, setMatchLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [updateForm, setUpdateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [status, setStatus] = useState('')
  const [isInitial, setIsInitial] = useState(false)
  const [initialJob, setInitialJob] = useState(undefined)
  const [currentActiveTab, setCurrentActiveTab] = useState(true)
  const [activeJobLocalStorage, setActiveJobLocalStorage] = useState(undefined)

  const currentMatchingActivities = useSelector(state => state.matching.matchingActivities)
  const activeJobData = useSelector(state => state.jobs.activeJob)

  // REFS
  const JDFileInputRef = useRef(null);
  const UpdateJDFileInputRef = useRef(null);
  const popupRef = useRef(null);

  const { register,
    handleSubmit,
    control: formControl,
    formState: { errors: formErrors },
    clearErrors,
    getValues: getFormValues
  } = useForm();
  const languageOptions = Object.keys(LANGUAGES_LIST).map((key) => (
    { value: LANGUAGES_LIST[key].name, label: LANGUAGES_LIST[key].name })
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick)

    if (activeTab.status === MatchStatuses.initial) {
      // setActiveJob(undefined)
      setIsInitial(true)
    }

    if (activeTab.status === MatchStatuses.done) {
      setIsInitial(false)
    }

    if (activeTab.status === MatchStatuses.matching) {
      if (tabs.length === 1) {
        setIsInitial(false)
        setActiveJob(activeJobData)
      }
      setIsInitial(false)
      if (activeTab?.currentJob) {
        setActiveJob(activeTab?.currentJob)
      }
    }

    if (activeTab.hasOwnProperty('matchId')) {
      Object.keys(currentMatchingActivities).map(item => {
        if (currentMatchingActivities[item].matchId === activeTab.matchId) {
          setActiveJob(currentMatchingActivities[item].currentJob)
        }
      })
    }

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [activeTab, currentMatchingActivities])

  useEffect(async () => {
    setIsLoading(true);

    const localStorageData = JSON.parse(localStorage.getItem('ActiveJob'))

    if (localStorageData !== null) {
      setInitialJob(localStorageData)
      setActiveJobLocalStorage(localStorageData)
    }
    // (localStorage.getItem('ActiveJob') !== null) && setInitialJob(JSON.parse(localStorage.getItem('ActiveJob')))

    // : setActiveJob(undefined)
    const jobs = await MatchingAPI.GetJobsForMatching({ page: activePage, size: PAGE_SIZE, keyword: searchQuery });
    const jobCount = await MatchingAPI.GetJobsForMatchingCount({ keyword: searchQuery });
    setJobsForMatching(jobs);
    setCount(jobCount.count);
    setFilterBy(jobCount.filterBy);
    setIsLoading(false);
    localStorage.removeItem('ActiveJob')
  }, [activePage, searchQuery]);

  useEffect(async () => {

    if (activity.matchId !== undefined && timer === undefined) {
      setMatchLoading(true);
      setTimer(
        setInterval(async () => {
          return new Promise((resolve, reject) => {
            dispatch(UpdateMatchingActivityDetails({ resolve, reject, matchId: activity.matchId, currentJob: activeJobData, status: status }));
          })
            .then((res) => {
              setActivity(res);
              setFinishTime(res.finishTime);
              setCounter(counter + 1);
            })
            .catch((err) => {
              console.log(err);
            })
        }, 3000)
      );


    }
  }, [activity]);

  useEffect(() => {

    if (finishTime !== undefined && finishTime > 0) {
      clearInterval(timer);
      UpdateMatchTabStatus("done", tabIndex, activity.matchId);
      setStatus('done')
      UpdateMatchId(activity.matchId);
      setMatchLoading(false);
    }
  }, [finishTime]);

  const handleDocumentClick = (e) => {
    if (!popupRef.current) {
      return;
    }
    if (popupRef && !popupRef.current.contains(e.target)) {
      setPopup(false)
    }
  }

  const runSearchAfterTyping = (value) => {
    setSearchQuery(value);
    setActivePage(0)
  };

  const createMatch = (job, criteria) => {
    return new Promise((resolve, reject) => {
      dispatch(CreateMatchingActivityRequest({ resolve, reject, jobId: job.id, criteria }));
    })
      .then((createdMatch) => {
        if (activeTab?.currentJob) {
          setActiveJob(activeTab?.currentJob)
        }
        UpdateMatchTabStatus(MatchStatuses.matching, tabIndex, createdMatch.matchId);
        setActivity(createdMatch);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => { });
  }

  const UpdateJDFileInputChangeHandler = (e) => {
    let file = e.target.files[0];

    let payload = new FormData();

    payload.append("jobDescriptionFile", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYY-MM-DD")
    );
    payload.append("jobId", activeJob.id);

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

  const SubmitForm = (data) => {
    console.log("Pressed")
    // createMatch(activeJob, {
    //   lowestYearsOfExperience: data.minYearsOfExp ? data.minYearsOfExp : "",
    //   highestYearsOfExperience: data.maxYearsOfExp ? data.maxYearsOfExp : "",
    //   language: data.language ? data.language : "",
    //   availability: data.activeCheckbox ? "ACTIVELY_LOOKING, PASSIVELY_LOOKING" : "",
    //   currentJob: activeJob,
    //   status: MatchStatuses.matching
    // });

    if (activeJobLocalStorage) {
      createMatch(activeJobLocalStorage, {
        lowestYearsOfExperience: data.minYearsOfExp ? data.minYearsOfExp : "",
        highestYearsOfExperience: data.maxYearsOfExp ? data.maxYearsOfExp : "",
        language: data.language ? data.language : "",
        availability: data.activeCheckbox ? "ACTIVELY_LOOKING, PASSIVELY_LOOKING" : "",
        currentJob: activeJobLocalStorage,
        status: MatchStatuses.matching
      });
    } else {
      createMatch(activeJob, {
        lowestYearsOfExperience: data.minYearsOfExp ? data.minYearsOfExp : "",
        highestYearsOfExperience: data.maxYearsOfExp ? data.maxYearsOfExp : "",
        language: data.language ? data.language : "",
        availability: data.activeCheckbox ? "ACTIVELY_LOOKING, PASSIVELY_LOOKING" : "",
        currentJob: activeJob,
        status: MatchStatuses.matching
      });
    }
    setStatus(MatchStatuses.matching)

    // if(tabs.length > 1) {
    //   console.log('-------> ', tabs[tabs.length - 2].matchId + 1)
    //   UpdateMatchTabStatus(MatchStatuses.matching, tabIndex, tabs[tabs.length - 2].matchId + 1);
    // } else {
    //   UpdateMatchTabStatus(MatchStatuses.matching, tabIndex);
    // }
  }

  const minLessThanMaxYearsValidation = () => {
    clearErrors('minYearsOfExp');
    clearErrors('maxYearsOfExp');
    if (getFormValues("minYearsOfExp") === "" || getFormValues("maxYearsOfExp") === "") {
      return true;
    }
    return Number(getFormValues("minYearsOfExp")) <= Number(getFormValues("maxYearsOfExp"));
  }

  const customSelectStyles = {
    control: (styles, { isFocused }) => (
      {
        ...styles,
        borderColor: isFocused ? '#3e5eb8' : '#e5e7eb',
        fontSize: '0.875rem',
        paddingLeft: '0.5rem',
        marginTop: '0.25rem',
        marginBottom: '0.25rem',
        outline: 'none',
        boxShadow: isFocused ? '0 0 0 3px hsla(250.60000000000002, 93.9%, 87.1%, 0.45)' : 'none',
        "&:hover": {
          borderColor: isFocused ? '#3e5eb8' : '#e5e7eb'
        }
      }),
    option: styles => ({ ...styles, fontSize: '0.875rem' })
  };

  function addTabMethod() {
    if (currentActiveTab && activeJobData.page == "JOB" && tabs.length > 1) {
      setCurrentActiveTab(false)
      AddTab(true)
    }
  }

  function addActiveJob(item) {
    setIsInitial(true)
    setInitialJob(item)
    setActiveJob(item);
    dispatch(SetActiveJob(item));

  }

  function openEditForm() {
    setIsUpdateDropdownOpen(false);
    setUpdateForm(!updateForm)
    window.history.replaceState(null, "", `/home/matching`)
  }

  return (
    <>
      <div className="shadow">
        {
          popup && <div className="fixed z-20 inset-0 h-1/5 " aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              <div ref={popupRef} style={{ height: "550px" }} className="inline-block align-bottom bg-gray-100 rounded-lg px-4 pt-5 pb-4 text-left overflow-auto shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:max-w-2xl sm:w-full sm:h-full sm:p-6">
                <div className='mb-11 mr-8'>
                  <Button
                    layout="outline"
                    className=" h-7 float-right border-blue blue"
                    size="small"
                    iconLeft={PencilIcon}
                    onClick={() => setIsUpdateDropdownOpen(true)}
                  >
                    Update
                  </Button>
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
                          openEditForm()
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
                <div className=''>
                  <div className="h-aut0 w-full p-2 bg-white">
                    <Switch>
                      {
                        updateForm && <Route
                          path={`/home/matching`}
                          exact
                          // component={UpdateJob}
                          render={(props) => <UpdateJob activeJob={isInitial ? initialJob : activeJob} page="matching" onCancel={() => setUpdateForm(false)} {...props} />}
                        />
                      }

                      <div className="">
                        <Tabs
                          tabList={[
                            { name: "Profile", Component: () => <JobProfile tabIndex={props.tabIndex} tabs={props.tabs} activeJob={isInitial ? initialJob : activeJob} page="matching" /> },
                            { name: "JD file", Component: () => <JDFiles tabIndex={props.tabIndex} activeJob={isInitial ? initialJob : activeJob} tabs={props.tabs} page="matching" /> },
                            { name: "Currently Engaged", Component: () => <MatchedTalents tabIndex={props.tabIndex} activeJob={isInitial ? initialJob : activeJob} tabs={props.tabs} page="matching" /> },
                            {
                              name: "Matching Activities",
                              Component: () => <MatchingActivities tabIndex={props.tabIndex} activeJob={isInitial ? initialJob : activeJob} tabs={props.tabs} page="matching" />,
                            },
                          ]}
                        />
                      </div>


                    </Switch>
                  </div>
                </div>


              </div>
            </div>
          </div>
        }

        {!matchLoading && (
          <>
            <div className="h-16 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2">
              <DebounceInput
                value={searchQuery}
                onChange={(e) => runSearchAfterTyping(e.target.value)}
                className="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative text-sm border0 outline-none focus:outline-none focus:ring w-full pr-10 bg-gray-100 ml-1"
                placeholder="Search jobs by title"
                debounceTimeout={300}
                disabled={activeTab.status !== MatchStatuses.initial}
              />
              <SearchIcon
                className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3 py-3 cursor-pointer"

              />
            </div>

            <div className="h-10 bg-gray-100 relative flex w-full flex-wrap items-stretch py-2 cursor-pointer">
              <span className="px-3 placeholder-blueGray-300 text-blueGray-600 relative text-sm border0 outline-none focus:outline-none focus:ring w-full pr-10 bg-gray-100">
                <span className="text-gray-400">Filter by:</span>
                <span className="text-xs ml-2">{filterBy}</span>
              </span>
              <FilterIcon className="z-10 font-normal absolute text-center text-gray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-3" />
            </div>
          </>
        )}

        {activeTab.status === MatchStatuses.initial && !initialJob && (
          <>
            <ul className="overflow-y-scroll" style={{ maxHeight: "550px" }}>
              {isLoading ? (
                <div
                  className="flex justify-center items-center"
                  style={{ height: "500px" }}
                >
                  <h1>Loading...</h1>
                </div>
              ) : jobsForMatching.length > 0 ? (
                jobsForMatching.map((item, index) => {
                  let ActiveJob = parseInt(activeJob);
                  return (
                    <JobCards
                      jobStatus={item.jobStatus}
                      position={item.jobTitle}
                      talentName=""
                      id={item.id}
                      key={item.id}
                      active={activeJob === index}
                      onClick={() => {
                        addActiveJob(item)
                      }}
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
          </>
        )}

        {activeTab.status !== MatchStatuses.initial && !activeJob && (
          <>
            <ul className="overflow-y-scroll" style={{ maxHeight: "550px" }}>
              {isLoading ? (
                <div
                  className="flex justify-center items-center"
                  style={{ height: "500px" }}
                >
                  <h1>Loading...</h1>
                </div>
              ) : jobsForMatching.length > 0 ? (
                jobsForMatching.map((item, index) => {
                  let ActiveJob = parseInt(activeJob);
                  return (
                    <JobCards
                      jobStatus={item.jobStatus}
                      position={item.jobTitle}
                      talentName=""
                      id={item.id}
                      key={item.id}
                      active={activeJob === index}
                      onClick={() => {
                        addActiveJob(item)
                      }}
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
          </>
        )}


        {activeTab.status === MatchStatuses.initial && initialJob && (
          <>
            <div className="px-4 py-4 shadow">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-bold">{initialJob.jobTitle}</h1>
                  <span className="text-xs text-gray-400">Job #{initialJob.id}</span>
                </div>

              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-600 block">Department: {initialJob.department}</span>
                <span className="text-xs text-gray-600 block">Title: {initialJob.roleName}</span>
              </div>
              <div className="mt-4">
                <span className="text-sm  block">Requirements</span>
                <span className="mt-2 text-xs text-gray-600 block">Level: {initialJob.ranking}</span>
                <span className="text-xs text-gray-600 block">Budgets: {initialJob.minBudget} - {initialJob.maxBudget}</span>
                <span className="text-xs text-gray-600 block">Location: {initialJob.location}</span>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600 block">
                    Year of experience: {initialJob.minYearsOfExp} - {initialJob.maxYearsOfExp}
                  </span>

                  <button
                    onClick={() => {
                      setPopup(!popup)
                    }}
                    className="bg-gray-200 text-black text-md mt-12 rounded w-40 float-right"
                    size="small" type="submit">
                    View Details
                  </button>
                </div>

              </div>
            </div>
            <form onSubmit={handleSubmit(SubmitForm)}>
              <div className="px-4 py-4 shadow">
                <span className="text-sm block">Additional Criteria</span>

                <Label className="mt-4">
                  <span className="text-xs text-gray-400">
                    Minimum year/s of experience:
                  </span>
                  <Input
                    ref={register({
                      min: 0,
                      validate: () => minLessThanMaxYearsValidation()
                    })}
                    type="number"
                    min={0}
                    className="mt-1 h-8 rounded border px-4 active-border-blue"
                    name="minYearsOfExp"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  {formErrors.minYearsOfExp?.type === 'required' && <HelperText valid={false}>Minimum years of experience is required</HelperText>}
                  {formErrors.minYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  {(formErrors.minYearsOfExp?.type === 'validate' || formErrors.maxYearsOfExp?.type === 'validate')
                    && <HelperText valid={false}>Minimum must be lesser than maximum</HelperText>}
                </Label>
                <Label className="mt-4">
                  <div className="col-span-1">
                    <span className="text-xs text-gray-400">
                      Maximum year/s of experience:
                    </span>
                    <Input
                      ref={register({
                        min: 0,
                        validate: () => minLessThanMaxYearsValidation()
                      })}
                      type="number"
                      min={0}
                      className="mt-1 h-8 rounded border px-4 active-border-blue"
                      name="maxYearsOfExp"
                      disabled={activeTab.status !== MatchStatuses.initial}
                    />
                    {formErrors.maxYearsOfExp?.type === 'required' && <HelperText valid={false}>Maximum years of experience is required</HelperText>}
                    {formErrors.maxYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  </div>
                </Label>
                <Label className="mt-2">
                  <span className="text-xs text-gray-400">Language</span>
                  <Controller
                    control={formControl}
                    name="language"
                    render={({ onChange, value, name, ref }) => (
                      <Select
                        inputRef={ref}
                        options={languageOptions}
                        value={languageOptions.find(c => c.value === value)}
                        onChange={val => onChange(val.value)}
                        formatCreateLabel={(inputValue) => `${inputValue}`}
                        styles={customSelectStyles}
                        placeholder=""
                        isDisabled={activeTab.status !== MatchStatuses.initial}
                      />
                    )}
                  />
                </Label>
                <Label className="mt-2">
                  <Input
                    type="checkbox"
                    className="border"
                    ref={register}
                    name="activeCheckbox"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  <span className="ml-2 text-xs text-blue-500">
                    Active or passive only
                  </span>
                </Label>
              </div>

              <Button
                className={matchLoading ? "mt-4 bg-blue rounded w-40 relative ml-auto" : "mt-4 bg-green rounded w-40 relative ml-auto"}
                size="small"
                type="submit"
                disabled={activeTab.status !== MatchStatuses.initial}

              >
                Match
                <ChevronRightIcon className="h-3 w-3 absolute right-4" />
              </Button>
              {/* {matchLoading && <span className="text-xs text-blueGray-600"> Loading...</span>} */}
            </form>
          </>
        )}

        {activeTab.status !== MatchStatuses.initial && activeJob && (
          <>
            <div className="px-4 py-4 shadow">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-bold">{activeJob.jobTitle}</h1>
                  <span className="text-xs text-gray-400">Job #{activeJob.id}</span>
                </div>

              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-600 block">Department: {activeJob.department}</span>
                <span className="text-xs text-gray-600 block">Title: {activeJob.roleName}</span>
              </div>
              <div className="mt-4">
                <span className="text-sm  block">Requirements</span>
                <span className="mt-2 text-xs text-gray-600 block">Level: {activeJob.ranking}</span>
                <span className="text-xs text-gray-600 block">Budgets: {activeJob.minBudget} - {activeJob.maxBudget}</span>
                <span className="text-xs text-gray-600 block">Location: {activeJob.location}</span>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600 block">
                    Year of experience: {activeJob.minYearsOfExp} - {activeJob.maxYearsOfExp}
                  </span>

                  <button
                    onClick={() => {
                      setPopup(!popup)
                    }}
                    className="bg-gray-200 text-black text-md mt-12 rounded w-40 float-right"
                    size="small" type="submit">
                    View Details
                  </button>
                </div>

              </div>
            </div>
            <form onSubmit={handleSubmit(SubmitForm)}>
              <div className="px-4 py-4 shadow">
                <span className="text-sm block">Additional Criteria</span>

                <Label className="mt-4">
                  <span className="text-xs text-gray-400">
                    Minimum year/s of experience:
                  </span>
                  <Input
                    ref={register({
                      min: 0,
                      validate: () => minLessThanMaxYearsValidation()
                    })}
                    type="number"
                    min={0}
                    className="mt-1 h-8 rounded border px-4 active-border-blue"
                    name="minYearsOfExp"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  {formErrors.minYearsOfExp?.type === 'required' && <HelperText valid={false}>Minimum years of experience is required</HelperText>}
                  {formErrors.minYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  {(formErrors.minYearsOfExp?.type === 'validate' || formErrors.maxYearsOfExp?.type === 'validate')
                    && <HelperText valid={false}>Minimum must be lesser than maximum</HelperText>}
                </Label>
                <Label className="mt-4">
                  <div className="col-span-1">
                    <span className="text-xs text-gray-400">
                      Maximum year/s of experience:
                    </span>
                    <Input
                      ref={register({
                        min: 0,
                        validate: () => minLessThanMaxYearsValidation()
                      })}
                      type="number"
                      min={0}
                      className="mt-1 h-8 rounded border px-4 active-border-blue"
                      name="maxYearsOfExp"
                      disabled={activeTab.status !== MatchStatuses.initial}
                    />
                    {formErrors.maxYearsOfExp?.type === 'required' && <HelperText valid={false}>Maximum years of experience is required</HelperText>}
                    {formErrors.maxYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  </div>
                </Label>
                <Label className="mt-2">
                  <span className="text-xs text-gray-400">Language</span>
                  <Controller
                    control={formControl}
                    name="language"
                    render={({ onChange, value, name, ref }) => (
                      <Select
                        inputRef={ref}
                        options={languageOptions}
                        value={languageOptions.find(c => c.value === value)}
                        onChange={val => onChange(val.value)}
                        formatCreateLabel={(inputValue) => `${inputValue}`}
                        styles={customSelectStyles}
                        placeholder=""
                        isDisabled={activeTab.status !== MatchStatuses.initial}
                      />
                    )}
                  />
                </Label>
                <Label className="mt-2">
                  <Input
                    type="checkbox"
                    className="border"
                    ref={register}
                    name="activeCheckbox"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  <span className="ml-2 text-xs text-blue-500">
                    Active or passive only
                  </span>
                </Label>
              </div>

              <Button
                className={matchLoading ? "mt-4 bg-blue rounded w-40 relative ml-auto" : "mt-4 bg-green rounded w-40 relative ml-auto"}
                size="small"
                type="submit"
                disabled={activeTab.status !== MatchStatuses.initial}

              >
                Match
                <ChevronRightIcon className="h-3 w-3 absolute right-4" />
              </Button>
              {/* {matchLoading && <span className="text-xs text-blueGray-600"> Loading...</span>} */}
            </form>
          </>
        )}

        {/* {!activeJob && (
          <>
            <ul className="overflow-y-scroll" style={{ maxHeight: "550px" }}>
              {isLoading ? (
                <div
                  className="flex justify-center items-center"
                  style={{ height: "500px" }}
                >
                  <h1>Loading...</h1>
                </div>
              ) : jobsForMatching.length > 0 ? (
                jobsForMatching.map((item, index) => {
                  let ActiveJob = parseInt(activeJob);
                  return (
                    <JobCards
                      jobStatus={item.jobStatus}
                      position={item.jobTitle}
                      talentName=""
                      id={item.id}
                      key={item.id}
                      active={activeJob === index}
                      onClick={() => {
                        addActiveJob(item)
                      }}
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
          </>
        )}
        {activeJob && (
          <>
            <div className="px-4 py-4 shadow">
              <div className="flex justify-between">
                <div>
                  <h1 className="font-bold">{activeJob.jobTitle}</h1>
                  <span className="text-xs text-gray-400">Job #{activeJob.id}</span>
                </div>

              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-600 block">Department: {activeJob.department}</span>
                <span className="text-xs text-gray-600 block">Title: {activeJob.roleName}</span>
              </div>
              <div className="mt-4">
                <span className="text-sm  block">Requirements</span>
                <span className="mt-2 text-xs text-gray-600 block">Level: {activeJob.ranking}</span>
                <span className="text-xs text-gray-600 block">Budgets: {activeJob.minBudget} - {activeJob.maxBudget}</span>
                <span className="text-xs text-gray-600 block">Location: {activeJob.location}</span>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-600 block">
                    Year of experience: {activeJob.minYearsOfExp} - {activeJob.maxYearsOfExp}
                  </span>

                  <button
                    onClick={() => {
                      setPopup(!popup)
                    }}
                    className="bg-gray-200 text-black text-md mt-12 rounded w-40 float-right"
                    size="small" type="submit">
                    View Details
                  </button>
                </div>

              </div>
            </div>
            <form onSubmit={handleSubmit(SubmitForm)}>
              <div className="px-4 py-4 shadow">
                <span className="text-sm block">Additional Criteria</span>

                <Label className="mt-4">
                  <span className="text-xs text-gray-400">
                    Minimum year/s of experience:
                  </span>
                  <Input
                    ref={register({
                      min: 0,
                      validate: () => minLessThanMaxYearsValidation()
                    })}
                    type="number"
                    className="mt-1 h-8 rounded border px-4 active-border-blue"
                    name="minYearsOfExp"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  {formErrors.minYearsOfExp?.type === 'required' && <HelperText valid={false}>Minimum years of experience is required</HelperText>}
                  {formErrors.minYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  {(formErrors.minYearsOfExp?.type === 'validate' || formErrors.maxYearsOfExp?.type === 'validate')
                    && <HelperText valid={false}>Minimum must be lesser than maximum</HelperText>}
                </Label>
                <Label className="mt-4">
                  <div className="col-span-1">
                    <span className="text-xs text-gray-400">
                      Maximum year/s of experience:
                    </span>
                    <Input
                      ref={register({
                        min: 0,
                        validate: () => minLessThanMaxYearsValidation()
                      })}
                      type="number"
                      className="mt-1 h-8 rounded border px-4 active-border-blue"
                      name="maxYearsOfExp"
                      disabled={activeTab.status !== MatchStatuses.initial}
                    />
                    {formErrors.maxYearsOfExp?.type === 'required' && <HelperText valid={false}>Maximum years of experience is required</HelperText>}
                    {formErrors.maxYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
                  </div>
                </Label>
                <Label className="mt-2">
                  <span className="text-xs text-gray-400">Language</span>
                  <Controller
                    control={formControl}
                    name="language"
                    render={({ onChange, value, name, ref }) => (
                      <Select
                        inputRef={ref}
                        options={languageOptions}
                        value={languageOptions.find(c => c.value === value)}
                        onChange={val => onChange(val.value)}
                        formatCreateLabel={(inputValue) => `${inputValue}`}
                        styles={customSelectStyles}
                        placeholder=""
                        isDisabled={activeTab.status !== MatchStatuses.initial}
                      />
                    )}
                  />
                </Label>
                <Label className="mt-2">
                  <Input
                    type="checkbox"
                    className="border"
                    ref={register}
                    name="activeCheckbox"
                    disabled={activeTab.status !== MatchStatuses.initial}
                  />
                  <span className="ml-2 text-xs text-blue-500">
                    Active or passive only
                  </span>
                </Label>
              </div>

              <Button
                className={matchLoading ? "mt-4 bg-blue rounded w-40 relative ml-auto" : "mt-4 bg-green rounded w-40 relative ml-auto"}
                size="small"
                type="submit"
                disabled={activeTab.status !== MatchStatuses.initial}

              >
                Match
                <ChevronRightIcon className="h-3 w-3 absolute right-4" />
              </Button>
              {/* {matchLoading && <span className="text-xs text-blueGray-600"> Loading...</span>} */}

      </div>



    </>
  );
};

export default React.memo(EmptyMatching);
