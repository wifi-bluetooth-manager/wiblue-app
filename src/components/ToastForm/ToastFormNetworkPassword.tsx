import { SubmitHandler, useForm } from "react-hook-form";
import FormErrorParahraph from "../FormError/FormErrorParagraph";
import FormErrorWrap from "../FormError/FormErrorWrap";
import LoginRegisterButton from "../LoginRegisterButton/LoginRegisterButton";
import styles from "./styles.module.scss";
import toast, { Toast } from "react-hot-toast";

type ToastFormNetworkPasswordProps = {
  t: Toast;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
};

const ToastFormNetworkPassword = ({
  t,
  setPassword,
}: ToastFormNetworkPasswordProps) => {
  type formProps = {
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setError,
  } = useForm<formProps>();

  const onSubmit: SubmitHandler<formProps> = async (data) => {
    setPassword(data.password);
  };

  return (
    <div className={styles.toast_container}>
      <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
        <FormErrorWrap>
          <input
            {...register("password", {
              required: {
                value: true,
                message: "Password is required",
              },
            })}
            type="text"
            placeholder="Password"
            name="password"
            className={styles.input_field}
          />
          <FormErrorParahraph errorObject={errors.password} />
        </FormErrorWrap>
        <input type="submit" value="Connect" className={styles.connect} />
      </form>
      <input
        type="button"
        value="Cancel"
        className={styles.cancel}
        onClick={() => toast.dismiss(t.id)}
      />
    </div>
  );
};

export default ToastFormNetworkPassword;
