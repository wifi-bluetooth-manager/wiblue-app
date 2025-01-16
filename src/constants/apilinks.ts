const host = "http://localhost:8000";

const ApiLinks = {
  register: host + "/signup",
  loginEmail: host + "/login_email/",
  loginUsername: host + "/login_username/",
  seen_networks: host + "/add_seen_networks",
} as const;

export default ApiLinks;
