use std::borrow::BorrowMut;
use std::collections::HashMap;
use serde_json::Value;

#[derive(Debug)]
struct Field {
    name     : String,
    value    : String,
    children : HashMap<String, Field>,
    rows     : Option<Vec<i64>>
}

impl Field {
    pub fn new(name: String, value: String) -> Field {
        Field {
            name,
            value,
            children    : HashMap::new(),
            rows        : None
        }
    }

    pub fn process_row(&mut self, row: &Value, fields: &Vec<&str>, field_index: usize, row_index: usize) {
        if field_index >= fields.len() {
            match self.rows.borrow_mut() {
                None => {
                    let mut rows = Vec::new();
                    rows.push(row_index as i64);
                    self.rows = Some(rows);
                }
                Some(collection) => {
                    collection.push(row_index as i64);
                }
            }

            return;
        }

        let field = fields[field_index];
        let value= get_value(&row, field);

        if self.children.contains_key(value.as_str()) {
            let child = self.children.get_mut(value.as_str()).unwrap();
            child.process_row(&row, &fields, field_index + 1, row_index);
        }
        else {
            let mut child = Field::new(String::from(field), String::from(value.clone()));
            let key = String::from(value.clone());

            &child.process_row(&row, &fields, field_index + 1, row_index);
            self.children.insert(key, child);
        }
    }
}

fn get_value(row: &Value, field: &str) -> String {
    if row[field].is_string() {
        return String::from(&row[field].as_str().unwrap().to_string());
    }

    return row[&field].to_string();
}

pub fn group(intent: &Value, data: &Value) -> Value {
    let fields = intent.as_array().unwrap().iter().map(|x| x.as_str().unwrap()).collect::<Vec<&str>>();

    let mut row_index = 0;
    let mut root = Field::new("grouping".into(), "".into());

    for row in data.as_array().unwrap() {
        root.process_row(&row, &fields, 0, row_index);
        row_index += 1;
    }

    println!("{:?}", root);

    Value::Object(Default::default())
}

// fn add_value_object(target: &mut Value, field: &String) {
//     let result = Value::Object(Default::default());
//     target[&field] = result;
//     target["_count"] = Value::from(1);
// }
//
// fn add_value_array(target: &mut Value, field: &String, row_index: usize) {
//     add_value_object(target, &field);
//     let obj = &mut target[field];
//
//     let mut array: Vec<Value> = Vec::new();
//     array.push(Value::from(row_index as i64));
//     obj["rows"] = Value::Array(array);
//     obj["_count"] = Value::from(1);
// }
//
// fn add_row_index_to_array(target: &mut Value, row_index: usize) {
//     let mut collection: Vec<Value> = target.as_array().unwrap().to_vec();
//     let index_value = Value::from(row_index as i64);
//     collection.push(index_value);
// }
//
// fn create_object_path(target: &mut Value, fields: &Vec<&str>, field_ind: usize, record: &Value, row_index: usize) {
//     let field = fields[field_ind];
//     let value_str: String;
//
//     if record[field].is_string() {
//         value_str = String::from(record[field].as_str().unwrap())
//     }
//     else {
//         value_str = record[field].to_string();
//     }
//
// //println!("target: {:?}, field: {:?}, value: {:?}", target, &value_str, target[&value_str]);
//
//     match target.get_mut(&value_str) {
//         None => {
//             if field_ind == fields.len() -1 {
//                 add_value_array(target, &value_str, row_index);
//             }
//             else {
//                 add_value_object(target, &value_str);
//                 create_object_path(&mut target[&value_str], &fields, field_ind + 1, record, row_index);
//             }
//         }
//         Some(value) => {
//             if field_ind == fields.len() - 1 {
//                 let rows = &mut value["rows"];
//                 add_row_index_to_array(rows, row_index);
//             }
//             else {
//                 let obj = target.get_mut(&value_str).unwrap();
//                 let count = obj["_count"].as_i64().unwrap();
//                 obj["_count"] = Value::from(count + 1);
//                 create_object_path(obj, &fields, field_ind + 1, record, row_index);
//             }
//         }
//     }
// }

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::group::group;

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
    fn group_test() {
        let data = get_data();
        let intent = json!(["value"]);
        let result = group(&intent, &data);
    }

    #[test]
    fn test() {
        let fields = json!(["field1", "field2"]);
        let data = json!([
            {"field1": 10, "field2": "a", "value": 1},
            {"field1": 10, "field2": "b", "value": 2},
            {"field1": 11, "field2": "c", "value": 3},
            {"field1": 10, "field2": "a", "value": 4}
        ]);

        let result = group(&fields, &data);
    }
}
