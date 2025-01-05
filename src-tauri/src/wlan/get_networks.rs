use std::{collections::VecDeque, process::Command};

use crate::wlan::network_data::{Networkmode, WifiSecurity};

use super::{network_data::WifiNetwork, networkmanager_error::WifiManagerError};

pub fn get_networks() -> Result<Vec<WifiNetwork>, WifiManagerError> {
    let mut wifi_networks: Vec<WifiNetwork> = Vec::new();

    // First, get network data without the SSID
    let output_without_ssid = Command::new("nmcli")
        .args([
            "-f",
            "BSSID,SIGNAL,FREQ,CHAN,SECURITY,MODE",
            "device",
            "wifi",
        ])
        .output()
        .expect("Failed to execute nmcli, recommended to download it");

    if !output_without_ssid.status.success() {
        eprintln!(
            "nmcli command failed: {}",
            String::from_utf8_lossy(&output_without_ssid.stderr)
        );
        return Err(WifiManagerError::CommandExecutionFailure);
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
        let security = match fields[5] {
            "OPEN" => WifiSecurity::OPEN,
            "WEP" => WifiSecurity::WEP,
            "WPA" => WifiSecurity::WPA,
            "WPA2" => WifiSecurity::WPA2,
            "WPA3" => WifiSecurity::WPA3,
            _ => WifiSecurity::UNKNOWN,
        };

        let network_mode = match fields[6] {
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
        let modes = vec![
            Networkmode::INFRA,
            Networkmode::IBSS,
            Networkmode::MONITOR,
            Networkmode::MESH,
            Networkmode::CLIENT,
            Networkmode::AP,
            Networkmode::WDS,
            Networkmode::P2P,
            Networkmode::BRIDGE,
            Networkmode::REPEATER,
        ];

        // Convert enum variants to strings
        let mode_strings: Vec<String> = modes.iter().map(|mode| mode.to_string()).collect();
        let mode_strings_lower: Vec<String> = mode_strings
            .iter()
            .map(|mode| mode.to_lowercase())
            .collect();
        let mode_strings_capital_first: Vec<String> = mode_strings_lower
            .iter()
            .map(|mode| {
                let mut chars = mode.chars();
                match chars.next() {
                    Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
                    None => String::new(),
                }
            })
            .collect();

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
        let mut ssid_parts = Vec::new();
        for line in bssid_search_fields.lines().skip(1) {
            let parts: Vec<&str> = line.split_whitespace().collect();

            // dopoki nie spotkam slowa z mode powinienem sprawdzac to
            // for part in parts
            //

            if parts.len() > 1 {
                let mut deque = VecDeque::from(parts);
                deque.pop_front(); // Remove the first element

                for part in deque {
                    if mode_strings.contains(&part.to_string())
                        || mode_strings_lower.contains(&part.to_string())
                        || mode_strings_capital_first.contains(&part.to_string())
                    {
                        break;
                    }
                    ssid_parts.push(part.to_string());
                }

                //ssid = parts[1].to_string();
                ssid = ssid_parts.join(" ");
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
