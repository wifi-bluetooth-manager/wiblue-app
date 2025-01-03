use super::{
    network_data,
    network_data::{WifiNetwork, WifiSecurity},
    networkmanager_error::NetworkManagerError,
};
use std::process::Command;

impl network_data::WifiNetwork {
    pub fn get_networks() -> Result<Vec<Self>, NetworkManagerError> {
        let mut wifi_networks: Vec<Self> = Vec::new();

        let output = Command::new("nmcli")
            .args([
                "-f",
                "IN-USE,SSID,BSSID,SIGNAL,FREQ,CHAN,SECURITY",
                "device",
                "wifi",
            ])
            .output()
            .expect("Failed to execute nmcli");

        if !output.status.success() {
            eprintln!(
                "nmcli command failed: {}",
                String::from_utf8_lossy(&output.stderr)
            );
            return Err(NetworkManagerError::CommandExecutionFailure);
        }

        let stdout = String::from_utf8_lossy(&output.stdout);

        for line in stdout.lines().skip(1) {
            // Split the line into fields, accounting for possible extra spaces
            let fields: Vec<&str> = line.split_whitespace().collect();

            if fields.len() < 7 {
                continue;
            }

            // Parse whether the network is in use

            let ssid = fields[1].to_string();
            let bssid = fields[2].to_string();
            let signal_strength = fields[3].parse::<i32>().unwrap_or_default();
            let frequency = fields[4].parse::<u32>().unwrap_or_default();
            let channel = fields[5].parse::<u8>().unwrap_or_default();
            let security = match fields[6] {
                "OPEN" => WifiSecurity::OPEN,
                "WEP" => WifiSecurity::WEP,
                "WPA" => WifiSecurity::WPA,
                "WPA2" => WifiSecurity::WPA2,
                "WPA3" => WifiSecurity::WPA3,
                _ => WifiSecurity::UNKNOWN,
            };
            let currently_used = fields[0] == "*";

            wifi_networks.push(WifiNetwork {
                ssid,
                bssid,
                signal_strength,
                frequency,
                channel,
                security,
                is_hidden: false, // "HIDDEN" field is no longer available
                speed: None,
                currently_used,
            });
        }

        Ok(wifi_networks)
    }
}
