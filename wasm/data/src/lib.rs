#![feature(option_result_contains)]
// https://docs.serde.rs/serde_json/value/enum.Value.html

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

use processors::filter;
use crate::duration::iso8601_to_duration_str;

/// Calculate a intent description where the following actions or a subset of these actions took place.
/// 1. Filter
/// 2. Sort
/// 3. Group
/// 4. Aggregates
/// 5. Unique Value
pub fn get_perspective(_intent: Value, data: Value) -> Value {
    if data.is_array() == false {
        return Value::from("error: data must be an array");
    }

    return json!({
    })
}

/// Test if a object is visible in the scope of the defined filter.
pub fn in_filter(intent: Value, object: Value) -> bool {
    return evaluate_object(&intent, &object);
}

/// Convert PT100H30M into "0:0:100:30:0"
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
    use serde_json::json;
    use crate::in_filter;

    #[test]
    fn in_filter_test() {
        assert_eq!(in_filter(json!({ "field": "value", "operator": "eq", "value": 10 }), json!({ "value": 10 })), true);
        assert_eq!(in_filter(json!({ "field": "value", "operator": "eq", "value": 10 }), json!({ "value": 20 })), false);
    }
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
 */