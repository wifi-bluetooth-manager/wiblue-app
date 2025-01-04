import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { WifiNetwork } from "./types/network";

function App() {
  const [networks, setNetworks] = useState<WifiNetwork[] | null>(null);
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    // setGreetMsg(await invoke("greet", { name }));
  }

  const getNetworks = async () => {
    let raw_fetched_networks = await invoke<string>("get_networks");
    console.log(raw_fetched_networks);
    let fetched_networks: WifiNetwork[] = JSON.parse(raw_fetched_networks);
    setNetworks(fetched_networks);
    console.log(fetched_networks ?? "no network");
  };

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
