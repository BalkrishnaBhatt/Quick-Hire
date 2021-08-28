import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Modal,
  ModalBody,
  Button,
  Dropdown,
  DropdownItem
} from "@windmill/react-ui";
import { useState, useRef } from "react";
import { Switch, Route } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { ExternalLinkIcon, PencilIcon, UploadIcon } from "icons";
import Tabs from "components/tabs";
import JobProfile from "pages/dashboard/jobs/main/JobProfile";
import JDFiles from "pages/dashboard/jobs/main/JDFiles";
import MatchedTalents from "pages/dashboard/jobs/main/matchedTalents";
import MatchingActivities from "pages/dashboard/jobs/main/matchingActivities";
import { useEffect } from "react";
import API from "services/API";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import * as JobsAPI from "services/Jobs";
import {
  SetActiveJob,
  JDUpdateRequest
} from "store/ActionCreators/jobs";
import UpdateJob from 'pages/dashboard/jobs/UpdateJob/index'

const PAGE_SIZE = 10;

const JobModalContent = (props) => {
  return (
    <div style={{ height: "500px" }} className="overflow-x-scroll pt-5">
      <div className="h-16 bg-gray-100 py-4  px-4 mb-2">
        <h1 className="font-bold text-gray-400">JOB DETAILS</h1>
      </div>
      <Tabs
        tabList={[
          { name: "Profile", Component: JobProfile },
          { name: "JD file", Component: JDFiles },
          { name: "Matched Talents", Component: MatchedTalents },
          {
            name: "Matching Activities",
            Component: MatchingActivities,
          },
        ]}
      />
    </div>
  );
};

const MatchedJobs = (props) => {
  const {
    activePage,
    talentId
  } = props;

  const dispatch = useDispatch();

  const currentJob = useSelector(state => state.jobs.activeJob)

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [currentActivePage, setActivePage] = useState(0);
  const [matchedJobs,setMatchedJobs] = useState([])
  const [totalPage,setTotalPage]=useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [activeJobId, setActiveJobId] = useState('')
  const [updateForm, setUpdateForm] = useState(false)

  const UpdateJDFileInputRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick)

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      await  API.get('talents/matches/results/jobs/'+talentId+'?page='+currentActivePage+'&size=10')
       .then((res)=>{
         setMatchedJobs(res);
         setIsLoading(false)
       })
       .catch(err => setIsLoading(false))
       await API.get('talents/matches/results/jobs/count/'+talentId)
       .then((res)=>{
        setTotalPage(res.count)
      })
      .catch(err => setIsLoading(false))
    }

    init();
  }, [currentActivePage]);

  useEffect(() => {
    if(currentJob.id === activeJobId) {
      setPopup(true)
    }
  }, [currentJob, activeJobId])


  const handleDocumentClick = (e) => {
    if (!popupRef.current) {
      return;
    }
    if (popupRef && !popupRef.current.contains(e.target)) {
      setPopup(false)
    }
  }

  const addActiveJob = async (item) => {
    if(item?.jobId) {
      const currentJobDetail = await JobsAPI.GetSpecificJob(item?.jobId)

      setActiveJobId(item?.jobId)
      dispatch(SetActiveJob(currentJobDetail));
    }
  }

  const UpdateJDFileInputChangeHandler = (e) => {
    let file = e.target.files[0];

    let payload = new FormData();

    payload.append("jobDescriptionFile", file);
    payload.append(
      "lastModifiedDate",
      moment(file.lastModifiedDate).format("YYYY-MM-DD")
    );
    payload.append("jobId", activeJobId);

    // setIsUploading(true);

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
        // setIsUploading(false);
      });
  };

  function openEditForm() {

    setIsUpdateDropdownOpen(false);
    setUpdateForm(!updateForm)
    window.history.replaceState(null, "", `/home/talents/${talentId}`)
  }

  if (matchedJobs.length===0 && !isLoading) {
    return (
      <>
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height: "500px" }}
      >
        No matched jobs yet
      </div>
     </>
    );
  }

  return (
    <div> 
      {popup && 
        (          
          <div className="fixed z-20 inset-0 h-1/5 " aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                          exact
                          path={`/home/talents/${talentId}`}
                          // component={UpdateJob}
                          render={(props) => <UpdateJob onCancel={() => setUpdateForm(false)} {...props} />}
                        />
                      }

                      <div className="">
                        <Tabs
                          tabList={[
                            { name: "Profile", Component: JobProfile },
                            { name: "JD file", Component: JDFiles },
                            { name: "Currently Engaged", Component: MatchedTalents },
                            {
                              name: "Matching Activities",
                              Component: () => <MatchingActivities />,
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
        )
      }

      {isLoading ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "500px" }}
        >
          <h1>Loading...</h1>
        </div>        
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell style={{width:'45%'}} >Matched Job</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Match time</TableCell>
                <TableCell>Job details</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              { matchedJobs.map((item,index)=>{   
                return(
                <TableRow key={index}>
                  <TableCell>
                    <div className="items-center  text-xs " >
                      <span >
                      {item.title+"\n"}
                      </span>
                      <span >
                      {'('+item.companyName+')'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{item.score}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{ moment(item.matchTime).format("YYYY-MM-DD hh:mm")}</span>
                  </TableCell>
                  <TableCell>
                    <a
                      // href="#"
                      onClick={() => addActiveJob(item)}
                      style={{ cursor: 'pointer' }}
                    >
                      <ExternalLinkIcon className="h-5 w-5 mx-auto"/>
                    </a>
                  </TableCell>
                </TableRow>)
              })}
            </TableBody>
          </Table>
          <div className="py-5 px-5 flex justify-center">
          <ReactPaginate
            pageCount={Math.ceil(totalPage / 10)}
            previousLabel="&#8592;"
            nextLabel="&#8594;"
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            breakLabel={"..."}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            onPageChange={(page) => setActivePage(page.selected)}
            forcePage={currentActivePage}
          />
          </div>
        </>
      )}

    </div>
  );
};

export default MatchedJobs;
