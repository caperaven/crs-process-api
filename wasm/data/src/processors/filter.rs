use serde_json::Value;
use crate::evaluate_object;

pub fn filter(intent: &Vec<Value>, data: &Vec<Value>, case_sensitive: bool) -> Vec<usize> {
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

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::filter;
    use serde_json::Value::Null;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));
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
}