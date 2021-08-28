import { useRef, useState, useEffect } from "react";
import { Label, Input, Textarea, Select, HelperText, TableRow, TableCell,Table } from "@windmill/react-ui";
import { TrashIcon, DownloadIcon, Delete } from "icons";
import PropTypes from "prop-types";
import moment from "moment";

import { 
  DUPLICATE_EMAIL, 
  DUPLICATE_PHONE, 
  errDuplicate_Email, 
  errDuplicate_Phone, 
  errMismatch_Email_Resume, 
  errMismatch_Latest_Resume_Phone_Email, 
  errMismatch_Profile_phome_Latest_Resume, 
  MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME, 
  MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL, 
  MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME, 
  OTHERERR, 
  DUPLICATE_PHONE_IN_UPLOADED_RESUME,
  DUPLICATE_EMAIL_IN_UPLOADED_RESUME,
  DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME,
  VALID_DISPLAY_TALENT_DOCUMENT_TYPES
} from "helpers/constants";

import { TalentAvailability, TalentEmploymentStatus } from "helpers/constants";

const TalentForm = (props) => {
  const {
    register,
    uploadedRequirements = [],
    setUploadedRequirements,
    talentAvatar,
    setTalentAvatar,
    defaults,
    deleteFileHandler,
    formErrors = {},
    clearErrors,
    getFormValues,
  } = props;

  const [experiences, setExperiences] = useState([""]);
  const [educations, setEducations] = useState([""]);
  const [educationError, setEducationError] = useState(false);

  const uploadPhotoRef = useRef(null);

  useEffect(() => {
    defaults?.experience && setExperiences(defaults.experience);
    defaults?.education && setEducations(defaults.education);
  }, [defaults]);

  const deleteFile = (index) => {
    let requirements = [...uploadedRequirements]; //create copy of the uploadedRequirements;
    requirements.splice(index, 1);
    setUploadedRequirements(requirements);
  };

  const deleteUploadedFile = (id) => {
    let uploadedFiles = [...uploadedRequirements].filter(
      (x) => x.documentId !== id
    );
    setUploadedRequirements(uploadedFiles);
    deleteFileHandler && deleteFileHandler(id);
  };

  const fileInputChangeHandler = (e) => {
    const files = e.target.files;

    const uploadedFiles = Object.keys(files).map((key) => {
      return files[key];
    });

    setUploadedRequirements([...uploadedRequirements, ...uploadedFiles]);
  };

  const AvatarUploadHandler = (e) => {
    let file = e.target.files[0];
    setTalentAvatar({ file, img: URL.createObjectURL(file) });
  };

  const clearBackendErrors = () => {
    clearErrors('backendError');
  }

  const educationValidation = () => {
    const educationValues = educations.map((value, index) => {
      return getFormValues(`education[${index}]`);
    });

    const educationFilled = educationValues.some((field) => {
      return field.length > 0
    });
    setEducationError(!educationFilled);

    return educationFilled;
  }

  return (
    <div className="py-5 px-5 bg-white rounded" style={{ ...props.style }}>
      {formErrors.backendError?.type === 'duplicate' && <HelperText valid={false}>Form error: {formErrors.backendError?.message===DUPLICATE_PHONE?errDuplicate_Phone:formErrors.backendError?.message===DUPLICATE_EMAIL?errDuplicate_Email:formErrors.backendError?.message===MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL?errMismatch_Latest_Resume_Phone_Email:formErrors.backendError?.message===MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME?errMismatch_Email_Resume:formErrors.backendError?.message===MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME?errMismatch_Profile_phome_Latest_Resume: OTHERERR}</HelperText>}
      {formErrors.backendError?.type === 'update' && <HelperText valid={false}>Form error: {formErrors.backendError?.message===DUPLICATE_PHONE?errDuplicate_Phone:formErrors.backendError?.message===DUPLICATE_EMAIL?errDuplicate_Email:formErrors.backendError?.message===MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL?errMismatch_Latest_Resume_Phone_Email:formErrors.backendError?.message===MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME?errMismatch_Email_Resume:formErrors.backendError?.message===MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME?errMismatch_Profile_phome_Latest_Resume: OTHERERR}</HelperText>}
      {formErrors.backendError?.type === 'delete' && <HelperText valid={false}>Form error: {formErrors.backendError?.message === "DUPLICATE_PHONE_IN_UPLOADED_RESUME" ? DUPLICATE_PHONE_IN_UPLOADED_RESUME : formErrors.backendError?.message === "DUPLICATE_EMAIL_IN_UPLOADED_RESUME" ? DUPLICATE_EMAIL_IN_UPLOADED_RESUME : formErrors.backendError?.message === "DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME" ? DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME : formErrors.backendError?.message === "MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME" ? MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME : formErrors.backendError?.message === "MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME" ? MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME : formErrors.backendError?.message === "MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL" ? MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL : OTHERERR}</HelperText>}
      <div className="grid grid-cols-5">

        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Talent number</span>
            <Input
              type="text"
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="id"
              defaultValue={defaults?.id}
              ref={register}
              readOnly
            />
          </Label>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs block">Availability:</span>
            {TalentAvailability.map((item) => {
              return (
                <Label radio key={item.value}>
                  <Input
                    type="radio"
                    name="availability"
                    className="border ml-2"
                    value={item.value}
                    ref={register}
                    defaultChecked={defaults?.availability === item.value}
                  />
                  <span className="ml-1 mr-2 text-gray-400 text-xs">
                    {item.text}
                  </span>
                </Label>
              );
            })}
          </div>
          {/* {formErrors.availability?.type === 'required' && <HelperText valid={false}>Availability is required</HelperText>} */}
        </div>
        <div className="col-start-6">
          <input
            type="file"
            hidden
            ref={uploadPhotoRef}
            onChange={AvatarUploadHandler}
            accept="image/*"
          />
          <img
            className="rounded-full object-cover border border-gray-300 px-1 py-1"
            src={
              talentAvatar.img ? talentAvatar.img : "/images/upload_icon.png"
            }
            onClick={() => uploadPhotoRef.current.click()}
            style={{
              height: "100px",
              width: "100px",
              opacity: talentAvatar ? 1 : 0.5,
            }}
            alt=""
          />
        </div>
      </div>

      <div className="border w-full my-5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">First name</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="firstName"
              maxLength={90}
              defaultValue={defaults?.firstName || ""}
            />
            {/* {formErrors.firstName?.type === 'required' && <HelperText valid={false}>First name is required</HelperText>} */}
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Middle name</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="middleName"
              defaultValue={defaults?.middleName || ""}
              maxLength={90}
            />
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Last name</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="lastName"
              defaultValue={defaults?.lastName || ""}
              maxLength={90}
            />
            {/* {formErrors.lastName?.type === 'required' && <HelperText valid={false}>Last Name is required</HelperText>} */}
          </Label>
        </div>
        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Department</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="department"
              defaultValue={defaults?.department || ""}
              maxLength={180}
            />
            {/* {formErrors.department?.type === 'required' && <HelperText valid={false}>Department is required</HelperText>} */}
          </Label>
        </div>

        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Position</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="title"
              defaultValue={defaults?.title || ""}
              maxLength={90}
            />
            {/* {formErrors.title?.type === 'required' && <HelperText valid={false}>Position is required</HelperText>} */}
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">
              Notice Period in Months
            </span>
            <Input
              ref={register}
              type="number"
              min={0}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="noticePeriodMonths"
              defaultValue={defaults?.noticePeriodMonths || 0}
            />
            {/* {formErrors.noticePeriodMonths?.type === 'required' && <HelperText valid={false}>Notice period in months is required</HelperText>}
          {formErrors.noticePeriodMonths?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>} */}
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Employment status</span>
            <Select
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              style={{ paddingBottom: "2px", paddingTop: "2px" }}
              name="employmentStatus"
              ref={register}
              defaultValue={defaults?.employmentStatus || ""}
            >
              {TalentEmploymentStatus.map((item, index) => {
                return <option key={index} value={item.value}>{item.text}</option>;
              })}
            </Select>
          </Label>
        </div>
      </div>

      <div className="border w-full my-5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Phone</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="phone"
              defaultValue={defaults?.phone || ""}
              onBlur={clearBackendErrors}
              maxLength={20}
            />
            {/* {formErrors.phone?.type === 'required' && <HelperText valid={false}>Phone is required</HelperText>} */}
          </Label>
        </div>
        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">LinkedIn</span>
            <Input
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="linkedIn"
              ref={register}
              defaultValue={defaults?.linkedIn || ""}
              maxLength={90}
            />
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Email</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="email"
              defaultValue={defaults?.email || ""}
              onBlur={clearBackendErrors}
              maxLength={120}
            />
            {/* {formErrors.email?.type === 'required' && <HelperText valid={false}>Email is required</HelperText>}
            {formErrors.email?.type === 'pattern' && <HelperText valid={false}>Please enter a valid email</HelperText>} */}
          </Label>
        </div>

        <div className="col-span-1">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Twitter</span>
            <Input
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="twitter"
              ref={register}
              defaultValue={defaults?.twitter || ""}
              maxLength={120}
            />
          </Label>
        </div>
        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Location</span>
            <Input
              ref={register}
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              name="location"
              defaultValue={defaults?.location || ""}
              maxLength={1000}
            />
            {/* {formErrors.location?.type === 'required' && <HelperText valid={false}>Location is required</HelperText>} */}
          </Label>
        </div>
      </div>

      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">
        Educational background
      </span>
      <div className="grid grid-cols-3 gap-1">
        {educations.map((education, index) => {
          let formName = `education[${index}]`;
          return (
            <div className="col-span-3" key={index}>
              <Label className="mb-4">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">
                    Education #{index + 1}
                  </span>

                  {index > 0 && (
                    <TrashIcon
                      className="text-red-500 h-5 w-5 ml-5 mb-3 cursor-pointer"
                      onClick={() => {
                        let educationsCopy = [...educations];
                        educationsCopy.splice(index, 1);
                        setEducations(educationsCopy);
                      }}
                    />
                  )}
                </div>
                <Textarea
                  className="mt-1rounded border px-4 active-border-blue"
                  // ref={register({ validate: () => educationValidation() })}
                  ref={register}
                  name={formName}
                  defaultValue={
                    (defaults?.education && defaults?.education[index]) || ""
                  }
                  rows="6"
                  maxLength={10000}
                />
              </Label>
            </div>
          );
        })}
        {/* {educationError && <HelperText valid={false}>Provide at least one entry in education</HelperText>} */}
        <div className="col-span-3 text-right mr-5">
          <span
            className="text-xs cursor-pointer "
            onClick={() => setEducations([...educations, ""])}
          >
            + Add
          </span>
        </div>
      </div>

      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">Experiences</span>
      <div className="grid grid-cols-3 gap-1">
        {experiences.map((item, index) => {
          let formName = `experience[${index}]`;
          return (
            <div className="col-span-3" key={index}>
              <Label className="mb-4">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-400">
                    Experience #{index + 1}
                  </span>
                  {index > 0 && (
                    <TrashIcon
                      className="text-red-500 h-5 w-5 ml-5 mb-3 cursor-pointer"
                      onClick={() => {
                        let experiencesCopy = [...experiences];
                        experiencesCopy.splice(index, 1);
                        setExperiences(experiencesCopy);
                      }}
                    />
                  )}
                </div>

                <Textarea
                  className="mt-1rounded border px-4 active-border-blue"
                  ref={register}
                  name={formName}
                  defaultValue={
                    (defaults?.experience && defaults?.experience[index]) || ""
                  }
                  rows="6"
                  maxLength={10000}
                />
              </Label>
            </div>
          );
        })}

        <div className="col-span-3 text-right mr-5">
          <span
            className="text-xs cursor-pointer "
            onClick={() => setExperiences([...experiences, ""])}
          >
            + Add
          </span>
        </div>
      </div>

      <div className="border w-full my-5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Skills</span>
            <Textarea
              ref={register}
              className="mt-1rounded border px-4 active-border-blue"
              name="skills"
              defaultValue={defaults?.skills || ""}
              rows="6"
              maxLength={10000}
            />
            {/* {formErrors.skills?.type === 'required' && <HelperText valid={false}>Skills is required</HelperText>} */}
          </Label>
        </div>
        <div className="border w-full my-5 col-span-3" />
        <div className="col-span-3">
          <Label className="mb-4">
            <span className="text-xs text-gray-400">Documents</span>
            <h3 className="text-xs px-4 border text-gray-600 h-8 rounded pt-2">
              Resume File 
            </h3>
            <input
              className="mt-1 h-8 rounded border px-4 active-border-blue"
              placeholder="Attach relative documents of job #1234"
              type="file"
              hidden
              onChange={fileInputChangeHandler}
              multiple
            />
          </Label>
          <ul style={{ listStyleType: "circle" }}>
          {uploadedRequirements.map((uploadedFile, index) => {
              let isFile = uploadedFile instanceof File;
              let filename = uploadedFile.fileName;
              let id = isFile ? index : uploadedFile.documentId;
              const fileSize = uploadedFile.size * 0.000001;
              const date = moment(uploadedFile.uploadTime);
              let fileRef = isFile
                ? URL.createObjectURL(uploadedFile)
                : uploadedFile.downloadUri;

              if (!isFile) {
                if (VALID_DISPLAY_TALENT_DOCUMENT_TYPES.includes(uploadedFile.documentType)) {
                  return (
                  <Table>
                    <TableRow className="bg-gray-100" style={{borderBottomWidth:1,borderBottomColor:'lightgray'}}>
                    <TableCell align="left">
                      <div className="ml-1 text-xs " style={{width:220}} >
                        { filename.slice(0,19) } &nbsp;<span className={'text-gray-400'}>{fileSize.toFixed(3)} MB</span>
                      </div>
                    </TableCell>
                    <TableCell align={'right'}>
                      <div className="text-xs text-gray-400 " style={{paddingLeft:-50}} >
                        {date.format("MM/DD/YYYY h:mm")}
                      </div>
                      
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400">{'Ver'} {uploadedFile.documentType}</span>
                    </TableCell>
                 
                    <TableCell align="right">
                      <a
                        href={fileRef}
                        target="_blank"
                        className="hover:underline hover:text-blue-400"
                        rel="noreferrer"
                      >
                        <DownloadIcon/>
                      </a>
                    </TableCell>
                    <TableCell align="right">
                    <div 
                      style={{ cursor: 'pointer' }}
                      onClick={
                        isFile
                          ? () => deleteFile(id)
                          : () => deleteUploadedFile(id)
                      }
                    >
                        <Delete />
                      </div >
                    </TableCell>
                  </TableRow>
                  </Table>
                  
                  );
                }

                return null;
              }

              return (
                <Table>
                    <TableRow className="bg-gray-100" style={{borderBottomWidth:1,borderBottomColor:'lightgray',justifyContent:'center'}}>
              
                    <TableCell align="left">
                      <div className="ml-1 text-xs col-2" style={{width:220}}>
                        {(uploadedFile.name.slice(0,20)) || (uploadedFile.fileName.slice(0,20))}&emsp;<span className={'text-gray-400'}>{fileSize.toFixed(3)} MB</span>
                      </div>
                    </TableCell>
                    <TableCell >
                      <span className="text-xs text-gray-400 col-1" style={{paddingLeft:-50}} >
                        {date.format("MM/DD/YYYY h:mm")}
                      </span>
                      
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-gray-400 col-1">{'Ver'} {uploadedFile.documentType}</span>
                    </TableCell>
                 
                    <TableCell align="left" valign="middle">
                      <a
                        href={fileRef}
                        target="_blank"
                        className="hover:underline hover:text-blue-400"
                        rel="noreferrer"
                      >
                        <DownloadIcon/>
                      </a>
                    </TableCell>
                    <TableCell align="left" valign="middle">
                    <div 
                      style={{ cursor: 'pointer' }}
                      onClick={
                        isFile
                          ? () => deleteFile(id)
                          : () => deleteUploadedFile(id)
                        } 
                      >
                        <Delete />
                      </div >
                    </TableCell>
                  </TableRow>
                  </Table>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

TalentForm.propTypes = {
  register: PropTypes.func.isRequired,
  uploadedRequirements: PropTypes.array.isRequired,
  setUploadedRequirements: PropTypes.func.isRequired,
  talentAvatar: PropTypes.object.isRequired,
  setTalentAvatar: PropTypes.func.isRequired,
};

export default TalentForm;
