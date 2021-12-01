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
/// 5. Unique Value
pub fn get_perspective(intent: Value, data: Value) -> Value {
    if data.is_array() == false {
        return Value::from("error: data must be an array");
    }

    let filter_result = process_filter(&intent["filter"], &data);

    return json!({
        "rows": filter_result,
    })
}

/*
    Features:
    1. get_perspective
        1.1 filter
            1.1.1 add flag to indicate that it is case insensitive, default is case sensitive
            1.1.2 allow rows where the property is not a value but a object ... use path as field "field": "field1.code"
        1.2 sort
        1.3 group
        1.4 aggregates
        1.5 give unique values
        1.6 duration PT types (iso) https://en.wikipedia.org/wiki/ISO_8601

    2. get_unique_values
        2.1 get from the entire table
        2.2 get from provided indexes
        2.3 get from filter expression
        2.4 give count of unique values

    3. in_filter ?
        3.1 provide filter expression and data object
        3.2 does this object or array of objects pass the current filter's visibility

 */