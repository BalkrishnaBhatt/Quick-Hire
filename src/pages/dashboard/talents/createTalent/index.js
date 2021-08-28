import { useState, useEffect } from "react";
import { Button } from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import TalentForm from "./talentForm";

import {
  CreateTalentRequest,
  UnsetResumeCreate,
  SetAfterCreateTalent
} from "store/ActionCreators/talents";

const tabList = [{ name: "Talent Details" }];

const CreateTalent = (props) => {
  useEffect(() => {
    return () => dispatch(UnsetResumeCreate());
  }, []);

  const dispatch = useDispatch();

  const { ResumeCreate, talentCount } = useSelector((state) => state.talents);

  const [openTab, setOpenTab] = useState(0);
   const { register, 
          handleSubmit, 
          formState: { errors }, 
          setError,
          clearErrors,
          getValues
        } = useForm();

  // TALENT FORM PROPS
  const [uploadedRequirements, setUploadedRequirements] = useState([]);
  const [talentAvatar, setTalentAvatar] = useState({ file: "", img: "" });

  //EVENT HANDLERS
  const confirmHandler = (data) => {
    const formData = new FormData();

    formData.append(
      "talentDetails",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("attachedTalentImage", talentAvatar.file);

    const newAttachments = [...uploadedRequirements].filter((x) => x instanceof File);
    newAttachments.map((value) => {
      formData.append("attachedDocuments", value);
      return value;
    });  

    return new Promise((resolve, reject) => {
      dispatch(CreateTalentRequest({ resolve, reject, data: formData }));
    })
      .then((res) => {
        dispatch(SetAfterCreateTalent({ page: Math.ceil((talentCount+1)/10)-1, talent: res.id }));
        props.history.push("/home/talents/" + res.id);
      })
      .catch((err) => {
        const error = err.response?.data;
        if(error.errorMessage !== undefined) {
          setError("backendError", {
            type: "duplicate",
            message: error.errorMessage,
          });
        }
      })
      .finally(() => {});
  };

  const cancelHandler = () => {
    props.history.goBack();
    //props.history.push("/home/talents");
  };

  return (
    <div className="ml-10">
      <div className="grid grid-cols-10 py-4">
        <div className="col-span-8">
          <form onSubmit={handleSubmit(confirmHandler)}>
            <div className="flex justify-between">
              <h1 className="text-lg font-bold text-gray-600">
                CREATE NEW TALENT
              </h1>
              <div>
                <Button className="bg-blue mr-2" size="small" type="submit">
                  Confirm
                </Button>
                <Button size="small" layout="outline" onClick={cancelHandler}>
                  Cancel
                </Button>
              </div>
            </div>
            <div className="pt-2">
              <ul className="flex mb-0 list-none ml-2">
                {tabList.map((tab, i) => (
                  <li className="-mb-px mr-2 last:mr-0 text-center" key={i}>
                    <a
                      className={
                        "text-xs font-bold uppercase px-5 py-3  rounded-t-lg block leading-normal border border-b-0 " +
                        (openTab === i
                          ? "blue bg-gray-100"
                          : "text-gray-300 bg-white")
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTab(i);
                      }}
                      data-toggle="tab"
                      href="#link1"
                      role="tablist"
                    >
                      {tab.name}
                    </a>
                  </li>
                ))}
              </ul>
              <TalentForm
                register={register}
                formErrors={errors}
                clearErrors={clearErrors}
                getFormValues={getValues}
                style={
                  openTab === 0 ? { display: "block" } : { display: "none" }
                }
                uploadedRequirements={uploadedRequirements}
                setUploadedRequirements={setUploadedRequirements}
                talentAvatar={talentAvatar}
                setTalentAvatar={setTalentAvatar}
                defaults={ResumeCreate.talentDetails}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTalent;
