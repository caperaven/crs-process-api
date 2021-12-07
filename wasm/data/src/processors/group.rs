use std::borrow::BorrowMut;
use std::collections::HashMap;
use serde_json::Value;

#[derive(Debug)]
pub struct Field {
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

            let _ = &child.process_row(&row, &fields, field_index + 1, row_index);
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

pub fn _group(intent: &Value, data: &Value) -> Value {
    let fields = intent.as_array().unwrap().iter().map(|x| x.as_str().unwrap()).collect::<Vec<&str>>();

    let root = build_field_structure(&data, &fields);
    println!("{:?}", root);

    Value::Object(Default::default())
}

pub fn build_field_structure(data: &Value, fields: &Vec<&str>) -> Field {
    let mut row_index = 0;
    let mut root = Field::new("grouping".into(), "".into());

    for row in data.as_array().unwrap() {
        root.process_row(&row, &fields, 0, row_index);
        row_index += 1;
    }

    root
}

#[cfg(test)]
mod test {
    use serde_json::{json};
    use crate::processors::group::{build_field_structure};

    // fn get_data() -> Value {
    //     return json!([
    //         {"id": 0, "code": "A", "value": 10, "isActive": true},
    //         {"id": 1, "code": "B", "value": 10, "isActive": false},
    //         {"id": 2, "code": "C", "value": 20, "isActive": true},
    //         {"id": 3, "code": "D", "value": 20, "isActive": true},
    //         {"id": 4, "code": "E", "value": 5, "isActive": false}
    //     ]);
    // }

    // #[test]
    // fn group_test() {
    //     let data = get_data();
    //     let intent = json!(["value"]);
    //     let result = group(&intent, &data);
    // }

    #[test]
    fn field_structure_test() {
        let fields: Vec<&str> = vec!["field1", "field2"];

        let data = json!([
            {"field1": 10, "field2": "a", "value": 1},
            {"field1": 10, "field2": "b", "value": 2},
            {"field1": 11, "field2": "c", "value": 3},
            {"field1": 10, "field2": "a", "value": 4}
        ]);

        let result = build_field_structure(&data, &fields);
        println!("{:?}", result);

        let child_10 = result.children.get("10").unwrap();
        assert_eq!(child_10.name, "field1");
        assert_eq!(child_10.value, "10");
        assert_eq!(child_10.children.len(), 2);

        let child_10_a = child_10.children.get("a").unwrap();
        let child_10_a_rows = child_10_a.rows.as_ref().unwrap();
        assert_eq!(child_10_a.name, "field2");
        assert_eq!(child_10_a.value, "a");
        assert_eq!(child_10_a.children.len(), 0);
        assert_eq!(child_10_a_rows.len(), 2);
        assert_eq!(child_10_a_rows[0], 0);
        assert_eq!(child_10_a_rows[1], 3);

        let child_10_b = child_10.children.get("b").unwrap();
        let child_10_b_rows = child_10_b.rows.as_ref().unwrap();
        assert_eq!(child_10_b.name, "field2");
        assert_eq!(child_10_b.value, "b");
        assert_eq!(child_10_b.children.len(), 0);
        assert_eq!(child_10_b_rows.len(), 1);
        assert_eq!(child_10_b_rows[0], 1);

        let child_11 = result.children.get("11").unwrap();
        assert_eq!(child_11.name, "field1");
        assert_eq!(child_11.value, "11");
        assert_eq!(child_11.children.len(), 1);

        let child_11_c = child_11.children.get("c").unwrap();
        let child_11_c_rows = child_11_c.rows.as_ref().unwrap();
        assert_eq!(child_11_c.name, "field2");
        assert_eq!(child_11_c.value, "c");
        assert_eq!(child_11_c.children.len(), 0);
        assert_eq!(child_11_c_rows.len(), 1);
        assert_eq!(child_11_c_rows[0], 2);
    }
}