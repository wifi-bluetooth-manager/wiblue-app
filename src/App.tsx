import { Toaster } from "react-hot-toast";
import Networks from "./pages/Networks/Networks";

function App() {
  return (
    <div>
      <Networks />
      <Toaster position={"top-center"} />
    </div>
  );
}

export default App;
