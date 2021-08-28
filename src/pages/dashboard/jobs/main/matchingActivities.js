import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@windmill/react-ui";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { GetMatchingActivities } from "store/ActionCreators/matching";
import * as MatchingAPI from "services/Matching";

const MatchingActivities = (props) => {
  let { jobId } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState([])

  const { jobMatchingActivities } = useSelector((state) => state.matching);
  const activeMatchingActivities = jobMatchingActivities[jobId];

  useEffect(() => {

    const init = async () => {
      if (activeMatchingActivities?.length > 0) {
        let tempArr = []

        let responseArr = await Promise.all(

          await activeMatchingActivities.map(async (item) => {
            const response = await MatchingAPI.GetMatchingActivityTalent(item.matchingActivityId, 0, item.matchedTalentCount)

            await response.map(res => {
              let obj = { ...res }
              obj.finishTime = item.finishTime;
              obj.remarks = item.remarks;
              obj.recruiterFirstName = item.recruiterFirstName;
              obj.recruiterLastName = item.recruiterLastName;

              tempArr.push(obj)
            })
          })
        )
        setData(tempArr)
      }
    }

    init()
  }, [activeMatchingActivities])

  useEffect(() => {
    dispatch(GetMatchingActivities({ jobId }));
  }, [jobId]);

  if (!data.length > 0) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "500px" }}
      >
        <h1>Loading...</h1>
      </div>
    )
  }

  if (!activeMatchingActivities?.length) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height: "500px" }}
      >
        No matching activities yet
      </div>
    );
  }

  return (
    <div class="custom-bar overflow-scroll">
      <div style={{ height: '530px', width: '750px' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell style={{ width: '20%' }}>Matched Time</TableCell>
              <TableCell style={{ width: '24%' }}>Matched Talents</TableCell>
              <TableCell style={{ width: '30%' }}>Activities</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <span className="ml-2 text-xs">{item.finishTime.slice(0, item.finishTime.length - 7)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="text-xs">{item.firstName} </span>
                      <span className="text-xs">{item.lastName} </span>
                      <span className="text-xs">{`(#${item.talentId})`}</span>
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
                    <span className="text-xs break-all">{item.remarks || "No remarks"}</span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MatchingActivities;
