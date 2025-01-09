import { invoke } from "@tauri-apps/api/core";
import { WifiNetwork } from "../../types/network";
import styles from "./styles.module.scss";
import { JsonResponse } from "../../types/jsonresponse";
import { useState } from "react";
import toast from "react-hot-toast";
import ToastFormNetworkPassword from "../ToastForm/ToastFormNetworkPassword";

export type NetworkEntryProps = {
  network: WifiNetwork;
};

export default function NetworkEntry({ network }: NetworkEntryProps) {
  //console.log(Name: ${network.ssid} \n Mode: ${network.networkMode});
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
          // toast.error("Password is needed");
          toast((t) => (
            <ToastFormNetworkPassword t={t} setPassword={setPassword} />
          ));
        } else if (status === 401) {
          toast.error("Wrong password");
        } else if (status === 500) {
          toast.error("Unknown Error");
        } else if (status === 404) {
          toast.error("No such network");
        }
        setErrorStatus(status);
      });

    const connectWithPassword = (_bssid: string, password: string) => {
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

          if (status === 401) {
            toast.error("Wrong password");
          } else if (status === 500) {
            toast.error("Unknown Error");
          } else if (status === 404) {
            toast.error("No such network");
          }
          setErrorStatus(status);
        });
    };
  };
  return (
    <>
      <div className={styles.networks_container}>
        <div className={styles.ssid}>{network.ssid}</div>
        {network.currentlyUsed === true ? <div>Yes</div> : <div>No</div>}
        <div className={styles.ssid}>{network.signalStrength}</div>
        <div className={styles.ssid}>{network.security}</div>
        {network.networkMode ? (
          <div>{network.networkMode}</div>
        ) : (
          <div>Unknown</div>
        )}
        <div className={styles.ssid}>{network.frequency}</div>
        {network.isHidden ? <div>Yes</div> : <div>No</div>}
        <div className={styles.ssid}>{network.bssid}</div>
        {/* <div className={styles.ssid}>{network.speed}</div> */}
        {/* as an argument to connect will be bssid since it is allways correct and password will be needed when network needs it and will be stored for future use in db or locally however user wants */}
        <div className={styles.connect} onClick={() => connect(network.bssid)}>
          Connect
        </div>
      </div>
    </>
  );
}
