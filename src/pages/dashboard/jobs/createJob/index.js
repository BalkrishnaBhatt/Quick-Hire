import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@windmill/react-ui";
import JobForm from "./jobForm";

import { CreateJobRequest, UnsetJDCreate, SetAfterCreateJob } from "store/ActionCreators/jobs";

const tabList = [{ name: "Job Details" }];

const CreateJob = (props) => {
  const dispatch = useDispatch();
  const { register, 
          handleSubmit, 
          control, 
          formState: { errors }, 
          setError,
          clearErrors,
          getValues
        } = useForm();

  const { jobDetails } = useSelector((state) => state.jobs.JDCreate);
  const { jobCount } = useSelector((state) => state.jobs);

  const [openTab, setOpenTab] = useState(0);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    return () => dispatch(UnsetJDCreate());
  }, []);

  const SubmitForm = (data) => {
    let formData = new FormData();
    formData.append(
      "details",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    documents.map((value) => {
      formData.append("attachments", value);
      return value;
    });

    return new Promise((resolve, reject) => {
      dispatch(CreateJobRequest({ resolve, reject, data: formData }));
    })
      .then((res) => {
        dispatch(SetAfterCreateJob({ page: Math.ceil((jobCount+1)/10)-1, job: res.id }));
        props.history.push("/home/jobs/" + res.id);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  };

  const cancelHandler = () => {
    props.history.push("/home/jobs");
  };

  return (
    <form onSubmit={handleSubmit(SubmitForm)}>
      <div className="ml-10">
        <div className="grid grid-cols-10 py-4">
          <div className="col-span-8">
            <div className="flex justify-between">
              <h1 className="text-lg font-bold text-gray-600">
                CREATE NEW JOB
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
              <JobForm
                register={register}
                formControl={control}
                formErrors={errors}
                clearErrors={clearErrors}
                getFormValues={getValues}
                style={
                  openTab === 0 ? { display: "block" } : { display: "none" }
                }
                documents={documents}
                setDocuments={setDocuments}
                defaults={{ ...jobDetails }}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateJob;
