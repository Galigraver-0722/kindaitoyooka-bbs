const MESSAGES: Record<string, string> = {
  "invalid-input": "Please check the form and try again.",
  "username-taken": "That username is already taken.",
  "email-taken": "That email address is already registered.",
  "invalid-credentials": "Wrong username or password.",
  "login-required": "Please log in to continue.",
  "forbidden": "You do not have permission to do that.",
  "board-not-found": "That board does not exist.",
  "thread-not-found": "That thread does not exist.",
  "thread-locked": "This thread is locked and accepts no new replies.",
  "thread-deleted": "This thread has been removed.",
  "report-invalid": "Please describe the problem in 3 to 500 characters.",
  "not-found": "We could not find what you were looking for.",
};

export function errorMessage(code: string | undefined): string | null {
  if (!code) {
    return null;
  }
  return MESSAGES[code] ?? MESSAGES["invalid-input"];
}

const NOTICES: Record<string, string> = {
  reported: "Thanks. A moderator will review your report.",
  "signed-out": "You have been signed out.",
};

export function noticeMessage(code: string | undefined): string | null {
  if (!code) {
    return null;
  }
  return NOTICES[code] ?? null;
}
