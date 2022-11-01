use serde_json::Value;
use crate::evaluate_object;

pub fn filter(intent: &[Value], data: &[Value], case_sensitive: bool) -> Vec<usize> {
    let mut index = 0;
    let mut filter_result = Vec::new();

    let filters = intent;
    let mut pass: bool;

    for row in data {
        pass = true;

        for filter in filters {
            pass = evaluate_object(filter, row, case_sensitive);

            if pass == false {
                break;
            }
        }

        if pass == true {
            filter_result.push(index);
        }

        index += 1;
    }

    filter_result
}

pub fn in_filter(filters: &[Value], obj: &Value, case_sensitive: bool) -> bool {
    for filter in filters {
        if evaluate_object(&filter, &obj, case_sensitive) == false {
            return false;
        }
    }
    return true;
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::{filter, in_filter};
    use serde_json::Value::Null;

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
    fn simple_filter_test() {
        let data = get_data();
        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({ "field": "value", "operator": "<", "value": 20 }));

        let result = filter(&intent, &data, true);

        assert_eq!(result.len(), 3);
        assert_eq!(result[0], 0);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 4);
    }

    #[test]
    fn composite_filter_test() {
        let data = get_data();
        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({"field": "value", "operator": "<", "value": 20}));
        intent.push(json!({"field": "isActive", "operator": "==", "value": false}));

        let result = filter(&intent, &data, true);

        assert_eq!(result.len(), 2);
        assert_eq!(result[0], 1);
        assert_eq!(result[1], 4);
    }

    #[test]
    fn complex_filter_test() {
        let data = get_data();

        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({ "field": "code", "operator": "in", "value": ["A", "B", "C"] }));
        intent.push(json!({ "field": "value", "operator": "==", "value": 10 }));
        intent.push(json!({ "field": "isActive", "operator": "not_null", "value": Null}));

        let result = filter(&intent, &data, true);

        assert_eq!(result.len(), 2);
        assert_eq!(result[0], 0);
        assert_eq!(result[1], 1);
    }

    #[test]
    fn filter_case_insensitive_test() {
        let data = get_data();
        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({ "field": "code", "operator": "==", "value": "A"}));
        intent.push(json!({ "field": "value", "operator": "==", "value": 10 }));

        let result = filter(&intent, &data, false);
        assert_eq!(result.len(), 1);
    }

    #[test]
    fn filter_on_object_path_test() {
        let data = get_data();
        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({ "field": "person.name", "operator": "==", "value": "John"}));
        intent.push(json!({ "field": "value", "operator": "==", "value": 10 }));

        let result = filter(&intent, &data, false);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn in_filter_test() {
        let value1 = json!({"id": 0, "code": "A", "value": 10, "isActive": true, "person": {"name": "John"}});
        let value2 = json!({"id": 0, "code": "B", "value": 10, "isActive": true, "person": {"name": "John"}});

        let mut intent: Vec<Value> = Vec::new();
        intent.push(json!({ "field": "code", "operator": "==", "value": "A"}));
        intent.push(json!({ "field": "value", "operator": "==", "value": 10 }));

        let value1_result = in_filter(&intent, &value1, true);
        let value2_result = in_filter(&intent, &value2, true);

        assert_eq!(value1_result, true);
        assert_eq!(value2_result, false);
    }
}