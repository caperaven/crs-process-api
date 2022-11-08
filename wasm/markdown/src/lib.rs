use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn markdown_to_html() -> JsValue {
    JsValue::from_str("Hello World")
}