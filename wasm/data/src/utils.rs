use serde_json::Value;

pub fn flood_indexes(data: &[Value]) -> Vec<usize> {
    let mut result: Vec<usize> = Vec::new();

    let len = data.len();
    for value in 0..len {
        result.push(value);
    }

    return result;
}

pub fn get_properties(obj: &Value) -> Vec<String> {
    let map = obj.as_object().unwrap();
    let keys: Vec<String> = map.keys().cloned().collect();
    return keys;
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::utils::{flood_indexes, get_properties};

    #[test]
    fn flood_indexes_test() {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        data.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        data.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        data.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        data.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));

        let result = flood_indexes(&data);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 0);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 2);
        assert_eq!(result[3], 3);
        assert_eq!(result[4], 4);
    }

    #[test]
    fn get_properties_test() {
        let obj = json!({"id": 0, "name": "John", "code": "AA"});
        let properties = get_properties(&obj);

        assert_eq!(properties.len(), 3);
        assert_eq!(properties[0], "code");
        assert_eq!(properties[1], "id");
        assert_eq!(properties[2], "name");
    }
}