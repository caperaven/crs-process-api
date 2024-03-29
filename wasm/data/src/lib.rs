// https://docs.serde.rs/serde_json/value/enum.Value.html

use wasm_bindgen::prelude::*;
use serde_json::{Value};
use crate::evaluators::evaluate_object;

mod evaluators;
mod macros;
mod processors;
mod utils;
mod duration;
mod enums;
mod aggregates;
mod traits;

use crate::duration::{iso8601_to_duration_str, iso8601_to_duration_str_batch};
use crate::processors::get_unique;

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/// Test if a object is visible in the scope of the defined filter.
#[wasm_bindgen]
pub fn in_filter(intent: String, object: String, case_sensitive: bool) -> bool {
    let filters: Vec<Value> = serde_json::from_str(intent.as_str()).unwrap();
    let obj: Value = serde_json::from_str(object.as_str()).unwrap();
    return processors::in_filter(&filters, &obj, case_sensitive);
}

/// Filter a set of records and give back the indexes of the records visible in the filter.
#[wasm_bindgen]
pub fn filter_data(intent: String, data: String, case_sensitive: bool) -> Vec<usize> {
    let intent_val: Vec<Value> = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    return processors::filter(&intent_val, &data_array, case_sensitive);
}

#[wasm_bindgen]
pub fn group_data(intent: String, data: String) -> String {
    let intent_array: Vec<&str> = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let result = processors::group(&intent_array, &data_array, None, None);

    return result.to_string();
}

#[wasm_bindgen]
pub fn sort_data(intent: String, data: String, rows: Vec<usize>) -> Vec<usize> {
    let intent_value: Vec<Value> = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let sort_rows;
    if rows.len() == 0 {
        sort_rows = None;
    }
    else {
        sort_rows = Some(rows);
    }

    return processors::sort(&intent_value, &data_array, sort_rows);
}

#[wasm_bindgen]
pub fn aggregate_rows(intent: String, data: String, rows: Vec<usize>) -> String {
    let intent_obj: Value = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let agg_rows;
    if rows.len() == 0 {
        agg_rows = None;
    }
    else {
        agg_rows = Some(rows);
    }

    let result = processors::aggregate_rows(&intent_obj, &data_array, agg_rows);

    return result.to_string();
}

#[wasm_bindgen]
pub fn calculate_group_aggregate(group: String, aggregate_intent: String, data: String) -> String {
    let mut group_obj = serde_json::from_str(group.as_str()).unwrap();
    let agg_obj = serde_json::from_str(aggregate_intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    processors::calculate_group_aggregate(&mut group_obj, &agg_obj, &data_array);

    return group_obj.to_string();
}

#[wasm_bindgen]
pub fn unique_values(intent: String, data: String, rows: Vec<usize>) -> String {
    let fields_array: Vec<Value> = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let unique_rows;
    if rows.len() == 0 {
        unique_rows = None;
    }
    else {
        unique_rows = Some(rows);
    }

    let result = get_unique(fields_array, &data_array, unique_rows);
    return result.to_string();
}

/// Convert PT100H30M into "0:0:100:30:0"
#[wasm_bindgen]
pub fn iso8601_to_string(duration: String) -> String {
    iso8601_to_duration_str(&Value::from(duration))
}

#[wasm_bindgen]
pub fn iso8601_batch(dates: String, field_name: Option<String>) -> String {
    let dates_array: Vec<Value> = serde_json::from_str(dates.as_str()).unwrap();
    let result = iso8601_to_duration_str_batch(dates_array, field_name);
    let obj = Value::from(result);
    return obj.to_string();
}

#[wasm_bindgen]
pub fn evaluate_obj(expr: String, object: String, case_sensitive: bool) -> bool {
    let intent_obj = serde_json::from_str(expr.as_str()).unwrap();
    let object_obj = serde_json::from_str(object.as_str()).unwrap();

    evaluate_object(&intent_obj, &object_obj, case_sensitive)
}

#[wasm_bindgen]
pub fn build_perspective(intent: String, data: String, rows: Vec<usize>) -> String {
    let intent_obj = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let result = processors::build_perspective(&intent_obj, &data_array, &rows);
    return result;
}