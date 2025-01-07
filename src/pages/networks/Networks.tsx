import { useLayoutEffect, useState } from "react";
import { NetworkMode, WifiNetwork } from "../../types/network";
import { invoke } from "@tauri-apps/api/core";
import NetworkTable from "../../components/NetworkTable/NetworksTable";
import toast from "react-hot-toast";

export default function Networks() {
  const [nt, setNetworks] = useState<WifiNetwork[] | null>(null);

  const getNetworks = async () => {
    // toast.success("scanning");
    let raw_fetched_networks = await invoke<string>("scan");
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

  useLayoutEffect(() => {
    getNetworks();
    timer();
  }, []);

  const timer = async () => {
    setInterval(() => {
      getNetworks();
      console.log("Scanning...");
    }, 5000);
  };

  return (
    <>
      <main className="container">
        <button
          onClick={() => {
            getNetworks();
          }}
        >
          Refresh
        </button>
        {nt ? <NetworkTable networks={nt} /> : <div>No networks</div>}
      </main>
    </>
  );
}
