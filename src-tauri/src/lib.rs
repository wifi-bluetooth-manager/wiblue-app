use wlan::manager::WifiManager;
use wlan::network_data::WifiNetwork;
use wlan::networkmanager_error::WifiConnectionError;

mod wlan;

#[derive(serde::Serialize, serde::Deserialize)]
struct JsonResponse {
    message: String,
    status: u16,
}

impl JsonResponse {
    fn new(msg: &str, status: u16) -> String {
        let response = JsonResponse {
            message: msg.to_string(),
            status,
        };

        let r = serde_json::to_string(&response).unwrap();
        println!("res: {}", r);
        return r;
    }
}

#[tauri::command]
fn scan() -> String {
    let networks = <WifiNetwork as WifiManager>::scan();
    match networks {
        Ok(net) => {
            serde_json::to_string(&net).unwrap_or_else(|_| "Error serializing networks".to_string())
        }
        Err(_) => "Error getting networks 400".to_string(),
    }
}

#[tauri::command]
fn network_connect(bssid: String, password: String) -> Result<String, String> {
    println!("bssid: {} \n password: {}", bssid.clone(), password.clone());
    let temp_password: Option<&str> = if password.is_empty() {
        None
    } else {
        Some(&password)
    };

    let connection_status = <WifiNetwork as WifiManager>::connect(&bssid, temp_password);

    match connection_status {
        Ok(_) => Ok(JsonResponse::new("Connected Successfully", 200)),
        Err(e) => match e {
            WifiConnectionError::NoSuchNetwork => Err(JsonResponse::new("No network", 404)),
            WifiConnectionError::NoPasswordProvided => {
                Err(JsonResponse::new("No password provided", 502))
            }
            WifiConnectionError::WrongPassword => Err(JsonResponse::new("Wrong password", 401)),
            WifiConnectionError::UnknownError => Err(JsonResponse::new("Unknown error", 500)),
        },
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![scan, network_connect])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
