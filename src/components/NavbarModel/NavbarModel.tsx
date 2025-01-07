import React from "react";
import { Navbar, NavbarElement, NavbarMain } from "../Navbar/";
import NavbarWallet from "../Navbar/NavbarWallet";

const NavbarModel = () => {
  return (
    <Navbar>
      <NavbarMain>
        <NavbarElement link={"/"}>Home</NavbarElement>
        <NavbarElement link={"/login"}>Login</NavbarElement>
        <NavbarElement link={"/register"}>Register</NavbarElement>
        <NavbarWallet />
      </NavbarMain>
    </Navbar>
  );
};

export default NavbarModel;
