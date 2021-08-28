import { Button } from "@windmill/react-ui";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import JobForm from "../createJob/jobForm";
import { GetActiveJob, UpdateJobRequest, SetActiveJob, UnsetJDUpdate } from "store/ActionCreators/jobs";

const UpdateJob = (props) => {
  const { id } = props.match.params;


  // HOOKS
  const history = useHistory();
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState([]);
  const [deleteFiles, setDeleteFiles] = useState([]);

  const { register, 
          handleSubmit, 
          control, 
          formState: { errors }, 
          setError,
          clearErrors,
          getValues
        } = useForm();

  let { activeJob, JDUpdate } = useSelector((state) => state.jobs);

  if (props.page == "matching"){
    activeJob = props.activeJob
  }
  // EVENT HANDLER
  const UpdateHandler = (data) => {
    // if(data.languageRequirement1 === "" && data.languageRequirement2 === "" && data.languageRequirement2 === "") {
    //   setError("languages", {
    //     type: "required",
    //     message: "Language required",
    //   });
    //   return;
    // }

    let formData = new FormData();
    let attachedDocuments = [...documents].filter((x) => x instanceof File);

    formData.append(
      "details",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    formData.append(
      "deleteFiles",
      new Blob([JSON.stringify({ ids: deleteFiles })], {
        type: "application/json",
      })
    );

    attachedDocuments.map((value) => {
      formData.append("attachments", value);
      return value;
    });

    return new Promise((resolve, reject) => {
      dispatch(UpdateJobRequest({ resolve, reject, data: formData }));
    })
      .then((res) => {
        dispatch(SetActiveJob(res));
        props.history.push("/home/jobs/" + id);
      })
      .catch((err) => {});
  };

  const CancelHandler = () => {
    if(props?.onCancel) {
      props.onCancel()
    } else {
      history.goBack();
    }
  };

  const DeleteFileHandler = (id) => {
    setDeleteFiles([...deleteFiles, id]);
  };

  useEffect(() => {
    if (id && activeJob.id != id) {
      dispatch(GetActiveJob({ jobId: id }));
    }

    setDocuments(activeJob.jobDocuments);
  }, [activeJob]);

  useEffect(() => {
    return () => dispatch(UnsetJDUpdate());
  }, []);

  return (
    <form onSubmit={handleSubmit(UpdateHandler)}>
      <div className="h-16 bg-blue py-4 flex justify-between px-4 mb-2">
        <div className="justify-start">
          <span className="text-white">Edit Job #{activeJob.id}</span>
        </div>
        <div>
          <Button
            type="submit"
            layout="outline"
            className="ml-2 h-7 border-blue blue bg-white"
            size="small"
          >
            Update
          </Button>
          <Button
            layout="outline"
            className="ml-2 h-7 border-blue bg-white"
            size="small"
            onClick={CancelHandler}
          >
            Cancel
          </Button>
        </div>
      </div>
      <JobForm
        register={register}
        formControl={control}
        formErrors={errors}
        clearErrors={clearErrors}
        getFormValues={getValues}
        documents={documents}
        setDocuments={setDocuments}
        // defaults={{ ...JDUpdate.jobDetails, ...activeJob }}
        defaults={ Object.keys(JDUpdate).length > 0 ? {...JDUpdate.jobDetails} : {...activeJob}}
        deleteFileHandler={DeleteFileHandler}
      />
    </form>
  );
};

export default UpdateJob;
