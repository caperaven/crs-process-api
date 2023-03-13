use js_sys::Array;
use wasm_bindgen::JsValue;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    let value = value1.as_string().unwrap();
    let collection = Array::from(value2);
    let value1: String = collection.at(0).as_string().unwrap();
    let value2: String = collection.at(1).as_string().unwrap();

    let is_same = value1 <= value && value <= value2;
    Ok(is_same)
}