use std::process::{Command, Output};

use super::networkmanager_error::WifiConnectionError;

enum ConnectionType {
    PASSWORD,
    NOPASSWORD,
}

pub fn connect(bssid: &str, password: Option<&str>) -> Result<(), WifiConnectionError> {
    let mut command = Command::new("nmcli");
    command.args(&["dev", "wifi", "connect", bssid]);
    if let Some(pass) = password {
        command.args(&["password", pass]);
    }

    let output = command
        .output()
        .expect("Failed to execute nmcli, recommended to download it, {}");

    if output.status.success() {
        println!("Successfully connected to netowrk with BSSID: {}", bssid);
        return Ok(());
    }

    Err(handle_error(bssid, output, password))
}

fn handle_error(bssid: &str, output: Output, password: Option<&str>) -> WifiConnectionError {
    let error_message = String::from_utf8_lossy(&output.stderr);

    if (error_message.contains("Passwords or encryption keys are required to access ")
        || error_message.contains("Secrets were required, but not provided"))
        && password.is_none()
    {
        eprintln!(
            "Failed to connect to network with BSSID {} \n Password is required \n Error: {}",
            bssid, error_message
        );
        return WifiConnectionError::NoPasswordProvided;
    }
    if error_message.contains("No suitable network found")
        || error_message.contains("No network with")
    {
        eprintln!("No sutch network with BSSID: {} found", bssid);
        return WifiConnectionError::NoSuchNetwork;
    }
    if (error_message.contains("activation failed")
        || error_message.contains("property is missing"))
        && password.is_some()
    {
        eprintln!("Wrong password to connect to network with BSSID: {}", bssid);
        return WifiConnectionError::WrongPassword;
    }
    return WifiConnectionError::UnknownError;
}
