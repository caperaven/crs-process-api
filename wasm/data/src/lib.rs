#![feature(option_result_contains)]
// https://docs.serde.rs/serde_json/value/enum.Value.html

use serde_json::{json, Value};
use crate::evaluators::evaluate_object;

mod evaluators;
mod macros;
mod processors;

use processors::process_filter;

/// Calculate a intent description where the following actions or a subset of these actions took place.
/// 1. Filter
/// 2. Sort
/// 3. Group
/// 4. Aggregates
pub fn get_perspective(intent: Value, data: Value) -> Value {
    if data.is_array() == false {
        return Value::from("error: data must be an array");
    }

    let filter_result = process_filter(&intent["filter"], &data);

    return json!({
        "rows": filter_result
    })
}
