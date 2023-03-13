use wasm_bindgen::JsValue;
use crate::eval;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    eval!(value1, ==, value2)
}
