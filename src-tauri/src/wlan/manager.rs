use super::{
    network_data::{self, WifiNetwork},
    networkmanager_error::{WifiConnectionError, WifiManagerError},
};

pub trait WifiManager {
    fn scan() -> Result<Vec<WifiNetwork>, WifiManagerError>;
    fn connect(bssid: &str, password: Option<&str>) -> Result<(), WifiConnectionError>;
}

impl WifiManager for network_data::WifiNetwork {
    fn scan() -> Result<Vec<Self>, WifiManagerError> {
        return super::get_networks::get_networks();
    }

    fn connect(bssid: &str, password: Option<&str>) -> Result<(), WifiConnectionError> {
        return super::connect_network::connect(bssid, password);
    }
}
