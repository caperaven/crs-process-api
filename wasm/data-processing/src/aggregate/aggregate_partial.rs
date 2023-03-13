use hashbrown::HashMap;
use js_sys::Array;
use wasm_bindgen::JsValue;
use crate::aggregate::aggregate_numbers::NumberAggregator;

pub fn aggregate_partial(data: &Array, intent: &[JsValue], rows: Vec<usize>) -> Result<JsValue, JsValue> {
    let mut map: HashMap<String, NumberAggregator> = HashMap::new();

    for key in intent.iter() {
        let property = key.as_string().unwrap().clone();
        map.insert(property.clone(), NumberAggregator::new());
    }

    for index in rows.iter() {
        let row = data.at(*index as i32);
        for key in intent.iter() {
            let value = js_sys::Reflect::get(&row, key).unwrap();
            let aggregator = map.get_mut(&key.as_string().unwrap()).unwrap();
            aggregator.add(value.as_f64().unwrap());
        }
    }

    let result: js_sys::Object = js_sys::Object::new();
    for key in intent.iter() {
        let aggregator = map.get_mut(&key.as_string().unwrap()).unwrap();
        js_sys::Reflect::set(&result, key, &JsValue::from(aggregator.value().unwrap()))?;
    }

    Ok(JsValue::from(result))
}
