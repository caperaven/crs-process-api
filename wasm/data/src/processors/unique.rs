use std::collections::{HashMap};
use serde_json::Value;

pub fn get_unique(intent: &Vec<&str>, data: &Vec<Value>, rows: Option<Vec<usize>>) -> Value {
    let mut fields_map: HashMap<String, HashMap<String, i32>> = HashMap::new();

    match rows {
        None => {
            for row in data {
                set_fields_map(&row, &intent, &mut fields_map);
            }
        }
        Some(rows) => {
            for row_index in rows {
                let row = &data[row_index];
                set_fields_map(&row, &intent, &mut fields_map);
            }
        }
    }

    let mut result = Value::Object(Default::default());

    for (field, value_count_map) in fields_map.into_iter() {
        let mut value_count = Value::Object(Default::default());

        for (value, count) in value_count_map.into_iter() {
            value_count[value] = Value::from(count);
        }

        result[field] = value_count;
    }

    return result;
}

fn set_fields_map(row: &Value, fields: &Vec<&str>, fields_map: &mut HashMap<String, HashMap<String, i32>>) {
    for field in fields {
        let record_value: &String = &row[&field].clone().to_string();
        let field_name: String = String::from(*field);
        let fields_map_item = fields_map.get_mut(&field_name);

        match fields_map_item {
            // the field is not in the map yet
            None => {
                let mut value_count_map: HashMap<String, i32> = HashMap::new();
                value_count_map.insert(record_value.clone(), 1);
                fields_map.insert(field_name, value_count_map);
            }

            // the field is in the map, check the values
            Some(value_count_map) => {
                value_count_map.entry(record_value.clone())
                    .and_modify(|count| *count += 1)
                    .or_insert(1);
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

        assert_eq!(result["code"]["\"A\""].as_i64().unwrap(), 1);
        assert_eq!(result["value"]["10"].as_i64().unwrap(), 2);
        assert_eq!(result["isActive"]["true"].as_i64().unwrap(), 3);
    }

    #[test]
    fn get_unique_rows_test() {
        let data: Vec<Value> = get_data();
        let fields: Vec<&str> = vec!["code", "value", "isActive"];
        let rows: Vec<usize> = vec![0, 1, 2];
        let result = get_unique(&fields, &data, Some(rows));

        assert_eq!(result["code"]["\"A\""].as_i64().unwrap(), 1);
        assert_eq!(result["value"]["10"].as_i64().unwrap(), 2);
        assert_eq!(result["isActive"]["true"].as_i64().unwrap(), 2);
    }
}