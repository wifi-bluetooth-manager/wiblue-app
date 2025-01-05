import { WifiNetwork } from "../../types/network";
import NetworkEntry from "../NetworkEntry/NetworkEntry";
import styles from "./styles.module.scss";

export type NetworkTableProps = {
  networks: WifiNetwork[];
};

export default function NetworkTable({ networks }: NetworkTableProps) {
  return (
    <>
      <div className={styles.networks_container}>
        <div className={styles.title}>
          <div>Name</div>
          <div>Now used</div>
          <div>Signal</div>
          <div>Security</div>
          <div>Mode</div>
          <div>Frequency</div>
          <div>Hidden</div>
          <div>BSSID</div>
          <div>Speed</div>
          <div>Connect</div>
        </div>
        {networks.map((nt) => (
          <NetworkEntry network={nt} />
        ))}
      </div>
    </>
  );
}
