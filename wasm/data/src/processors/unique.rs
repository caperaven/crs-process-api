use std::collections::{HashMap, HashSet};
use serde_json::Value;

pub fn get_unique(intent: &Vec<&str>, data: &Vec<Value>, rows: Option<Vec<usize>>) -> Value {
    let mut values: HashMap<String, HashSet<String>> = HashMap::new();

    match rows {
        None => {
            for row in data {
                set_values(&row, &intent, &mut values);
            }
        }
        Some(rows) => {
            for row_index in rows {
                let row = &data[row_index];
                set_values(&row, &intent, &mut values);
            }
        }
    }

    let mut result = Value::Object(Default::default());

    for (key, value) in values.into_iter() {
        let mut array = Vec::from_iter(value);
        array.sort();
        result[key] = Value::from(array);
    }

    return result;
}

fn set_values(row: &Value, fields: &Vec<&str>, values: &mut HashMap<String, HashSet<String>>) {
    for field in fields {
        let value = &row[&field].clone();
        let key: String = String::from(*field);
        let obj = values.get_mut(&key);

        match obj {
            None => {
                let mut set: HashSet<String> = HashSet::new();
                set.insert(value.to_string());
                values.insert(field.to_string(), set);
            }
            Some(set) => {
                set.insert(value.to_string());
            }
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::get_unique;

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
    fn get_unique_test() {
        let data: Vec<Value> = get_data();
        let fields: Vec<&str> = vec!["code", "value", "isActive"];
        let result = get_unique(&fields, &data, None);

        let code_array = result["code"].as_array().unwrap();
        let value_array = result["value"].as_array().unwrap();
        let is_active_array = result["isActive"].as_array().unwrap();

        assert_eq!(code_array.len(), 5);
        assert_eq!(value_array.len(), 3);
        assert_eq!(is_active_array.len(), 2);
    }

    #[test]
    fn get_unique_rows_test() {
        let data: Vec<Value> = get_data();
        let fields: Vec<&str> = vec!["code", "value", "isActive"];
        let rows: Vec<usize> = vec![0, 1, 2];
        let result = get_unique(&fields, &data, Some(rows));

        let code_array = result["code"].as_array().unwrap();
        let value_array = result["value"].as_array().unwrap();
        let is_active_array = result["isActive"].as_array().unwrap();

        assert_eq!(code_array.len(), 3);
        assert_eq!(value_array.len(), 2);
        assert_eq!(is_active_array.len(), 2);
    }
}