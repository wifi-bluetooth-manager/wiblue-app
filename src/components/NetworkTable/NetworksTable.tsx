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
        {networks.map((nt) => (
          <NetworkEntry network={nt} />
        ))}
      </div>
    </>
  );
}
