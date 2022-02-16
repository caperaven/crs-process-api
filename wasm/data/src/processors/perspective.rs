use serde_json::Value;
use crate::processors;

pub fn build_perspective(perspective: &Value, data: &[Value]) -> String {
    let _rows = get_rows(perspective, data);
println!("{:?}", _rows);
    return String::new()
}

fn get_case_sensitive(perspective: &Value) -> bool {
    let result = perspective.get("case_sensitive");

    return match result {
        None => false,
        Some(value) => value.as_bool().unwrap()
    }
}

fn get_rows(perspective: &Value, data: &[Value]) -> Vec<usize> {
    let case_sensitive = get_case_sensitive(perspective);

    let mut result: Vec<usize>;

    let filter = perspective.get("filter");
    return match filter {
        None => {
            result = Vec::new();
            for i in 0..data.len() {
                result.push(i);
            }
            result
        }
        Some(filter_intent) => {
            processors::filter(&filter_intent.as_array().unwrap(), data, case_sensitive)
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::build_perspective;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true, "person": {"name": "John"}}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false, "person": {"name": "John"}}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true, "person": {"name": "Jane"}}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true, "person": {"name": "Jane"}}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false, "person": {"name": "Andrew"}}));
        return result;
    }

    #[test]
    fn build_perspective_filter_test() {
        let data = get_data();

        let intent = json!({
           "filter": [{ "field": "value", "operator": "<", "value": 20 }],
            "case_sensitive": false
        });

        let result = build_perspective(&intent, &data);

        println!("{:?}", result);
    }
}