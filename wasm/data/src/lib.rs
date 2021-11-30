// https://docs.serde.rs/serde_json/value/enum.Value.html

use serde_json::{json, Value};

#[macro_use]

mod evaluators;
mod macros;
mod filter;
mod utils;

/**
    1. Here is some data

    1. Filter
    2. Sort
    3. Grouping
    4. Aggregates -> Per grouping? -> Data
**/

fn Filter(intent: &Value, data: &Value) -> Value {
    let mut index = 0;
    let mut filter_result = Vec::new();

    for row in data.as_array().unwrap() {
        filter_result.push(index);
    }

    Value::from(filter_result)
}

fn Sort(intent: Value, data: Value) -> Value {
    return Value::Null;
}

fn Group(intent: Value, data: Value) -> Value {
    return Value::Null;
}

fn Aggretate(intent: Value, data: Value) -> Value {
    return Value::Null;
}

/// Calculate a intent description where the following actions or a subset of these actions took place.
/// 1. Filter
/// 2. Sort
/// 3. Group
/// 4. Aggregates
pub fn GetPerspective(intent: Value, data: Value) -> Value {
    if data.is_array() == false {
        return Value::from("error: data must be an array");
    }

    let filter_result = Filter(&intent["filter"], &data);

    return json!({
        "rows": filter_result
    })
}

#[cfg(test)]
mod test {
    use serde_json::json;
    use crate::GetPerspective;

    #[test]
    fn simple_filter_test() {
        let data = json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);

        let intent = json!({
           "filter": [
                {"field": "value", "operator": "<", "value": 20}
            ]
        });

        let result = GetPerspective(intent, data);
        let array = result["rows"].as_array().unwrap();

        assert_eq!(array.len(), 5);
    }
}