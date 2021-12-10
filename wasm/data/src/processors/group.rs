use std::borrow::BorrowMut;
use std::collections::HashMap;
use serde_json::{Value};
use wasm_bindgen::JsValue;
use crate::processors::aggregate::aggregate_rows;

#[derive(Debug)]
pub struct Field {
    name        : String,
    value       : String,
    children    : HashMap<String, Field>,
    rows        : Option<Vec<i64>>,
    child_count : i64
}

impl Field {
    pub fn new(name: String, value: String) -> Field {
        Field {
            name,
            value,
            children    : HashMap::new(),
            rows        : None,
            child_count : 0
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

    pub fn calculate_count(&mut self) {
        match &self.rows {
            None => {
                self.child_count = self.children.len() as i64;

                for (_k, v) in self.children.iter_mut() {
                    v.calculate_count();
                }
            }
            Some(rows) => {
                self.child_count = rows.len() as i64;
            }
        }
    }

    pub fn to_json(&self, parent: &mut Value) {
        let mut obj         = Value::Object(Default::default());
        obj["child_count"]  = Value::from(self.child_count.clone());

        match &self.rows {
            None => {
                let mut children = Value::Object(Default::default());

                for (_k, child) in &self.children {
                    child.to_json(&mut children);
                }

                obj["children"] = children;
            }
            Some(rows) => {
                obj["rows"]     = Value::from(rows.clone());
            }
        }

        parent[&self.value] = obj;
    }
}

/// Given a group intent, group the data based on their values
pub fn group(intent: &Value, data: &Value) -> Value {
    let fields = intent.as_array().unwrap().iter().map(|x| x.as_str().unwrap()).collect::<Vec<&str>>();
    let root = build_field_structure(&data, &fields);
    let mut result = Value::Object(Default::default());

    root.to_json(&mut result);
    return result;
}

/// For a given group or sub group, give me the records for that group including it's sub groups
pub fn get_group_rows(group_data: &Value) -> Value {
    let mut rows: Vec<i64> = Vec::new();

    match group_data.get("children") {
        None => populate_group_rows(group_data, &mut rows),
        Some(children) => populate_group_rows(children, &mut rows)
    }

    Value::from(rows)
}

fn aggregate_group(group_data: &mut Value, aggregate_intent: &Value, data: &Value) {
    // aggregate lower parts first ten move up and build it up from there.
    match group_data.get("rows") {
        None => {
            let rows = get_group_rows(group_data);
            let aggregate = aggregate_rows(&aggregate_intent, &data, &rows);
            group_data["aggregates"] = aggregate;
        }
        Some(rows) => {
            let aggregate = aggregate_rows(&aggregate_intent, &data, &rows);
            group_data["aggregates"] = aggregate;
        }
    }
}

fn aggregate_group_children(group_data: &mut Value, aggregate_intent: &Value, data: &Value) {
    match group_data.get_mut("children") {
        None => {}
        Some(children) => {
            for (_key, child) in children.as_object_mut().unwrap().iter_mut() {
                aggregate_group(child, &aggregate_intent, &data);
            }
        }
    }
}

pub fn calculate_group_aggregate(group_data: &mut Value, aggregate_intent: &Value, data: &Value) {
    match group_data.get_mut("root") {
        None => {
            aggregate_group(group_data, &aggregate_intent, &data);
        }
        Some(root) => {
            aggregate_group(root, &aggregate_intent, &data);
        }
    }
}

fn get_value(row: &Value, field: &str) -> String {
    if row[field].is_string() {
        return String::from(&row[field].as_str().unwrap().to_string());
    }

    return row[&field].to_string();
}

fn build_field_structure(data: &Value, fields: &Vec<&str>) -> Field {
    let mut row_index = 0;
    let mut root = Field::new("grouping".into(), "root".into());

    for row in data.as_array().unwrap() {
        root.process_row(&row, &fields, 0, row_index);
        row_index += 1;
    }

    root.calculate_count();
    return root;
}

fn populate_group_rows(group_data: &Value, rows: &mut Vec<i64>) {
    for (_name, obj) in group_data.as_object().unwrap().iter() {
        match obj.get("children") {
            None => {
                match obj.get("rows") {
                    None => {}
                    Some(rows_obj) => {
                        for row in rows_obj.as_array().unwrap() {
                            rows.push(row.as_i64().unwrap());
                        }
                    }
                }
            }
            Some(children) => {
                populate_group_rows(children, rows);
            }
        }
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::processors::group::{aggregate_group_children, build_field_structure, calculate_group_aggregate, get_group_rows, group};

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
        let intent = json!(["value", "isActive"]);
        let result = group(&intent, &data);

        let group_5 = result.get("root")
            .and_then(|value| value.get("children"))
            .and_then(|value| value.get("5"))
            .unwrap();

        let group_10 = result.get("root")
            .and_then(|value| value.get("children"))
            .and_then(|value| value.get("10"))
            .unwrap();

        let group_20 = result.get("root")
            .and_then(|value| value.get("children"))
            .and_then(|value| value.get("20"))
            .unwrap();

        assert_eq!(group_5["child_count"], Value::from(1));
        assert_eq!(group_10["child_count"], Value::from(2));
        assert_eq!(group_20["child_count"], Value::from(1));

        assert_eq!(group_5["children"]["false"]["child_count"], Value::from(1));
        assert_eq!(group_10["children"]["false"]["child_count"], Value::from(1));
        assert_eq!(group_10["children"]["true"]["child_count"], Value::from(1));
        assert_eq!(group_20["children"]["true"]["child_count"], Value::from(2));
    }

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
        assert_eq!(child_10.child_count, 2);

        let child_10_a = child_10.children.get("a").unwrap();
        let child_10_a_rows = child_10_a.rows.as_ref().unwrap();
        assert_eq!(child_10_a.name, "field2");
        assert_eq!(child_10_a.value, "a");
        assert_eq!(child_10_a.children.len(), 0);
        assert_eq!(child_10_a.child_count, 2);
        assert_eq!(child_10_a_rows.len(), 2);
        assert_eq!(child_10_a_rows[0], 0);
        assert_eq!(child_10_a_rows[1], 3);

        let child_10_b = child_10.children.get("b").unwrap();
        let child_10_b_rows = child_10_b.rows.as_ref().unwrap();
        assert_eq!(child_10_b.name, "field2");
        assert_eq!(child_10_b.value, "b");
        assert_eq!(child_10_b.children.len(), 0);
        assert_eq!(child_10_b.child_count, 1);
        assert_eq!(child_10_b_rows.len(), 1);
        assert_eq!(child_10_b_rows[0], 1);

        let child_11 = result.children.get("11").unwrap();
        assert_eq!(child_11.name, "field1");
        assert_eq!(child_11.value, "11");
        assert_eq!(child_11.children.len(), 1);
        assert_eq!(child_11.child_count, 1);

        let child_11_c = child_11.children.get("c").unwrap();
        let child_11_c_rows = child_11_c.rows.as_ref().unwrap();
        assert_eq!(child_11_c.name, "field2");
        assert_eq!(child_11_c.value, "c");
        assert_eq!(child_11_c.children.len(), 0);
        assert_eq!(child_11_c.child_count, 1);
        assert_eq!(child_11_c_rows.len(), 1);
        assert_eq!(child_11_c_rows[0], 2);
    }

    #[test]
    fn get_group_rows_test() {
        let data = get_data();
        let intent = json!(["value", "isActive"]);
        let group = group(&intent, &data);
        let result = get_group_rows(&group);
        assert_eq!(result.as_array().unwrap().len(), 5);

        let group_10 = &group["root"]["children"]["10"];
        let result = get_group_rows(&group_10);
        assert_eq!(result.as_array().unwrap().len(), 2);
    }

    #[test]
    fn aggregate_group_test() {
        let data = get_data();
        let group_intent = json!(["value", "isActive"]);
        let mut group = group(&group_intent, &data);
        let ag_intent = json!({
            "min": "value",
            "max": "value",
            "ave": "value"
        });

        calculate_group_aggregate(&mut group, &ag_intent, &data);

        assert_eq!(group["root"]["aggregates"][0]["value"], 13.);
        assert_eq!(group["root"]["aggregates"][0]["agg"], "ave");
        assert_eq!(group["root"]["aggregates"][0]["field"], "value");
        assert_eq!(group["root"]["aggregates"][1]["value"], 20.);
        assert_eq!(group["root"]["aggregates"][1]["agg"], "max");
        assert_eq!(group["root"]["aggregates"][1]["field"], "value");
        assert_eq!(group["root"]["aggregates"][2]["value"], 5.);
        assert_eq!(group["root"]["aggregates"][2]["agg"], "min");
        assert_eq!(group["root"]["aggregates"][2]["field"], "value");
    }

    #[test]
    fn aggregate_children_test() {
        let data = get_data();
        let group_intent = json!(["value", "isActive"]);
        let mut group = group(&group_intent, &data);
        let ag_intent = json!({
            "min": "value",
            "max": "value",
            "ave": "value"
        });

        let mut root = group.get_mut("root").unwrap();

        aggregate_group_children(&mut root, &ag_intent, &data);

        assert_eq!(group["root"]["children"]["10"]["aggregates"][0]["value"], 10.);
        assert_eq!(group["root"]["children"]["10"]["aggregates"][0]["agg"], "ave");
        assert_eq!(group["root"]["children"]["10"]["aggregates"][0]["field"], "value");
        assert_eq!(group["root"]["children"]["10"]["aggregates"][1]["value"], 10.);
        assert_eq!(group["root"]["children"]["10"]["aggregates"][1]["agg"], "max");
        assert_eq!(group["root"]["children"]["10"]["aggregates"][1]["field"], "value");
        assert_eq!(group["root"]["children"]["10"]["aggregates"][2]["value"], 10.);
        assert_eq!(group["root"]["children"]["10"]["aggregates"][2]["agg"], "min");
        assert_eq!(group["root"]["children"]["10"]["aggregates"][2]["field"], "value");

        assert_eq!(group["root"]["children"]["20"]["aggregates"][0]["value"], 20.);
        assert_eq!(group["root"]["children"]["20"]["aggregates"][0]["agg"], "ave");
        assert_eq!(group["root"]["children"]["20"]["aggregates"][0]["field"], "value");
        assert_eq!(group["root"]["children"]["20"]["aggregates"][1]["value"], 20.);
        assert_eq!(group["root"]["children"]["20"]["aggregates"][1]["agg"], "max");
        assert_eq!(group["root"]["children"]["20"]["aggregates"][1]["field"], "value");
        assert_eq!(group["root"]["children"]["20"]["aggregates"][2]["value"], 20.);
        assert_eq!(group["root"]["children"]["20"]["aggregates"][2]["agg"], "min");
        assert_eq!(group["root"]["children"]["20"]["aggregates"][2]["field"], "value");

        assert_eq!(group["root"]["children"]["5"]["aggregates"][0]["value"], 5.);
        assert_eq!(group["root"]["children"]["5"]["aggregates"][0]["agg"], "ave");
        assert_eq!(group["root"]["children"]["5"]["aggregates"][0]["field"], "value");
        assert_eq!(group["root"]["children"]["5"]["aggregates"][1]["value"], 5.);
        assert_eq!(group["root"]["children"]["5"]["aggregates"][1]["agg"], "max");
        assert_eq!(group["root"]["children"]["5"]["aggregates"][1]["field"], "value");
        assert_eq!(group["root"]["children"]["5"]["aggregates"][2]["value"], 5.);
        assert_eq!(group["root"]["children"]["5"]["aggregates"][2]["agg"], "min");
        assert_eq!(group["root"]["children"]["5"]["aggregates"][2]["field"], "value");
    }
}
