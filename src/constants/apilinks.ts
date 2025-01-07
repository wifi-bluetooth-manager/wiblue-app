const host = "http://localhost:8080";

const ApiLinks = {
  register: host + "/auth/register",
  loginEmail: host + "/auth/login/email",
  loginUsername: host + "/auth/login/username",
  validateAccount: host + "/`auth/validate",
} as const;

export default ApiLinks;
