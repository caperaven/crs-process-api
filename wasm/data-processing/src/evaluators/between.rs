use js_sys::Array;
use wasm_bindgen::JsValue;

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    let value_string= value_to_string(&value1);

    let collection = Array::from(value2);
    let collection_1 = collection.at(0);
    let collection_2 = collection.at(1);

    let value1: String = value_to_string(&collection_1);
    let value2: String = value_to_string(&collection_2);

    let is_same = value1 < value_string && value_string < value2;

    Ok(is_same)
}

fn value_to_string(value: &JsValue) -> String {
    let value_option = value.as_string();
    let value_string: String;

    if value_option.is_none() {
        let number_value = value.as_f64().unwrap();
        value_string = number_value.to_string();
    } else {
        value_string = value_option.clone().unwrap();
    }

    value_string
}