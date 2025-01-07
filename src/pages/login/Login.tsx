import NavbarModel from "../../components/NavbarModel/NavbarModel";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import OLF from "../../Olf/olf";
import FormErrorWrap from "../../components/FormError/FormErrorWrap";
import FormErrorParagraph from "../../components/FormError/FormErrorParagraph";
import AuthConst from "../../constants/auth";
import ApiLinks from "../../constants/apilinks";
import styles from "./styles.module.scss";
import LoginRegisterButton from "../../components/LoginRegisterButton/LoginRegisterButton";
import Regex from "../../constants/regex";

const Login = () => {
  type formProps = {
    credential: string | null;
    password: string | null;
  };

  const loginOptions = {
    email: "email",
    username: "username",
  } as const;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setError,
  } = useForm<formProps>();

  const [loginOption, setLoginOption] = useState<"email" | "username">("email");

  const onSubmit: SubmitHandler<formProps> = async (data) => {
    const loginLink =
      loginOption === loginOptions.email
        ? ApiLinks.loginEmail
        : ApiLinks.loginUsername;

    const response = await OLF.post(loginLink, {
      [loginOption === loginOptions.email
        ? loginOptions.email
        : loginOptions.username]: getValues().credential,
      password: getValues().password,
    });
    const navi = useNavigate();
    navi("/");
  };

  return (
    <>
      <NavbarModel />
      <section className={styles.container}>
        <article>
          <header>Login to WiBlue account</header>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormErrorWrap>
              <input
                {...register("credential", {
                  validate: (cred) => {
                    if (!cred) {
                      return "Credential is required";
                    }
                    if (cred.includes("@")) {
                      setLoginOption("email");
                      const regexResult = Regex.emailRegistration.test(cred);
                      if (!regexResult) {
                        return "Email must be correct";
                      }
                      return true;
                    } else {
                      setLoginOption("username");
                      const regexResult = Regex.usernameModification.test(cred);
                      if (!regexResult) {
                        return "Username must be correct";
                      }
                      return true;
                    }
                  },
                  required: {
                    value: true,
                    message: "Credential is required",
                  },
                })}
                type="text"
                placeholder="Email or Username"
                name="credential"
              />
              <FormErrorParagraph errorObject={errors.credential} />
            </FormErrorWrap>
            <FormErrorWrap>
              <input
                {...register("password", {
                  minLength: {
                    value: AuthConst.minPasswordLength,
                    message: `Password must have at least ${AuthConst.minPasswordLength} characters`,
                  },
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                })}
                type="password"
                placeholder="Password"
                name="password"
              />
              <FormErrorParagraph errorObject={errors.password} />
            </FormErrorWrap>
            <LoginRegisterButton type="submit" value="Login" />
          </form>
          <figure>
            <p>Don't have an account?</p>
            <Link to="/register">Register here</Link>
          </figure>
        </article>
      </section>
    </>
  );
};

export default Login;
