import { WifiNetwork } from "../../types/network";
import styles from "./styles.module.scss";

export type NetworkEntryProps = {
  network: WifiNetwork;
};

export default function NetworkEntry({ network }: NetworkEntryProps) {
  return (
    <>
      <div className={styles.networks_container}>
        <div className={styles.ssid}>{network.ssid}</div>
        <div className={styles.ssid}>{network.currentlyUsed}</div>
        <div className={styles.ssid}>{network.signalStrength}</div>
        <div className={styles.ssid}>{network.security}</div>
        <div className={styles.ssid}>{network.networkMode}</div>
        <div className={styles.ssid}>{network.frequency}</div>
        {network.isHidden ? <div>Yes</div> : <div>No</div>}
        <div className={styles.ssid}>{network.bssid}</div>
        <div className={styles.ssid}>{network.speed}</div>
      </div>
    </>
  );
}
