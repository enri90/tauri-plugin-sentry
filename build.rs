const COMMANDS: &[&str] = &["event", "breadcrumb"];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).global_api_script_path("./api-iife.js").build();
}