use wasm_bindgen::JsValue;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    if value1.is_string() {
        let s1 = value1.as_string().unwrap();
        let s2 = value2.as_string().unwrap();

        let result = s1.find(&s2);

        return match result {
            Some(_value) => Ok(true),
            None => Ok(false)
        }
    }

    Ok(false)
}
