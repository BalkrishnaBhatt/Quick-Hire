/**
 * TODO
 * File version
 */
import React, {useEffect, useState} from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@windmill/react-ui";
import moment from "moment";
import {useSelector} from "react-redux";
import { VALID_DISPLAY_JOB_DOCUMENT_TYPES } from "helpers/constants";
import downloadIcon  from "icons/download.svg";
import IframeViewer from 'components/IframeViewer'

const JDFiles = (props) => {
  const {jobDocuments} = useSelector((state) => state.jobs.activeJob);
  const[loading, setLoading] = useState(true)
  const [jobDocumentsFillter,setJobDocumentsFillter] =useState([]);

  useEffect(() => {
    let arr=[];
    jobDocuments.map((item,index)=>{
      if (VALID_DISPLAY_JOB_DOCUMENT_TYPES.includes(item.documentType)) {
          arr.push(item);
      }
    });

    let sortedArr = arr.sort((a, b) => b.uploadTime - a.uploadTime)

    setJobDocumentsFillter(sortedArr);
  }, [jobDocuments]);

  if (!jobDocumentsFillter.length) {
    return (
      <div
        className="flex items-center justify-center text-gray-400"
        style={{ height: "500px" }}
      >
        No documents uploaded
      </div>
    );
  }

  function getFileExtension(filename){
    // get file extension
    const extension = filename.split('.').pop();
    return extension;
  }
let length = jobDocumentsFillter.length+1;
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-center">
          <TableCell>File</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Version</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobDocumentsFillter.map((item, index) => {
          const date = moment(item.uploadTime);
          const fileSize = item.size * 0.000001;
          for (let ver=0; ver<jobDocumentsFillter.length+1;ver--){
            length--
          return (
            <React.Fragment key={index}>
              <TableRow key={item.documentId} className="text-center bg-gray-100">
                <TableCell align="left"  >
                  <a
                    className="ml-2 text-xs "
                    rel="noreferrer"
                    style={{wordWrap:true}}
                  >
                    {item.fileName.length >20?item.fileName.slice(0,20):item.fileName}&emsp;<span className={'text-gray-400'}>{fileSize.toFixed(3)} MB</span>
                  </a>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-400">
                    {date.format("MM/DD/YYYY h:mm")}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-gray-400">{'Ver'}{length }&nbsp;{index===0?('(Present)'):''}</span>
                </TableCell>
                <TableCell align="center">
                  <a href={item.downloadUri} target="_blank" style={{width:30}} title="Download File" download>
                    <img src={downloadIcon} style={{height:20,width:20,resize:'contain'}} />
                  </a>
                </TableCell>
              </TableRow>

              {index === 0?
                <TableRow key={index} >
                  <TableCell colSpan={5}>
                    {loading ? (
                      <div
                        className="flex justify-center items-center"
                        style={{ height: "600px" }}
                      >
                        <h1>Loading...</h1>
                      </div>
                    ) : null}
                    <IframeViewer
                      url={item.downloadUri}
                      className={getFileExtension(item.fileName)}
                      loading={loading}
                      stopLoading={(value) => setLoading(value)}
                    />
                  </TableCell>
                </TableRow>
              :null}
            </React.Fragment>
          );
        }})}
      </TableBody>
    </Table>
  );
};

export default JDFiles;