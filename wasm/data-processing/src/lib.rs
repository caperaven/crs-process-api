extern crate core;

mod evaluators;
mod traits;
mod macros;
mod sort;
mod utils;
mod group;
mod aggregate;
mod unique_values;

use js_sys::{Array};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/**
    Bindings for debugging
**/
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn console_log(s: &JsValue);
}

/**
    Utility function to get a value on a object path
    Exposed for testing purposes
**/
#[wasm_bindgen]
pub fn get_value(obj: &JsValue, path: &str) -> JsValue {
    match utils::get_value(obj, path) {
        None => JsValue::NULL,
        Some(value) => value
    }
}

/**
    Check if a object matches the filter intent.
    Based on the filter intent, return true if the object passes evaluation.
    If the object is excluded by the evaluation it returns false.
**/
#[wasm_bindgen]
pub fn in_filter(intent: &JsValue, row: &JsValue, case_sensitive: bool) -> Result<bool, JsValue> {
    evaluators::evaluate_object(intent, row, case_sensitive)
}

/**
    Given an array of objects execute the filter and return an array of indexes of the items that
    passes the filter criteria
**/
#[wasm_bindgen]
pub fn filter(data: &Array, intent: &JsValue, case_sensitive: bool) -> Result<Array, JsValue> {
    let result = Array::new();

    let iterator = data.iter();

    for (index, row) in iterator.enumerate() {
        let pass = in_filter(intent, &row, case_sensitive)?;

        if pass {
            result.push(&JsValue::from(index));
        }
    }

    Ok(result)
}

/**
    Sort the array of objects based on the sort intent.
    If you only want to sort a subset of the records, pass in an array of indexes for the objects
    that must make up the sort result.
**/
#[wasm_bindgen]
pub fn sort(data: &Array, intent: &Array, rows: Option<Vec<usize>>) -> Result<Vec<usize>, JsValue> {
    if data.length() == 0 {
        let result: Vec<usize> = vec![];
        return Ok(result);
    }

    let result: Result<Vec<usize>, JsValue> = match rows {
        None => sort::sort_all(data, intent),
        Some(rows) => sort::sort_partial(data, intent, rows)
    };

    result
}

#[wasm_bindgen]
pub fn group(data: &Array, intent: &Array, rows: Option<Vec<usize>>) -> Result<js_sys::Object, JsValue> {
    if data.length() == 0 {
        return Ok(js_sys::Object::new());
    }

    let result: Result<js_sys::Object, JsValue> = match rows {
        None => group::group_data_all(data, intent),
        Some(rows) => group::group_data_partial(data, intent, rows)
    };

    result
}

#[wasm_bindgen]
pub fn aggregate(data: &Array, intent: Vec<JsValue>, rows: Option<Vec<usize>>) -> Result<JsValue, JsValue> {
    if data.length() == 0 {
        return Ok(JsValue::NULL);
    }

    let result: Result<JsValue, JsValue> = match rows {
        None => aggregate::aggregate_all(data, &intent),
        Some(rows) => aggregate::aggregate_partial(data, &intent, rows)
    };

    result
}

#[wasm_bindgen]
pub fn unique_values(data: &Array, intent: Vec<JsValue>, rows: Option<Vec<usize>>) -> Result<JsValue, JsValue> {
    if data.length() == 0 {
        return Ok(JsValue::NULL);
    }

    let result: Result<JsValue, JsValue> = match rows {
        None => unique_values::unique_values_all(data, &intent),
        Some(rows) => unique_values::unique_values_partial(data, &intent, rows)
    };

    result
}
