use wasm_bindgen::JsValue;

pub fn get_value(obj: &JsValue, path: &str) -> Option<JsValue> {
    let parts = path.split('.');
    let mut result = JsValue::from(obj);

    for part in parts {
        let has_property = js_sys::Reflect::has(&result, &JsValue::from(part)).unwrap();
        if !has_property {
            return None
        }

        result = js_sys::Reflect::get(&result, &JsValue::from(part)).ok()?;
    }

    Some(result)
}

pub fn value_to_string(value: &JsValue) -> String {
    let binding = value.js_typeof().as_string().unwrap();
    let js_type = binding.as_str();

    if value.is_null() {
        return String::from("null");
    }

    match js_type {
        "string" => value.as_string().unwrap(),
        "number" => value.as_f64().unwrap().to_string(),
        "boolean" => value.as_bool().unwrap().to_string(),
        _ => String::from("")
    }
}