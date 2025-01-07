import { invoke } from "@tauri-apps/api/core";
import { WifiNetwork } from "../../types/network";
import { JsonResponse } from "../../types/jsonresponse";
import { useState } from "react";
import toast from "react-hot-toast";

export type NetworkEntryProps = {
  network: WifiNetwork;
};

const NetworkDataContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-4 w-[8vw] overflow-hidden text-ellipsis whitespace-nowrap">
      {children}
    </div>
  );
};

export default function NetworkEntry({ network }: NetworkEntryProps) {
  const [_password, setPassword] = useState<string>("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  const connect = (_bssid: string) => {
    const result = invoke("network_connect", {
      bssid: _bssid,
      password: _password,
    });
    result
      .then((r) => {
        const response: JsonResponse = JSON.parse(r as string);
        console.log(response.message);
        toast.success("Connected successfully!");
      })
      .catch((er) => {
        const errorResponse: JsonResponse = JSON.parse(er as string);
        const status = errorResponse.status;
        console.log(errorResponse.message);
        console.log(status);

        if (status === 502) {
          toast.error("Password is needed");
        } else if (status === 401) {
          toast.error("Wrong password");
        } else if (status === 500) {
          toast.error("Unknown Error");
        } else if (status === 404) {
          toast.error("No such network");
        }
        setErrorStatus(status);
      });
  };

  return (
    <>
      <div className="flex flex-row justify-start items-center bg-black">
        <div className="flex flex-row">
          <NetworkDataContainer>{network.ssid}</NetworkDataContainer>
          <NetworkDataContainer>
            {network.currentlyUsed ? "Yes" : "No"}
          </NetworkDataContainer>
          <NetworkDataContainer>{network.signalStrength}</NetworkDataContainer>
          <NetworkDataContainer>{network.security}</NetworkDataContainer>
          <NetworkDataContainer>
            {network.networkMode || "Unknown"}
          </NetworkDataContainer>
          <NetworkDataContainer>{network.frequency}</NetworkDataContainer>
          <NetworkDataContainer>
            {network.isHidden ? "Yes" : "No"}
          </NetworkDataContainer>
          <NetworkDataContainer>{network.bssid}</NetworkDataContainer>
          <NetworkDataContainer>{network.speed}</NetworkDataContainer>
        </div>
        <div
          className="mx-4 w-[8vw] text-center bg-green-500 rounded-lg hover:bg-blue-500 hover:scale-110 transition duration-200 transform cursor-pointer select-none"
          onClick={() => connect(network.bssid)}
        >
          Connect
        </div>
      </div>
    </>
  );
}
