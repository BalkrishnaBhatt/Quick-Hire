export const MatchStatuses = {
  initial: "initial",
  scoring: "scoring",
  engaged: "engaged",
  matching: "matching",
  done: 'done'
};

export const TalentAvailability = [
  { value: "ACTIVELY_LOOKING", text: "Actively Looking", badgeType: "success" },
  {
    value: "PASSIVELY_LOOKING",
    text: "Passively Looking",
    badgeType: "warning",
  },
  { value: "NOT_LOOKING", text: "Not Looking", badgeType: "danger" },
];

export const TalentEmploymentStatus = [
  { value: "PERMANENT", text: "Permanent" },
  { value: "CONTRACTING", text: "Contracting" },
  { value: "FREELANCING", text: "Freelancing" },
  { value: "UNEMPLOYED", text: "Unemployed" },
  { value: "SELF_EMPLOYED", text: "Self-employed" },
];

export const JobStatuses = [
  {
    value: "ACTIVE",
    text: "Active",
  },
  {
    value: "EXPIRED",
    text: "Expired",
  },
];

export const JobRankings = [
  { value: 'Entry Level', label: 'Entry Level' },
  { value: 'Mid Level', label: 'Mid Level' },
  { value: 'Senior Level', label: 'Senior Level' },
  { value: 'Managerial Level', label: 'Managerial Level' },
]

export const VALID_JOB_DOCUMENT_TYPES = [0, 5];
export const VALID_TALENT_DOCUMENT_TYPES = [0, 6, 7];
export const VALID_DISPLAY_JOB_DOCUMENT_TYPES = [0];
export const VALID_DISPLAY_TALENT_DOCUMENT_TYPES = [7];

export const DUPLICATE_PHONE = 'DUPLICATE_PHONE';
export const DUPLICATE_EMAIL = 'DUPLICATE_EMAIL';
export const MISMATCH_PROFILE_LATEST_RESUME_PHONE_EMAIL = 'Email and phone are different in profile and latest resume.';
export const MISMATCH_PROFILE_EMAIL_AND_LATEST_RESUME = 'Email in profile and latest resume is different.';
export const MISMATCH_PROFILE_PHONE_AND_LATEST_RESUME='Phone in profile and latest resume is different.';

export const errDuplicate_Phone= 'Phone used in profile already used by other user.';
export const errDuplicate_Email = 'Email used in profile already used by other user.';
export const errMismatch_Latest_Resume_Phone_Email = 'Email and phone are diffrent in profile and latrst resume.';
export const errMismatch_Email_Resume = 'Email in profile and latest resume is diffrent.';
export const errMismatch_Profile_phome_Latest_Resume = 'Phone in profile and latest resume is different.';
export const OTHERERR='Info user to check internet connection and try again.';

export const DUPLICATE_PHONE_IN_UPLOADED_RESUME = 'After deletion, the latest resume now has a phone that is already used by other user.'
export const DUPLICATE_EMAIL_IN_UPLOADED_RESUME = 'After deletion, the latest resume now has an email that is already used by other user.'
export const DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME = 'After deletion, the latest resume now has an email and phone that are already used by other user.'

export const DUPLICATE_PHONE_IN_UPLOADED_RESUME_TALENT = 'Uploaded resume phone already used by other user.'
export const DUPLICATE_EMAIL_IN_UPLOADED_RESUME_TALENT = 'Uploaded resume email already used by other user.'
export const DUPLICATE_EMAIL_AND_PHONE_IN_UPLOADED_RESUME_TALENT = 'Uploaded resume email and phone already used by other user.'