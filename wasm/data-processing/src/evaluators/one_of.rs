use js_sys::Array;
use wasm_bindgen::JsValue;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    let collection = Array::from(value2);
    let index = Array::index_of(&collection, value1, 0);

    if index == -1 {
        return Ok(false);
    }

    Ok(true)
}
