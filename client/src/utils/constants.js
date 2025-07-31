export const HOST = import.meta.env.VITE_SERVER_URL;

//auth
export const AUTH_ROUTES = "/api/auth";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/get-user-info`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;

//candidate
export const CANDIDATE_ROUTES = "/api/candidate";
export const UPDATE_PROFILE = `${CANDIDATE_ROUTES}/update-profile`;
export const UPLOAD_PROFILE_PIC = `${CANDIDATE_ROUTES}/upload-profile-pic`;
export const DELETE_PROFILE_PIC = `${CANDIDATE_ROUTES}/delete-profile-pic`;
export const GET_JOB = `${CANDIDATE_ROUTES}/get-application-job`;
export const UPLOAD_RESUME = `${CANDIDATE_ROUTES}/upload-resume`;
export const GET_APPLIED_JOBS = `${CANDIDATE_ROUTES}/get-applied-jobs`;
export const GET_JOB_BOARD = `${CANDIDATE_ROUTES}/get-job-board`;
export const CHECK_CHAT_ENABLED = `${CANDIDATE_ROUTES}/check-chat-enabled`;


//admin
export const ADMIN_ROUTES = "/api/admin";
export const JOB_POSTING = `${ADMIN_ROUTES}/job-posting`;
export const DISPLAY_ALL_JOBS = `${ADMIN_ROUTES}/get-all-jobs`;
export const GET_JOBS_APPLICATIONS = `${ADMIN_ROUTES}/get-job-applications`;
export const RIGHT_SWIPE_ROUTE = `${ADMIN_ROUTES}/application-right-swipe`;
export const LEFT_SWIPE_ROUTE = `${ADMIN_ROUTES}/application-left-swipe`;
export const UP_SWIPE_ROUTE = `${ADMIN_ROUTES}/application-up-swipe`;
export const DOWN_SWIPE_ROUTE = `${ADMIN_ROUTES}/application-down-swipe`;
export const UNDO_SWIPE_ROUTE = `${ADMIN_ROUTES}/undo-swipe`;
export const GET_SAVED_CANDIDATES = `${ADMIN_ROUTES}/get-saved-applicants`;
export const GET_SHORTLISTED_CANDIDATES = `${ADMIN_ROUTES}/get-shortlisted-candidates`;

//chat
export const CHAT_ROUTES = "/api/chat";
export const SEARCH_CONTACTS= `${CHAT_ROUTES}/search-contacts`;
export const GET_MESSAGES= `${CHAT_ROUTES}/get-messages`;
export const GET_ALL_CONTACTS = `${CHAT_ROUTES}/get-all-contacts-for-dm-list`;
export const MARK_MESSAGES_SEEN = `${CHAT_ROUTES}/mark-messages-seen`;
export const UPLOAD_MESSAGE_FILE = `${CHAT_ROUTES}/upload-file-message`;

//channel 
export const CHANNEL_ROUTES = "/api/channel";
export const GET_ALL_CANDIDATES_FOR_CHANNEL = `${CHANNEL_ROUTES}/get-all-contacts-for-channel`;
export const CREATE_CHANNEL = `${CHANNEL_ROUTES}/create-channel`;
export const GET_ALL_CHANNELS = `${CHANNEL_ROUTES}/get-all-channels`;
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/get-channel-messages`;
export const REMOVE_CANDIDATE = `${CHANNEL_ROUTES}/remove-candidate-or-channel`;






