use tauri::command;
use std::fs::File;
use std::io::Result;

#[command]
fn create_new_file(path: String) -> Result<()> {
    File::create(path)?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_new_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}