use serde_json::Value;

pub fn flood_indexes(data: &Value) -> Vec<usize> {
    let mut result: Vec<usize> = Vec::new();

    let len = data.as_array().unwrap().len();
    for value in 0..len {
        result.push(value);
    }

    return result;
}

#[cfg(test)]
mod test {
    use serde_json::json;
    use crate::utils::flood_indexes;

    #[test]
    fn flood_indexes_test() {
        let data = json!([
            {"id": 0, "code": "A", "value": 10, "isActive": true},
            {"id": 1, "code": "B", "value": 10, "isActive": false},
            {"id": 2, "code": "C", "value": 20, "isActive": true},
            {"id": 3, "code": "D", "value": 20, "isActive": true},
            {"id": 4, "code": "E", "value": 5, "isActive": false}
        ]);

        let result = flood_indexes(&data);
        assert_eq!(result.len(), 5);
        assert_eq!(result[0], 0);
        assert_eq!(result[1], 1);
        assert_eq!(result[2], 2);
        assert_eq!(result[3], 3);
        assert_eq!(result[4], 4);
    }
}