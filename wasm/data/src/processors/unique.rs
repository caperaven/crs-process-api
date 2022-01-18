use std::collections::{HashMap};
use serde_json::Value;
use crate::processors::sort::{place_objects, Field};

#[derive(Debug)]
struct ValueCount {
    value: String,
    count: i64
}

struct ValueMap {
    field: String,
    map: HashMap<String, i64>
}

impl ValueMap {
    pub fn new(field: String, object: &Value) -> ValueMap {
        let mut result = ValueMap {
            field,
            map: Default::default()
        };

        result.process(object);
        result
    }

    pub fn process(&mut self, object: &Value) {
        let value = object.get(&self.field);

        match value {
            None => {}
            Some(value) => {
                let value_str: String = value.to_string();

                self.map.entry(value_str)
                    .and_modify(|count|*count += 1)
                    .or_insert(1);
            }
        }
    }

    pub fn to_vec(&self) -> Vec<ValueCount> {
        let mut result: Vec<ValueCount> = Vec::new();

        for (key, value) in &self.map {
            result.push(ValueCount{
                value: key.clone(),
                count: *value
            });
        }

        result
    }
}

pub fn get_unique(fields: &[&str], data: &[Value], rows: Option<Vec<usize>>, sort: Option<String>) -> Value {
    let result_map: HashMap<String, ValueMap> = get_field_map(&fields, &data, rows);

    Value::Null
}

fn get_field_map(fields: &[&str], data: &[Value], rows: Option<Vec<usize>>) -> HashMap<String, ValueMap> {
    let mut result: HashMap<String, ValueMap> = HashMap::new();

    match rows {
        None => {
            for record in data {
                set_field_map(record, fields, &mut result);
            }
        }
        Some(indexes) => {
            for index in indexes {
                let record = &data[index];
                set_field_map(record, fields, &mut result);
            }
        }
    }

    result
}

fn set_field_map(record: &Value, fields: &[&str], map: &mut HashMap<String, ValueMap>) {
    for field_name in fields {
        let name: String = field_name.to_owned().to_string();

        map.entry(name.clone())
            .and_modify(|value_map| value_map.process(record))
            .or_insert(ValueMap::new(name, record));
    }
}


#[cfg(test)]
mod test {
    use std::collections::HashMap;
    use serde_json::{json, Value};
    use crate::processors::unique::{get_field_map, ValueCount, ValueMap};

    fn get_data() -> [Value; 5] {
        let result = [
            json!({"id": 0, "code": "A", "value": 10, "isActive": true}),
            json!({"id": 1, "code": "B", "value": 10, "isActive": false}),
            json!({"id": 2, "code": "C", "value": 20, "isActive": true}),
            json!({"id": 3, "code": "D", "value": 20, "isActive": true}),
            json!({"id": 4, "code": "E", "value": 5, "isActive": false})
        ];

        result
    }

    #[test]
    fn value_map_test() {
        let data = get_data();
        let mut instance = ValueMap::new("code".to_string(), &data[0]);
        instance.process(&data[1]);
        instance.process(&data[2]);

        let result: Vec<ValueCount> = instance.to_vec();
        assert_eq!(result.len(), 3);
        for item in result {
            assert_eq!(item.count, 1);
        }
    }

    #[test]
    fn get_field_map_test() {
        let data = get_data();
        let fields: [&str; 3] = ["code", "value", "isActive"];
        let result: HashMap<String, ValueMap>  = get_field_map(&fields, &data, None);

        let code = result.get("code").unwrap();
        let value = result.get("value").unwrap();
        let is_active = result.get("isActive").unwrap();

        assert_eq!(code.field, "code");
        assert_eq!(value.field, "value");
        assert_eq!(is_active.field, "isActive");

        let code_values = code.to_vec();
        let value_values = value.to_vec();
        let is_active_values = is_active.to_vec();

        assert_eq!(code_values.len(), 5);
        assert_eq!(value_values.len(), 3);
        assert_eq!(is_active_values.len(), 2);
    }
}

// pub fn get_unique(intent: &[&str], data: &[Value], rows: Option<Vec<usize>>, sort: Option<String>) -> Value {
//     let mut fields_map: HashMap<String, HashMap<String, i32>> = HashMap::new();
//
//     match rows {
//         None => {
//             for row in data {
//                 set_fields_map(&row, &intent, &mut fields_map);
//             }
//         }
//         Some(rows) => {
//             for row_index in rows {
//                 let row = &data[row_index];
//                 set_fields_map(&row, &intent, &mut fields_map);
//             }
//         }
//     }
//
//     let mut result = Value::Object(Default::default());
//
//     for (field, value_count_map) in fields_map.into_iter() {
//         let mut field_obj: Vec<Value> = vec![];
//
//         for (value, count) in value_count_map.into_iter() {
//             let mut value_count = Value::Object(Default::default());
//             value_count["value"] = value.parse().unwrap();
//             value_count["count"] = Value::from(count);
//             field_obj.push(value_count);
//         }
//
//         result[field] = Value::from(field_obj);
//     }
//
//     // match sort {
//     //     None => {}
//     //     Some(sort) => {
//     //         return sort_unique_result(&mut result, sort);
//     //     }
//     // };
//
//     return result;
// }
//
// // fn sort_unique_result(result: &mut Value, sort: String) -> Value {
// //     let sort_intent: Vec<Value> = serde_json::from_str(sort.as_str()).unwrap();
// //     let mut sort_iter = sort_intent.into_iter();
// //
// //     let mut obj = result.as_object().unwrap().to_owned();
// //     for (key, value) in obj.iter_mut() {
// //         let field = key;
// //         let field_intent = &sort_iter.find(|x| x["name"].eq(&Value::from(field.as_str())));
// //
// //         match field_intent {
// //             None => {
// //                 println!("no sort defined for {:?}", field);
// //             },
// //             Some(field_obj) => {
// //                 let field_name: String = field_obj["name"].as_str().unwrap().to_string();
// //                 let data_type: Option<&Value> = field_obj.get("type");
// //                 let direction: Option<&Value> = field_obj.get("direction");
// //                 let field: Field = Field::new(field_name, data_type, direction);
// //                 let fields: &[Field] = &vec![field];
// //
// //                 // let mut array = value.as_array().unwrap().to_owned();
// //                 // array.sort_by(|a, b| sort_eval(a, b, fields));
// //                 println!("{:?}", value);
// //             }
// //         }
// //     }
// //
// //     result.to_owned()
// // }
//
// fn sort_eval(a: &Value, b:&Value, fields: &[Field]) -> Ordering {
//     let result: Placement = place_objects(fields, b, a);
//
//     match result {
//         Placement::Before => Ordering::Greater,
//         Placement::After => Ordering::Less
//     }
// }
//
// fn set_fields_map(row: &Value, fields: &[&str], fields_map: &mut HashMap<String, HashMap<String, i32>>) {
//     for field in fields {
//         let record_value: &String = &row[&field].clone().to_string();
//         let field_name: String = String::from(*field);
//         let fields_map_item = fields_map.get_mut(&field_name);
//
//         match fields_map_item {
//             // the field is not in the map yet
//             None => {
//                 let mut value_count_map: HashMap<String, i32> = HashMap::new();
//                 value_count_map.insert(record_value.clone(), 1);
//                 fields_map.insert(field_name, value_count_map);
//             }
//
//             // the field is in the map, check the values
//             Some(value_count_map) => {
//                 value_count_map.entry(record_value.clone())
//                     .and_modify(|count| *count += 1)
//                     .or_insert(1);
//             }
//         }
//     }
//
//     for (field, value) in fields_map.into_iter() {
//         println!("{:?}", value);
//         value.into_iter().is_sorted_by(|a, b| a.partial_cmp(b));
//         println!("{:?}", value);
//     }
// }
//
// #[cfg(test)]
// mod test {
//     use serde_json::{json, Value};
//     use crate::processors::get_unique;
//
//     fn get_data() -> [Value; 5] {
//         let result = [
//             json!({"id": 0, "code": "A", "value": 10, "isActive": true}),
//             json!({"id": 1, "code": "B", "value": 10, "isActive": false}),
//             json!({"id": 2, "code": "C", "value": 20, "isActive": true}),
//             json!({"id": 3, "code": "D", "value": 20, "isActive": true}),
//             json!({"id": 4, "code": "E", "value": 5, "isActive": false})
//         ];
//
//         result
//     }
//
//     #[test]
//     fn get_unique_test() {
//         let data: [Value; 5] = get_data();
//         let fields: [&str; 3] = ["code", "value", "isActive"];
//
//         let sort = json!([
//             { "name": "code" }
//         ]);
//
//         let sort_str = sort.to_string();
//
//         let _result = get_unique(&fields, &data, None, Some(sort_str));
//
//         // println!("{:?}", &result.pointer("/code/0/value"));
//         // println!("{:?}", &result.pointer("/code/0/count"));
//
//         // assert_eq!(result.pointer("/code/0/value").unwrap(), &Value::from("A"));
//         // assert_eq!(result.pointer("/code/0/count").unwrap(), &Value::from(1));
//
//         //assert_eq!(result.pointer("/code/[0]/value").unwrap(), &Value::from("A"));
//
//         // assert_eq!(result["code"]["\"A\""].as_i64().unwrap(), 1);
//         // assert_eq!(result["value"]["10"].as_i64().unwrap(), 2);
//         // assert_eq!(result["isActive"]["true"].as_i64().unwrap(), 3);
//     }
//
//     #[test]
//     fn get_unique_rows_test() {
//         let data: [Value; 5] = get_data();
//         let fields: [&str; 3] = ["code", "value", "isActive"];
//         let rows: Vec<usize> = vec![0, 1, 2];
//         let _result = get_unique(&fields, &data, Some(rows), None);
//
//         // assert_eq!(result["code"]["\"A\""].as_i64().unwrap(), 1);
//         // assert_eq!(result["value"]["10"].as_i64().unwrap(), 2);
//         // assert_eq!(result["isActive"]["true"].as_i64().unwrap(), 2);
//     }
// }