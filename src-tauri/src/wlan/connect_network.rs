use std::io::Write;
use std::process::{Command, Output, Stdio};

use super::networkmanager_error::WifiConnectionError;

enum ConnectionType {
    PASSWORD,
    NOPASSWORD,
}

pub fn connect(bssid: &str, password: Option<&str>) -> Result<(), WifiConnectionError> {
    let mut command = Command::new("nmcli");

    if let Some(pass) = password {
        command.args(&[
            "dev", "wifi", "connect", bssid, "password",
            // "--key-mgmt",
            // "wpa-psk",
            // &format!("\"{}\"", pass),
            pass,
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

    if error_msg.contains("wireless-security.psk") {
        return Err(handle_error(bssid, output, password, error_msg));
    } else {
        let mut command = Command::new("nmcli");

        command
            .args(&["dev", "wifi", "connect", bssid, "--ask"])
            .stdin(Stdio::piped());

        let mut child = command.spawn().expect("Failure to execute nmcli");

        if let Some(pass) = password {
            if let Some(ref mut stdin) = child.stdin {
                if writeln!(stdin, "{}", pass).is_err() {
                    eprintln!("Failed to insert password into ask command");
                    return Err(WifiConnectionError::UnknownError);
                }
            }
        }

        let output = child
            .wait_with_output()
            .expect("Failed to read nmcli output");

        if output.status.success() {
            println!("connected successfully with ask");
            return Ok(());
        } else {
            eprintln!(
                "Failed to connect. Error: {}",
                String::from_utf8_lossy(&output.stderr)
            );
            return Err(WifiConnectionError::AskingError);
        }
    }
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
