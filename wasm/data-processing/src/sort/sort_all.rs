use js_sys::Array;
use wasm_bindgen::JsValue;
use crate::sort::sort_partial;

pub fn sort_all(data: &Array, intent: &Array) -> Result<Vec<usize>, JsValue> {
    let length = data.length() as usize;
    let mut rows: Vec<usize> = Vec::new();

    for i in 0..length {
        rows.push(i);
    }

    sort_partial(data, intent, rows)
}