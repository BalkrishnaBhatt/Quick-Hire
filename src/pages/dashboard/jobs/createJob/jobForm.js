import { useRef, useState } from "react";
import { Label, Input, Textarea, HelperText, TableRow ,TableCell, Table } from "@windmill/react-ui";
import Select from "react-select/creatable";
import { Controller } from "react-hook-form";
import { TrashIcon, Delete, DownloadIcon } from "icons";
import PropTypes from "prop-types";
import moment from "moment";
import { JobStatuses, JobRankings, VALID_DISPLAY_JOB_DOCUMENT_TYPES } from "helpers/constants";
import { LANGUAGES_LIST } from "helpers/languages";

const JobForm = (props) => {
  const {
    register,
    formControl,
    documents = [],
    setDocuments,
    defaults = {},
    deleteFileHandler,
    formErrors = {},
    clearErrors,
    getFormValues
  } = props;

  const languageOptions = Object.keys(LANGUAGES_LIST).map((key) => (
    { value: LANGUAGES_LIST[key].name, label: LANGUAGES_LIST[key].name })
  );

  //const [jobAvatar, setJobAvatar] = useState("");
  const [ranking, setRanking] = useState(defaults.ranking);
  const [language1, setLanguage1] = useState(defaults.languageRequirement1);
  const [language2, setLanguage2] = useState(defaults.languageRequirement2);
  const [language3, setLanguage3] = useState(defaults.languageRequirement3);

  //const uploadPhotoRef = useRef(null);
  const uploadFilesRef = useRef(null);

  const fileInputChangeHandler = (e) => {
    const files = e.target.files;

    const uploadedFiles = Object.keys(files).map((key) => {
      return files[key];
    });

    setDocuments([...documents, ...uploadedFiles]);
  };

  const deleteFile = (index) => {
    let uploadedDocuments = [...documents]; //create copy of the documents;
    uploadedDocuments.splice(index, 1);
    setDocuments(uploadedDocuments);
  };

  const deleteUploadedFile = (id) => {
    let uploadedDocuments = [...documents].filter((x) => x.documentId !== id); //create copy of the documents;
    setDocuments(uploadedDocuments);
    deleteFileHandler && deleteFileHandler(id);
  };

  const languagesValidation = () => {
    clearErrors('languageRequirement1');
    clearErrors('languageRequirement2');
    clearErrors('languageRequirement3');
    return !(getFormValues('languageRequirement1') === "" &&
      getFormValues('languageRequirement2') === "" &&
      getFormValues('languageRequirement3') === "")
  }

  const minLessThanMaxYearsValidation = () => {
    clearErrors('minYearsOfExp');
    clearErrors('maxYearsOfExp');
    return Number(getFormValues("minYearsOfExp")) <= Number(getFormValues("maxYearsOfExp"));
  }

  const minLessThanMaxBudgetValidation = () => {
    clearErrors('minBudget');
    clearErrors('maxBudget');
    return Number(getFormValues("minBudget")) <= Number(getFormValues("maxBudget"));
  }
  /*
  const AvatarUploadHandler = (e) => {
    setJobAvatar(URL.createObjectURL(e.target.files[0]));
  };
  */

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

  return (
    <div className="py-5 px-5 bg-white rounded">
      <div className="grid grid-cols-5">
        <div className="col-span-3">
          {defaults?.id && (
            <Label className="mb-4">
              <span className="text-xs text-gray-400">Job number</span>
              <Input
                className="mt-1 h-8 rounded border px-4 active-border-blue"
                autoFocus
                value={defaults.id}
                name="id"
                ref={register}
                readOnly
              />
            </Label>
          )}
          <div className="flex">
            <span className="text-gray-400 text-xs">Job status</span>
            <div className="ml-2">
              {JobStatuses.map((jobStatus) => {
                return (
                  <Label radio key={jobStatus.value}>
                    <Input
                      type="radio"
                      className="border"
                      name="jobStatus"
                      ref={register({ required: true })}
                      value={jobStatus.value}
                      defaultChecked={jobStatus.value === defaults.jobStatus}
                    />
                    <span className="ml-1 mr-2 text-gray-400 text-xs">
                      {jobStatus.text}
                    </span>
                  </Label>
                );
              })}
            </div>
          </div>
          {formErrors.jobStatus?.type === 'required' && <HelperText valid={false}>Job Status is required</HelperText>}
        </div>
      </div>
      <div className="border w-full my-5" />
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Job Title</span>
          <Input
            ref={register}
            name="jobTitle"
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            defaultValue={defaults.jobTitle || ""}
            maxLength={120}
          />
          {formErrors.jobTitle?.type === 'required' && <HelperText valid={false}>Title is required</HelperText>}
        </div>
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Role name</span>
          <Input
            ref={register}
            name="roleName"
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            defaultValue={defaults.roleName || ""}
            maxLength={120}
          />
          {formErrors.roleName?.type === 'required' && <HelperText valid={false}>Role is required</HelperText>}
        </div>
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Department</span>
          <Input
            ref={register}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="department"
            defaultValue={defaults.department || ""}
            maxLength={180}
          />
          {formErrors.department?.type === 'required' && <HelperText valid={false}>Department is required</HelperText>}
        </div>

        <div className="col-span-3">
          <span className="text-xs text-gray-400">Description</span>
          <Textarea
            className="mt-1rounded border px-4 active-border-blue"
            ref={register}
            name="descriptions"
            defaultValue={defaults.descriptions || ""}
            rows="6"
            maxLength={10000}
          />
          {formErrors.descriptions?.type === 'required' && <HelperText valid={false}>Description is required</HelperText>}
          {formErrors.descriptions?.type === 'maxLength' && <HelperText valid={false}>Maximum of 10000 characters</HelperText>}
        </div>

      </div>

      {/* REQUIREMENTS */}
      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">Requirements</span>
      <div className="grid grid-cols-3 gap-1">
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Required skills</span>
          <Textarea
            className="mt-1rounded border px-4 active-border-blue"
            ref={register}
            name="skillsRequirements"
            defaultValue={defaults.skillsRequirements || ""}
            rows="6"
            maxLength={10000}
          />

          {formErrors.skillsRequirements?.type === 'required' && <HelperText valid={false}>Skills is required</HelperText>}
        </div>
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Ranking</span>
          <Controller
            control={formControl}
            defaultValue={defaults.ranking || ""}
            name="ranking"
            rules={{ maxLength: 120 }}
            render={({ onChange, value, name, ref }) => (
              <Select
                inputRef={ref}
                options={JobRankings}
                value={JobRankings.find(c => c.value === value)}
                onChange={val => onChange(val.value)}
                formatCreateLabel={(inputValue) => `${inputValue}`}
                styles={customSelectStyles}
                defaultInputValue={defaults.ranking}
              // placeholder={defaults.ranking}
                onInputChange={val=>{
                  if( val.length <= 120 ){
                    setRanking(val)
                  }
                }}
                inputValue={ranking}
              />
            )}
          />
          {formErrors.ranking?.type === 'required' && (<HelperText valid={false}>Ranking is required</HelperText>)}
        </div>
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Location</span>
          <Input
            ref={register}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="location"
            defaultValue={defaults.location || ""}
            maxLength={1000}
          />
          {formErrors.ranking?.type === 'required' && (<HelperText valid={false}>Location is required</HelperText>)}
        </div>
        <div className="col-span-1">
          <span className="text-xs text-gray-400">Language 1</span>
          <Controller
            control={formControl}
            defaultValue={defaults.languageRequirement1 || ""}
            name="languageRequirement1"
            render={({ onChange, value, name, ref }) => (
              <Select
                inputRef={ref}
                options={languageOptions}
                value={languageOptions.find(c => c.value === value)}
                onChange={val => onChange(val.value)}
                formatCreateLabel={(inputValue) => `${inputValue}`}
                styles={customSelectStyles}
                placeholder=""
                defaultInputValue={defaults.languageRequirement1}
                onInputChange={val => {
                  if( val.length <= 120 ){
                    setLanguage1(val)
                  }
                }}
                inputValue={language1}
              />
            )}
          />
        </div>
        <div className="col-span-1">
          <span className="text-xs text-gray-400">Language 2</span>
          <Controller
            control={formControl}
            defaultValue={defaults.languageRequirement2 || ""}
            name="languageRequirement2"
            render={({ onChange, value, name, ref }) => (
              <Select
                inputRef={ref}
                options={languageOptions}
                value={languageOptions.find(c => c.value === value)}
                onChange={val => onChange(val.value)}
                formatCreateLabel={(inputValue) => `${inputValue}`}
                styles={customSelectStyles}
                placeholder=""
                defaultInputValue={defaults.languageRequirement2}
                onInputChange={val=>{
                  if( val.length <= 120 ){
                    setLanguage2(val)
                  }
                }}
                inputValue={language2}
              />
            )}
          />
        </div>

        <div className="col-span-1">
          <span className="text-xs text-gray-400">Language 3</span>
          <Controller
            control={formControl}
            defaultValue={defaults.languageRequirement3 || ""}
            name="languageRequirement3"
            render={({ onChange, value, name, ref }) => (
              <Select
                inputRef={ref}
                options={languageOptions}
                value={languageOptions.find(c => c.value === value)}
                onChange={val => onChange(val.value)}
                formatCreateLabel={(inputValue) => `${inputValue}`}
                styles={customSelectStyles}
                placeholder=""
                defaultInputValue={defaults.languageRequirement3}
                onInputChange={val=>{
                  if( val.length <= 120 ){
                    setLanguage3(val)
                  }
                }}
                inputValue={language3}
              />
            )}
          />
        </div>
        {(formErrors.languageRequirement1?.type === 'validate' ||
          formErrors.languageRequirement2?.type === 'validate' ||
          formErrors.languageRequirement3?.type === 'validate')
          && <HelperText valid={false}>Provide at least one language</HelperText>}
      </div>

      {/* EXPERIENCE*/}
      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">
        Year of experience
      </span>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">
          <span className="text-xs text-gray-400">
            Minimum year/s of experience:
          </span>
          <Input
            ref={register({
              // required: true,
              min: 0,
              validate: () => minLessThanMaxYearsValidation()
            })}
            type="number"
            min={0}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="minYearsOfExp"
            defaultValue={defaults.minYearsOfExp || 0}
          />
          {formErrors.minYearsOfExp?.type === 'required' && <HelperText valid={false}>Minimum years of experience is required</HelperText>}
          {formErrors.minYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
          {(formErrors.minYearsOfExp?.type === 'validate' || formErrors.maxYearsOfExp?.type === 'validate')
            && <HelperText valid={false}>Minimum must be less than or equal maximum</HelperText>}
        </div>
        <div className="col-span-1">
          <span className="text-xs text-gray-400">
            Maximum year/s of experience:
          </span>
          <Input
            ref={register({
              // required: true,
              min: 0,
              validate: () => minLessThanMaxYearsValidation()
            })}
            type="number"
            min={0}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="maxYearsOfExp"
            defaultValue={defaults.maxYearsOfExp || 0}
          />
          {formErrors.maxYearsOfExp?.type === 'required' && <HelperText valid={false}>Maximum years of experience is required</HelperText>}
          {formErrors.maxYearsOfExp?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
        </div>
      </div>

      {/* BUDGETS */}

      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">Budgets</span>
      <div className="grid grid-cols-2 gap-1">
        <div className="col-span-1">
          <span className="text-xs text-gray-400">Minimum budget:</span>
          <Input
            ref={register({
              // required: true,
              min: 0,
              validate: () => minLessThanMaxBudgetValidation()
            })}
            type="number"
            min={0}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="minBudget"
            defaultValue={defaults.minBudget || 0}
          />
          {formErrors.minBudget?.type === 'required' && <HelperText valid={false}>Minimum budget is required</HelperText>}
          {formErrors.minBudget?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
          {(formErrors.minBudget?.type === 'validate' || formErrors.maxBudget?.type === 'validate')
            && <HelperText valid={false}>Minimum must be less than or equal maximum</HelperText>}
        </div>
        <div className="col-span-1">
          <span className="text-xs text-gray-400">Maximum budget:</span>
          <Input
            ref={register({
              // required: true,
              min: 0,
              validate: () => minLessThanMaxBudgetValidation()
            })}
            type="number"
            min={0}
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            name="maxBudget"
            defaultValue={defaults.maxBudget || 0}
          />
          {formErrors.maxBudget?.type === 'required' && <HelperText valid={false}>Minimum budget is required</HelperText>}
          {formErrors.maxBudget?.type === 'min' && <HelperText valid={false}>Must be greater than zero</HelperText>}
        </div>
      </div>

      <div className="border w-full my-5" />
      <span className="text-sm font-semibold text-gray-500">Documents</span>
      <div className="grid grid-cols-3">
        <div className="col-span-3">
          <span className="text-xs text-gray-400">Attachments</span>
          <h3
            className="text-xs px-4 border text-gray-600 h-8 rounded pt-2 cursor-pointer"
            onClick={() => uploadFilesRef.current.click()}
          >
            JD File
          </h3>
          <input
            className="mt-1 h-8 rounded border px-4 active-border-blue"
            placeholder="Attach relative documents of job #1234"
            type="file"
            hidden
            onChange={fileInputChangeHandler}
            multiple
            ref={uploadFilesRef}
          />
          <ul className="mt-4">
          {documents.map((doc, index) => {
              let isFile = doc instanceof File;
              let filename = doc.fileName
              let id = !isFile ? doc.documentId : `id-${index}`;
              const fileSize = doc.size * 0.000001;
              const date = moment(doc.uploadTime);
              let fileHref = isFile
                ? URL.createObjectURL(doc)
                : doc.downloadUri;

              if (!isFile) {
                if (VALID_DISPLAY_JOB_DOCUMENT_TYPES.includes(doc.documentType)) {
                  return (
                    <Table>
                    <TableRow key={id} className={'bg-gray-100 col-12'} style={{borderBottomWidth:1,borderBottomColor:'lightgray'}} >
                    <TableCell align="left">
                      <div className="ml-1 text-xs " style={{width:220}}>
                        {filename.slice(0, 20)}&emsp;<span className={'text-gray-400'}>{fileSize.toFixed(3)} MB</span>
                      </div>
                    </TableCell>
                    <TableCell align='right'>
                      <span className="text-xs text-gray-400 "  >
                        {date.format("MM/DD/YYYY h:mm")}
                      </span>
                      
                    </TableCell>
                    <TableCell align='right'>
                      <span className="text-xs text-gray-400">{'Ver'} {doc.documentType}</span>
                    </TableCell>
                 
                    <TableCell align='right' valign="middle">
                      <a href={fileHref} target="_blank" style={{width:30}} >
                        <DownloadIcon />
                      </a>
                    </TableCell>
                    <TableCell align='right' valign="middle">
                    <div 
                      style={{ cursor: 'pointer' }}
                      onClick={() => deleteUploadedFile(id)}
                    >
                        <Delete/>
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
                    <TableRow className="bg-gray-100" style={{borderBottomWidth:1,borderBottomColor:'lightgray'}}>
                <TableCell align="left">
                  <div className="ml-1 text-xs " style={{width:220}}>
                    {(doc.name.slice(0,20)) || (doc.fileName.slice(0,20))}&emsp;<span className={'text-gray-400'}>{fileSize.toFixed(3)} MB</span>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <span className="text-xs text-gray-400 " >
                    {date.format("MM/DD/YYYY h:mm")}
                  </span>
                  
                </TableCell>
                <TableCell align="right">
                  <span className="text-xs text-gray-400">{'Ver'} {doc.documentType}</span>
                </TableCell>
             
                <TableCell align="right" valign="middle">
                  <a href={fileHref} target="_blank" style={{width:30}} >
                    <DownloadIcon />
                  </a>
                </TableCell>
                <TableCell align="right" valign="middle">
                <div
                  style={{ cursor: 'pointer' }} 
                  onClick={() => deleteFile(index)}
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

JobForm.propTypes = {
  register: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
  setDocuments: PropTypes.func.isRequired,
  defaults: PropTypes.object,
};

export default JobForm;
