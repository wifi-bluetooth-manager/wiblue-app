const host = "http://localhost:8000";

const ApiLinks = {
  register: host + "/signup",
  loginEmail: host + "/login_email/",
  loginUsername: host + "/login_username/",
  seen_networks: host + "/add_seen_networks",
  check_token: host + "/test_token",
  user_by_token: host + "/user_by_token",
} as const;

export default ApiLinks;
