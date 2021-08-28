import { Button } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TalentForm from "../createTalent/talentForm";
import * as TalentAPI from "services/Talents";

import {
  GetActiveTalent,
  UpdateTalentRequest,
  UnsetResumeUpdate,
  SetActiveTalent
} from "store/ActionCreators/talents";

const UpdateTalent = (props) => {
  const { id } = props.match.params;

  const dispatch = useDispatch();
  const activeTalent = useSelector((state) => state.talents.activeTalent);
  const ResumeUpdate = useSelector((state) => state.talents.ResumeUpdate);

  const { register, 
          handleSubmit, 
          formState: { errors }, 
          setError,
          clearErrors,
          getValues 
        } = useForm();

  const [talentAvatar, setTalentAvatar] = useState({ file: "", img: "" });
  const [uploadedRequirements, setUploadedRequirements] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  // const [deleteFileError, setDeleteFileError] = useState("");

  useEffect(() => {
    if (id && activeTalent.id != id) {
      dispatch(GetActiveTalent({ talentId: id }));
    }

    setTalentAvatar({
      file: activeTalent.talentImageLink,
      img: activeTalent.talentImageLink,
    });

    setUploadedRequirements(activeTalent.jobDocuments);

    return () => dispatch(UnsetResumeUpdate());
  }, [activeTalent]);

  const UpdateHandler = async (data) => {
    // let educationFilled

    //    educationFilled = data.education && data.education.some((field) => {
    //     return field.length > 0
    //  });

    // if(!educationFilled) {
    //   setError("educationFilled", {
    //     type: "required",
    //     message: "Education required",
    //   });
    //   return;
    // }

    let deleteFileError = ""
    let deleteFileFormData = new FormData();

    if(deletedFiles.length > 0) {
      deleteFileFormData.append(
        "deleteFiles",
        new Blob([JSON.stringify({ ids: deletedFiles })], {
          type: "application/json",
        })
      );
      
      try {
        await TalentAPI.CheckDeleteFileError({ id: activeTalent.id, deleteFiles: deleteFileFormData})
        await TalentAPI.CheckLatestResumeFileError({ id: activeTalent.id })
      } catch (error) {
        console.log("Upload error --> ", error.response?.data)
  
        deleteFileError = error.response?.data?.errorMessage ? error.response.data.errorMessage : ""
      }
    }


    if(deleteFileError === "") {
      let payload = { ...data };
        
      const formData = new FormData();
  
      formData.append(
        "talentDetails",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
      
      formData.append("attachedTalentImage", talentAvatar.file);
  
      const newAttachments = [...uploadedRequirements].filter((x) => x instanceof File);
      newAttachments.map((value) => {
        formData.append("attachedDocuments", value);
        return value;
      });    
  
      formData.append(
        "deleteFiles",
        new Blob([JSON.stringify({ ids: deletedFiles })], {
          type: "application/json",
        })
      );
  
      return new Promise((resolve, reject) => {
        dispatch(UpdateTalentRequest({ resolve, reject, data: formData }));
      })
        .then((res) => {
          dispatch(SetActiveTalent(res))
          props.history.push("/home/talents/" + id);
          // Action if successfully updated
        })
        .catch((err) => {
          const error = err.response?.data;
          console.log('errr>>>>>>',error);
          //Action if update failed
          setError("backendError", {
                type: "update",
                message: error.errorMessage,
              });
        })
        .finally(() => {});
    } else {
      setError("backendError", {
        type: "delete",
        message: deleteFileError,
      });
    }
 
  };

  const DeleteFileHandler = (fileId) => {
    console.log("delete files --> ", fileId)
    setDeletedFiles([...deletedFiles, fileId]);
  };

  const CancelHandler = () => {
    props.history.goBack();
  };

  return (
    <form onSubmit={handleSubmit(UpdateHandler)}>
      <div className="h-16 bg-blue py-4 flex justify-between px-4 mb-2">
        <div className="justify-start">
          <span className="text-white">Edit Talent #12345</span>
        </div>
        <div>
          <Button
            layout="outline"
            className="ml-2 h-7 border-blue blue bg-white"
            size="small"
            type="submit"
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
      <TalentForm
        register={register}
        formErrors={errors}
        clearErrors={clearErrors}
        getFormValues={getValues}
        uploadedRequirements={uploadedRequirements}
        setUploadedRequirements={setUploadedRequirements}
        talentAvatar={talentAvatar}
        setTalentAvatar={setTalentAvatar}
        defaults={
          Object.entries(ResumeUpdate).length
            ? ResumeUpdate.talentDetails
            : activeTalent
        }
        deleteFileHandler={DeleteFileHandler}
      />
    </form>
  );
};

export default UpdateTalent;
