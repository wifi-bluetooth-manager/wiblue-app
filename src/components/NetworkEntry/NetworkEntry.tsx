import { WifiNetwork } from "../../types/network";
import styles from "./styles.module.scss";

export type NetworkEntryProps = {
  network: WifiNetwork;
};

export default function NetworkEntry({ network }: NetworkEntryProps) {
  //console.log(`Name: ${network.ssid} \n Mode: ${network.networkMode}`);
  return (
    <>
      <div className={styles.networks_container}>
        <div className={styles.ssid}>{network.ssid}</div>
        {network.currentlyUsed ? <div>Yes</div> : <div>No</div>}
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
        <div className={styles.ssid}>{network.speed}</div>
        {/* as an argument to connect will be bssid since it is allways correct and password will be needed when network needs it and will be stored for future use in db or locally however user wants */}
        <div className={styles.connect}>Connect</div>
      </div>
    </>
  );
}
