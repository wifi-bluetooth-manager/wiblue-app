const host = "http://localhost:8000";

const ApiLinks = {
  register: host + "/signup",
  loginEmail: host + "/login_email/",
  loginUsername: host + "/login_username/",
} as const;

export default ApiLinks;
