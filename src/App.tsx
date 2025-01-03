import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [networks, setNetworks] = useState("");
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    // setGreetMsg(await invoke("greet", { name }));
  }

  const getNetworks = async () => {
    setNetworks(await invoke("get_networks"));
  };

  console.log(networks);

  return (
    <main className="container">
      <button
        onClick={() => {
          getNetworks();
        }}
      >
        Get Networks{" "}
      </button>
    </main>
  );
}

export default App;
