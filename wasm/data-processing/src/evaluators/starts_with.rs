use wasm_bindgen::JsValue;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    let s1 = value1.as_string().unwrap();
    let s2 = value2.as_string().unwrap();

    Ok(s1.starts_with(&s2))
}