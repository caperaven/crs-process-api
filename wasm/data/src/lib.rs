#![feature(option_result_contains)]
// https://docs.serde.rs/serde_json/value/enum.Value.html

use wasm_bindgen::prelude::*;
use serde_json::{json, Value};
use crate::evaluators::evaluate_object;

mod evaluators;
mod macros;
mod processors;
mod utils;
mod duration;
mod enums;
mod aggregates;
mod traits;

use crate::duration::iso8601_to_duration_str;

/// Calculate a intent description where the following actions or a subset of these actions took place.
/// 1. Filter
/// 2. Sort
/// 3. Group
/// 4. Aggregates
/// 5. Unique Value
// pub fn get_perspective(_intent: Value, data: Value) -> Value {
//     if data.is_array() == false {
//         return Value::from("error: data must be an array");
//     }
//
//     return json!({
//     })
// }

/// Test if a object is visible in the scope of the defined filter.
#[wasm_bindgen]
pub fn in_filter(intent: JsValue, object: JsValue) -> bool {
    let intent_str = intent.as_string().unwrap();
    let intent_val = json!(intent_str);

    let object_str = object.as_string().unwrap();
    let object_val = json!(object_str);

    return evaluate_object(&intent_val, &object_val);
}

/// Filter a set of records and give back the indexes of the records visible in the filter.
#[wasm_bindgen]
pub fn filter_data(intent: JsValue, data: JsValue) -> Vec<usize> {
    let intent_str = intent.as_string().unwrap();
    let intent_val = json!(intent_str);

    let data_str = data.as_string().unwrap();
    let data_val = json!(data_str);

    return processors::filter(&intent_val, &data_val);
}

#[wasm_bindgen]
pub fn group_data(intent: String, data: String) -> String {
    let intent_array: Vec<&str> = serde_json::from_str(intent.as_str()).unwrap();
    let data_array: Vec<Value> = serde_json::from_str(data.as_str()).unwrap();

    let result = processors::group(&intent_array, &data_array);

    return String::from(result.to_string());
}

/// Convert PT100H30M into "0:0:100:30:0"
#[wasm_bindgen]
pub fn iso8601_to_string(duration: String) -> String {
    iso8601_to_duration_str(&Value::from(duration))
}

/// Take a grouping structure and sort it according to the intent.
/// todo
// pub fn sort_grouping(intent: Value, grouping: Value) -> Value {
//     return Value::Object(Default::default());
// }

#[cfg(test)]
mod test {
}

/*
    Features:
    1. get_perspective
        1.1 filter
            1.1.1 add flag to indicate that it is case insensitive, default is case sensitive
            1.1.2 allow rows where the property is not a value but a object ... use path as field "field": "field1.code"
        1.2 sort - done
        1.3 group - done
        1.3.1 add sorting to group - todo
        1.4 aggregates - in progress
            1.5 add features to help with duration aggregation
        1.5 give unique values
        1.6 duration PT types (iso) https://en.wikipedia.org/wiki/ISO_8601 - done

    2. get_unique_values
        2.1 get from the entire table
        2.2 get from provided indexes
        2.3 get from filter expression
        2.4 give count of unique values


    console_error_panic_hook::set_once();

 */