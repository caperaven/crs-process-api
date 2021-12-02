use serde_json::Value;
use crate::evaluate_object;

pub fn process_filter(intent: &Value, data: &Value) -> Value {
    let mut index = 0;
    let mut filter_result = Vec::new();

    let filters = intent.as_array().unwrap();
    let mut pass: bool;

    for row in data.as_array().unwrap() {
        pass = true;

        for filter in filters {
            pass = evaluate_object(filter, row);

            if pass == false {
                break;
            }
        }

        if pass == true {
            filter_result.push(index);
        }

        index += 1;
    }

    Value::from(filter_result)
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::{process_filter};
    use serde_json::Value::Null;

    fn get_data() -> Value {
        return json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);
    }

    #[test]
    fn simple_filter_test() {
        let data = get_data();
        let intent = json!([{ "field": "value", "operator": "<", "value": 20 }]);

        let result = process_filter(&intent, &data);
        let array = result.as_array().unwrap();

        assert_eq!(array.len(), 3);
        assert_eq!(array[0], 0);
        assert_eq!(array[1], 1);
        assert_eq!(array[2], 4);
    }

    #[test]
    fn composite_filter_test() {
        let data = get_data();
        let intent = json!([
            {"field": "value", "operator": "<", "value": 20},
            {"field": "isActive", "operator": "==", "value": false}
        ]);

        let result = process_filter(&intent, &data);
        let array = result.as_array().unwrap();

        assert_eq!(array.len(), 2);
        assert_eq!(array[0], 1);
        assert_eq!(array[1], 4);
    }

    #[test]
    fn complex_filter_test() {
        let data = get_data();
        let intent = json!([
            { "field": "code", "operator": "in", "value": ["A", "B", "C"] },
            { "field": "value", "operator": "==", "value": 10 },
            { "field": "isActive", "operator": "not_null", "value": Null}
        ]);

        let result = process_filter(&intent, &data);
        let array = result.as_array().unwrap();

        assert_eq!(array.len(), 2);
        assert_eq!(array[0], 0);
        assert_eq!(array[1], 1);
    }
}