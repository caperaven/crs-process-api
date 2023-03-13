use hashbrown::HashMap;
use js_sys::{Array};
use wasm_bindgen::JsValue;
use crate::utils::value_to_string;

pub fn unique_values_partial(data: &Array, intent: &[JsValue], rows: Vec<usize>) -> Result<JsValue, JsValue> {
    let mut property_map: HashMap<String, HashMap<String, i32>> = HashMap::new();

    for key in intent.iter() {
        let property = key.as_string().unwrap().clone();
        property_map.insert(property.clone(), HashMap::new());
    }

    for index in rows {
        let row = data.at(index as i32);

        for key in intent.iter() {
            let row_value = js_sys::Reflect::get(&row, key).unwrap();
            let row_value_str = value_to_string(&row_value);

            let value_map = property_map.get_mut(&key.as_string().unwrap()).unwrap();
            value_map.entry(row_value_str)
                .and_modify(|count| *count += 1)
                .or_insert(1);
        }
    }

    let result: js_sys::Object = js_sys::Object::new();

    for (key, value) in property_map {
        let property = key;
        let property_result: js_sys::Object = js_sys::Object::new();
        for (key, value) in value {
            js_sys::Reflect::set(&property_result, &JsValue::from(key), &JsValue::from(value))?;
        }

        js_sys::Reflect::set(&result, &JsValue::from(property), &property_result)?;
    }

    Ok(JsValue::from(result))
}