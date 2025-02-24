import { MAX_LENGTH_MESSAGE_GUESTBOOK, MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER } from "./config";

export const ERRORS = {
  MAX_LENGTH_MESSAGE_GUESTBOOK: `Message exceeds maximum length limit. Please keep your message under ${MAX_LENGTH_MESSAGE_GUESTBOOK} characters.`,
  UNAUTHORIZED: "Authentication failed. Please sign in to perform this action.",
  USER_NOT_FOUND: "User account could not be found in the system.",
  USER_BLOCKED: "Your account has been blocked. Please contact support for assistance.",
  MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER: `You have reached the maximum limit of ${MAX_NUMBER_MESSAGE_GUESTBOOK_PER_USER} messages per user. To continue posting, please create a new account or delete an existing message.`,
  MESSAGE_NOT_FOUND: "The requested message could not be found in the database.",
  FAILED_TO_ADD_MESSAGE: "An error occurred while adding your message. Please try again.",
  FAILED_TO_DELETE_MESSAGE: "Unable to delete the message. Please try again or contact support.",
  FAILED_TO_UPDATE_MESSAGE: "Message update failed. Please verify your changes and try again.",
  FAILED_TO_FETCH_MESSAGES: "Unable to load messages at this time. Please refresh the page or try again later.",
  FAILED_TO_BLOCK_USER: "Failed to block the user. Please try again.",
  FAILED_TO_UNBLOCK_USER: "Failed to unblock the user. Please try again."
};
