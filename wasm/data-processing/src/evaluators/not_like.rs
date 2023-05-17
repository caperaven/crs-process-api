use wasm_bindgen::JsValue;
use crate::evaluators::{starts_with, ends_with, contains};

pub fn evaluate(value1: &JsValue, value2: &JsValue) -> Result<bool, JsValue> {
    let mut intent = value2.as_string().unwrap();

    let has_start = intent.starts_with('%');
    let has_end = intent.ends_with('%');

    intent = intent.replace('%', "");

    let value2 = &JsValue::from(intent);

    if has_start && has_end {
        let result = contains::evaluate(value1, value2)?;
        return Ok(!result);
    }

    if has_start {
        let result = !starts_with::evaluate(value1, value2)?;
        return Ok(!result);
    }

    if has_end {
        let result = !ends_with::evaluate(value1, value2)?;
        return Ok(!result);
    }

    Ok(true)
}