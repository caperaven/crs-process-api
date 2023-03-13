use js_sys::Array;
use wasm_bindgen::JsValue;
use crate::unique_values::unique_values_partial;

pub fn unique_values_all(data: &Array, intent: &[JsValue]) -> Result<JsValue, JsValue> {
    let length = data.length() as usize;
    let mut rows: Vec<usize> = Vec::new();

    for i in 0..length {
        rows.push(i);
    }

    unique_values_partial(data, intent, rows)
}