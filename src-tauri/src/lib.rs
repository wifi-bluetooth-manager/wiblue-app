// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod wlan;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_networks() -> String {
    let networks = wlan::network_data::WifiNetwork::get_networks();
    match networks {
        Ok(net) => {
            serde_json::to_string(&net).unwrap_or_else(|_| "Error serializing networks".to_string())
        }
        Err(_) => "Error getting networks".to_string(),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_networks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
