import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { WifiNetwork, NetworkMode } from "./types/network";
import NetworkTable from "./components/NetworkTable/NetworksTable";

function App() {
  const [nt, setNetworks] = useState<WifiNetwork[] | null>(null);

  const getNetworks = async () => {
    let raw_fetched_networks = await invoke<string>("get_networks");
    console.log(raw_fetched_networks);
    const fetched_networks: WifiNetwork[] = JSON.parse(
      raw_fetched_networks,
    ).map((network: any) => ({
      ...network,
      signalStrength: network.signal_strength, // Convert number to string if needed
      networkMode: network.network_mode.toUpperCase() as NetworkMode, // Map to enum if applicable
    }));
    setNetworks(fetched_networks);
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
      {nt ? <NetworkTable networks={nt} /> : <div>No networks</div>}
    </main>
  );
}

export default App;
