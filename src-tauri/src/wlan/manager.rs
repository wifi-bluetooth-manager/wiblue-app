use super::{
    network_data,
    network_data::{Networkmode, WifiNetwork, WifiSecurity},
    networkmanager_error::NetworkManagerError,
};
use std::process::Command;

impl network_data::WifiNetwork {
    pub fn get_networks() -> Result<Vec<Self>, NetworkManagerError> {
        let mut wifi_networks: Vec<Self> = Vec::new();

        // First, get network data without the SSID
        let output_without_ssid = Command::new("nmcli")
            .args([
                "-f",
                "BSSID,SIGNAL,FREQ,CHAN,SECURITY,MODE",
                "device",
                "wifi",
            ])
            .output()
            .expect("Failed to execute nmcli");

        if !output_without_ssid.status.success() {
            eprintln!(
                "nmcli command failed: {}",
                String::from_utf8_lossy(&output_without_ssid.stderr)
            );
            return Err(NetworkManagerError::CommandExecutionFailure);
        }

        let stdout_without_ssid = String::from_utf8_lossy(&output_without_ssid.stdout);

        for line in stdout_without_ssid.lines().skip(1) {
            println!("{}", line); // Debugging line to check each output line
            let fields: Vec<&str> = line.split_whitespace().collect();

            if fields.len() < 7 {
                continue; // Skip lines with insufficient fields
            }

            // Properly extract BSSID
            let bssid = fields[0].to_string(); // The second field should be BSSID
            let signal_strength = fields[1].parse::<i32>().unwrap_or_default();
            let frequency = fields[2].parse::<u32>().unwrap_or_default();
            let channel = fields[3].parse::<u8>().unwrap_or_default();
            let security = match fields[4] {
                "OPEN" => WifiSecurity::OPEN,
                "WEP" => WifiSecurity::WEP,
                "WPA" => WifiSecurity::WPA,
                "WPA2" => WifiSecurity::WPA2,
                "WPA3" => WifiSecurity::WPA3,
                _ => WifiSecurity::UNKNOWN,
            };

            let network_mode = match fields[5] {
                "Infra" => Networkmode::INFRA,
                "Ad-Hoc" => Networkmode::IBSS,
                "Monitor" => Networkmode::MONITOR,
                "Mesh" => Networkmode::MESH,
                "Client" => Networkmode::CLIENT,
                "AP" => Networkmode::AP,
                "WDS" => Networkmode::WDS,
                "P2P" => Networkmode::P2P,
                "Bridge" => Networkmode::BRIDGE,
                "Repeater" => Networkmode::REPEATER,
                _ => Networkmode::INFRA,
            };

            // Fetch SSID based on the BSSID
            let bssid_search_output = Command::new("nmcli")
                .args(["device", "wifi", "list", "bssid", &bssid])
                .output()
                .expect("Failed to execute nmcli");

            if !bssid_search_output.status.success() {
                eprintln!(
                    "nmcli command failed: {}",
                    String::from_utf8_lossy(&bssid_search_output.stderr)
                );
                continue;
            }

            let bssid_search_fields = String::from_utf8_lossy(&bssid_search_output.stdout);

            // Split by lines and process them
            let mut ssid = String::new();
            for line in bssid_search_fields.lines() {
                let parts: Vec<&str> = line.split_whitespace().collect();

                if parts.len() > 1 {
                    ssid = parts[1].to_string(); // The second field should be SSID
                    break; // Assuming we only care about the first match
                }
            }

            // Push the network details into the vector
            wifi_networks.push(WifiNetwork {
                ssid,
                bssid,
                signal_strength,
                frequency,
                channel,
                security,
                is_hidden: false,
                speed: None,
                currently_used: false, // Based on the first column
                network_mode,
            });
        }

        Ok(wifi_networks)
    }
}
