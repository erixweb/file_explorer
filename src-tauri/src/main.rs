// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use tempfile::tempfile;
use tauri::command;

#[command]
fn create_temp_file(content: String) -> Result<String, String> {
    // Crear un archivo temporal
    let mut file = tempfile().map_err(|e| e.to_string())?;
    
    // Escribir contenido en el archivo
    file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
    
    // Obtener la ruta del archivo
    let path = file.path().to_str().ok_or("Invalid UTF-8 path")?.to_string();

    Ok(path) // Devolver la ruta del archivo temporal
}

#[command]
fn read_file_content(path: String) -> Result<String, String> {
    // Intentar leer el contenido del archivo
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content), // Devuelve el contenido si tiene éxito
        Err(e) => Err(e.to_string()), // Devuelve un error si no se puede leer
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_temp_file, read_file_content]) // Registra ambos comandos
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}