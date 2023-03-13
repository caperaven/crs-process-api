use js_sys::Array;
use wasm_bindgen::JsValue;
use crate::aggregate::aggregate_partial;

pub fn aggregate_all(data: &Array, intent: &[JsValue]) -> Result<JsValue, JsValue> {
    let length = data.length() as usize;
    let mut rows: Vec<usize> = Vec::new();

    for i in 0..length {
        rows.push(i);
    }

    aggregate_partial(data, intent, rows)
}