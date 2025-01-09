use std::fs::{remove_file, File};
use std::io::Write;
use std::process::{Command, Output, Stdio};

use super::networkmanager_error::WifiConnectionError;

enum ConnectionType {
    PASSWORD,
    NOPASSWORD,
}

const TEMP_FILE_PATH: &str = "passwd-file";

pub fn connect(bssid: &str, password: Option<&str>) -> Result<(), WifiConnectionError> {
    let mut command = Command::new("nmcli");

    if let Some(pass) = password {
        let mut file = File::create(TEMP_FILE_PATH).expect("Failed to create file");
        writeln!(file, "{}", pass).expect("Failed to write to file");
        command.args(&[
            "dev", "wifi", "connect", bssid,
            "password",
            // "--key-mgmt",
            // "wpa-psk",
            // &format!("\"{}\"", pass),
            // pass,
        ]);
    } else {
        command.args(&["dev", "wifi", "connect", bssid]);
    }

    let output = command
        .output()
        .expect("Failed to execute nmcli, recommended to download it, {}");

    if output.status.success() {
        println!("Successfully connected to netowrk with BSSID: {}", bssid);
        return Ok(());
    }

    let error_msg = String::from_utf8_lossy(&output.stderr).to_string();
    //remove_file(TEMP_FILE_PATH).expect("Removing file failed");
    Err(handle_error(bssid, output, password, error_msg))
}

fn handle_error(
    bssid: &str,
    output: Output,
    password: Option<&str>,
    error_message: String,
) -> WifiConnectionError {
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
        eprintln!("{}", error_message.to_string());
        return WifiConnectionError::WrongPassword;
    }

    eprintln!("{}", error_message.to_string());
    return WifiConnectionError::UnknownError;
}
