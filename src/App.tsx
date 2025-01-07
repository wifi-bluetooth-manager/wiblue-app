import { Toaster } from "react-hot-toast";
import Networks from "./pages/networks/Networks.tsx";
import NavbarModel from "./components/NavbarModel/NavbarModel";
import { useEffect } from "react";
import useUserContext from "./contexts/userContextProvider.tsx";

function App() {
  const { User, UserDispatch } = useUserContext();
  useEffect(() => {
    UserDispatch({ type: "setUsername", value: "tomek" });
    UserDispatch({ type: "setId", value: "123j-25as-09vf-123b" });
  }, []);
  return (
    <div>
      <NavbarModel />
      <Networks />
      <Toaster position={"top-center"} />
    </div>
  );
}

export default App;
