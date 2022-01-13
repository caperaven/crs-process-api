use serde_json::Value;
use crate::utils::get_properties;

pub fn summarize(data: &Vec<Value>, fields: Vec<String>) -> Value {
    let _field_names = get_field_names(&data[0], fields);

    Value::Null
}

fn get_field_names(obj: &Value, fields: Vec<String>) -> Vec<String> {
    if fields.len() > 0 {
        return fields;
    }

    return get_properties(&obj);
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::summary::summarize;

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
    fn summarize_test() {
        let data = get_data();
        let fields: Vec<String> = vec!["code".into(), "value".into()];
        let summary = summarize(&data, fields);
        assert_eq!(summary, Value::Null);
    }
}