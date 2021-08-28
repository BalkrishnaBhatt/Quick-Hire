import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@windmill/react-ui";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import { ExternalLinkIcon } from "icons";
import { useEffect } from "react";
import API from "services/API";
import moment from "moment";
import { useSelector } from "react-redux";

const PAGE_SIZE = 10;

const MatchingActivities = (props) => {
  const {
    talentId
  } = props;

  const currentJob = useSelector(state => state.jobs.activeJob)

  const [currentActivePage, setActivePage] = useState(0);
  const [matchedJobs,setMatchedJobs] = useState([])
  const [totalPage,setTotalPage]=useState(0)
  const [isLoading, setIsLoading] = useState(false)

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
                <TableCell style={{width:'20%'}}>Match time</TableCell>
                <TableCell style={{width:'40%'}}>Matched Job</TableCell>
                <TableCell style={{width:'30%'}}>Activities</TableCell>
                <TableCell >Remarks</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* { matchedJobs.map((item,index)=>{   
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
              })} */}


              { matchedJobs.map((item,index)=>{   
                return(
                <TableRow key={index}>
                  <TableCell>
                    <span className="text-xs">{ moment(item.matchTime).format("YYYY-MM-DD hh:mm")}</span>
                  </TableCell>
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
                    <div>
                      <span style={{ color: 'green' }} className="text-xs">Matched </span>
                      <span className="text-xs">{`(${item.score}) `}</span>
                      <span className="text-xs">{`by ${item.recruiterFirstName} ${item.recruiterLastName}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{item.remarks}</span>
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

export default MatchingActivities;
