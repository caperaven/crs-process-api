use wasm_bindgen::JsValue;

pub fn evaluate(value: &JsValue) -> Result<bool, JsValue> {
    Ok(!value.is_null())
}
