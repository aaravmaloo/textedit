// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// --- MAKE ABSOLUTELY SURE THIS LINE IS HERE ---
use tauri::{AppHandle, Manager}; // <<<--- THIS ONE
// --- END VERIFICATION ---

use std::fs::File;
use std::io::Write;

#[tauri::command]
async fn create_new_file(app_handle: AppHandle) -> Result<String, String> {
    // This line needs the `Manager` trait to be in scope
    match app_handle.dialog().save_file().await {
        // ... rest of the function
        Ok(Some(path_buf)) => { // User selected a path
            match File::create(&path_buf) {
                Ok(mut file) => {
                    println!("File created successfully at: {:?}", path_buf);
                    Ok(path_buf.to_string_lossy().to_string())
                }
                Err(e) => {
                    eprintln!("Failed to create file: {}", e);
                    Err(format!("Failed to create file: {}", e))
                }
            }
        }
        Ok(None) => { // User cancelled the dialog
            println!("File save dialog was cancelled.");
            Ok("Dialog cancelled.".to_string())
        }
        Err(e) => { // Error occurred showing the dialog
            eprintln!("Failed to show save dialog: {}", e);
            Err(format!("Failed to show save dialog: {}", e))
        }
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_new_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}