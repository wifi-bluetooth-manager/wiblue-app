import NavbarModel from "../../components/NavbarModel/NavbarModel";
import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import useUserContext from "../../contexts/userContextProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const { UserDispatch } = useUserContext();
  const navi = useNavigate();
  return (
    <>
      <NavbarModel />
      <div>Account</div>
      <LoginRegisterButton
        type="button"
        onClick={() => {
          UserDispatch({ type: "setUsername", value: null });
          UserDispatch({ type: "setTheme", value: "light" });
          UserDispatch({ type: "setProfilePicture", value: null });
          UserDispatch({ type: "setEmail", value: null });
          UserDispatch({ type: "setId", value: null });
          toast.success("Logged out");
          navi("/");
        }}
        value="Logout"
      />
    </>
  );
};

export default Account;
