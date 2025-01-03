// Struct to represent a Wi-Fi network

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct WifiNetwork {
    // Wi-Fi network name
    pub ssid: String,
    // MAC address of the access point
    pub bssid: String,
    // Signal strength in dBm (stronger signals have higher values)
    pub signal_strength: i32,
    // Frequency in MHz (e.g., 2400 MHz for 2.4 GHz, 5000 MHz for 5 GHz)
    pub frequency: u32,
    // Channel number the network is using
    pub channel: u8,
    // Security protocol used by the network (e.g., WPA2, WPA3)
    pub security: WifiSecurity,
    // Whether the network is hidden (does not broadcast SSID)
    pub is_hidden: bool,
    // Maximum speed in Mbps (if available)
    pub speed: Option<u32>,

    pub currently_used: bool,
}

// Struct for a network reported by `nmcli` (NetworkManager CLI)
pub struct NmcliNetwork {
    // Wi-Fi network name
    pub ssid: String,
    // MAC address of the access point
    pub bssid: String,
    // Mode of operation for the network
    pub mode: Networkmode,
}

// Enum for Wi-Fi network modes
pub enum Networkmode {
    // Standard network where devices connect to an access point (AP)
    INFRA,
    // Devices connect directly without an access point (Ad-Hoc)
    IBSS,
    // Used for monitoring network traffic
    MONITOR,
    // Multiple access points forming a mesh network
    MESH,
    // Device connects to an existing network as a client
    CLIENT,
    // Device acts as a wireless access point
    AP,
    // Extends a network using multiple access points
    WDS,
    // Devices connect directly for file sharing (Peer-to-Peer)
    P2P,
    // Connects two networks together (Bridge)
    BRIDGE,
    // Amplifies Wi-Fi signal to extend range (Repeater)
    REPEATER,
}

// Enum for Wi-Fi security protocols
#[derive(Debug, Clone, Serialize)]
pub enum WifiSecurity {
    // Open network with no encryption
    OPEN,
    // WEP (outdated and insecure)
    WEP,
    // WPA (improved security over WEP)
    WPA,
    // WPA2 (common security protocol)
    WPA2,
    // WPA3 (most secure protocol)
    WPA3,
    // Unknown security protocol
    UNKNOWN,
}
