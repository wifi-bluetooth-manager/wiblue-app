import { Link } from "react-router-dom";
import React, { ReactNode } from "react";
import styles from "./styles.module.scss";

type NavbarUserInfoProps = {
  //  children: ReactNode;
  username: string;
  userPropfilePicture?: string;
};

const NavbarUserInfo = ({
  username,
  userPropfilePicture = undefined,
}: NavbarUserInfoProps) => {
  return (
    <div className={styles.navbar__user__info}>
      <div className={styles.navbar__user__info}>
        <p>{username}</p>
        <img
          src={userPropfilePicture ?? "/default-user.png"}
          width={32}
          height={32}
          alt="pfp"
          className={styles.navbar__user__info_img}
        />
        <Link to={"/account"}>
          <div className={styles.navbar__user__info_cogwheel}>
            <img src={"/cogwheel.png"} alt="account" width={32} height={32} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavbarUserInfo;
