import NavbarModel from "../../components/NavbarModel/NavbarModel";
import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import useUserContext from "../../contexts/userContextProvider";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import SeenNetworkTable from "../../components/SeenNetworkTable/SeenNetworkTable";

const Account = () => {
  const { UserDispatch, User } = useUserContext();
  const navi = useNavigate();

  console.log(User.seenNetworks);

  return (
    <>
      <NavbarModel />
      <section className={styles.container}>
        <LoginRegisterButton
          type="button"
          onClick={() => {
            UserDispatch({ type: "setUsername", value: null });
            UserDispatch({ type: "setTheme", value: "light" });
            UserDispatch({ type: "setProfilePicture", value: null });
            UserDispatch({ type: "setEmail", value: null });
            UserDispatch({ type: "setId", value: null });
            localStorage.clear();
            toast.success("Logged out");
            navi("/");
          }}
          value="Logout"
        />

        <p>All networks seen by our users (who cares about security right?)</p>

        {User.seenNetworks ? (
          <SeenNetworkTable networks={User.seenNetworks} />
        ) : (
          <p>Our users havent seen any networks yet</p>
        )}
      </section>
    </>
  );
};

export default Account;
