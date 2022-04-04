use std::borrow::BorrowMut;
use hashbrown::HashMap;
use serde_json::{Value};
use crate::processors::aggregate::aggregate_rows;

#[derive(Debug)]
pub struct Field {
    name        : String,
    value       : String,
    children    : HashMap<String, Field>,
    rows        : Option<Vec<i64>>,
    child_count : i64,
    row_count   : i64
}

impl Field {
    pub fn new(name: String, value: String) -> Field {
        Field {
            name,
            value,
            children    : HashMap::new(),
            rows        : None,
            child_count : 0,
            row_count   : 0
        }
    }

    pub fn process_row(&mut self, row: &Value, fields: &[&str], field_index: usize, row_index: usize) {
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
        let value= get_value(&row, &field);

        if self.children.contains_key(value.as_str()) {
            let child = self.children.get_mut(value.as_str()).unwrap();
            child.process_row(&row, &fields, field_index + 1, row_index);
        }
        else {
            let mut child = Field::new(field.to_string(), String::from(value.clone()));
            let key = String::from(value.clone());

            let _ = &child.process_row(&row, &fields, field_index + 1, row_index);
            self.children.insert(key, child);
        }
    }

    pub fn calculate_count(&mut self) {
        match &self.rows {
            None => {
                self.child_count = self.children.len() as i64;

                let mut count = 0;

                for (_k, v) in self.children.iter_mut() {
                    v.calculate_count();
                    count += v.row_count;
                }

                self.row_count = count;
            }
            Some(rows) => {
                self.child_count = rows.len() as i64;
                self.row_count = self.child_count;
            }
        }
    }

    pub fn to_json(&self, parent: &mut Value) {
        let mut obj         = Value::Object(Default::default());
        obj["child_count"]  = Value::from(self.child_count.clone());
        obj["row_count"]    = Value::from(self.row_count.clone());
        obj["field"]        = Value::from(self.name.clone());

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
pub fn group(intent: &Vec<&str>, data: &[Value], rows: Option<Vec<usize>>) -> Value {
    let root = build_field_structure(&data, &intent, rows);
    let mut result = Value::Object(Default::default());

    root.to_json(&mut result);
    return result;
}

/// For a given group or sub group, give me the records for that group including it's sub groups
pub fn get_group_rows(group_data: &Value) -> Vec<usize> {
    let mut rows: Vec<usize> = Vec::new();

    match group_data.get("children") {
        None => populate_group_rows(group_data, &mut rows),
        Some(children) => populate_group_rows(children, &mut rows)
    }

    return rows;
}

fn aggregate_group(group_data: &mut Value, aggregate_intent: &Value, data: &Vec<Value>) {
    // aggregate lower parts first ten move up and build it up from there.
    match group_data.get("rows") {
        None => {
            let rows = get_group_rows(group_data);
            let aggregate = aggregate_rows(&aggregate_intent, &data, Some(rows));
            group_data["aggregates"] = aggregate;
        }
        Some(rows) => {
            let rows_array = rows.as_array().unwrap();
            let mut rows_result: Vec<usize> = Vec::new();

            for rv in rows_array.iter() {
                rows_result.push(rv.as_i64().unwrap() as usize);
            }

            let aggregate = aggregate_rows(&aggregate_intent, &data, Some(rows_result));
            group_data["aggregates"] = aggregate;
        }
    }
}

fn aggregate_group_children(group_data: &mut Value, aggregate_intent: &Value, data: &Vec<Value>) {
    match group_data.get_mut("children") {
        None => {}
        Some(children) => {
            for (_key, child) in children.as_object_mut().unwrap().iter_mut() {
                aggregate_group(child, &aggregate_intent, &data);
            }
        }
    }
}

pub fn calculate_group_aggregate(group_data: &mut Value, aggregate_intent: &Value, data: &Vec<Value>) {
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
    let value = &row[&field];

    if value.is_string() {
        return String::from(value.as_str().unwrap().to_string());
    }

    return value.to_string();
}

fn build_field_structure(data: &[Value], fields: &[&str], rows: Option<Vec<usize>>) -> Field {
    let mut root = Field::new("root".into(),"root".into());

    match rows {
        None => {
            let mut row_index = 0;
            for record in data {
                root.process_row(&record, &fields, 0, row_index);
                row_index += 1;
            }
        }
        Some(rows) => {
            for row in rows {
                let record = &data[row];
                root.process_row(&record, &fields, 0, row);
            }
        }
    }


    root.calculate_count();
    return root;
}

fn populate_group_rows(group_data: &Value, rows: &mut Vec<usize>) {
    for (_name, obj) in group_data.as_object().unwrap().iter() {
        match obj.get("children") {
            None => {
                match obj.get("rows") {
                    None => {}
                    Some(rows_obj) => {
                        for row in rows_obj.as_array().unwrap() {
                            rows.push(row.as_i64().unwrap() as usize);
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
    fn group_test() {
        let data = get_data();
        let intent = Vec::from(["value", "isActive"]);
        let result = group(&intent, &data, None);

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

        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"field1": 10, "field2": "a", "value": 1}));
        data.push(json!({"field1": 10, "field2": "b", "value": 2}));
        data.push(json!({"field1": 11, "field2": "c", "value": 3}));
        data.push(json!({"field1": 10, "field2": "a", "value": 4}));

        let result = build_field_structure(&data, &fields, None);

        let child_10 = result.children.get("10").unwrap();
        assert_eq!(child_10.value, "10");
        assert_eq!(child_10.children.len(), 2);
        assert_eq!(child_10.child_count, 2);

        let child_10_a = child_10.children.get("a").unwrap();
        let child_10_a_rows = child_10_a.rows.as_ref().unwrap();
        assert_eq!(child_10_a.value, "a");
        assert_eq!(child_10_a.children.len(), 0);
        assert_eq!(child_10_a.child_count, 2);
        assert_eq!(child_10_a_rows.len(), 2);
        assert_eq!(child_10_a_rows[0], 0);
        assert_eq!(child_10_a_rows[1], 3);

        let child_10_b = child_10.children.get("b").unwrap();
        let child_10_b_rows = child_10_b.rows.as_ref().unwrap();
        assert_eq!(child_10_b.value, "b");
        assert_eq!(child_10_b.children.len(), 0);
        assert_eq!(child_10_b.child_count, 1);
        assert_eq!(child_10_b_rows.len(), 1);
        assert_eq!(child_10_b_rows[0], 1);

        let child_11 = result.children.get("11").unwrap();
        assert_eq!(child_11.value, "11");
        assert_eq!(child_11.children.len(), 1);
        assert_eq!(child_11.child_count, 1);

        let child_11_c = child_11.children.get("c").unwrap();
        let child_11_c_rows = child_11_c.rows.as_ref().unwrap();
        assert_eq!(child_11_c.value, "c");
        assert_eq!(child_11_c.children.len(), 0);
        assert_eq!(child_11_c.child_count, 1);
        assert_eq!(child_11_c_rows.len(), 1);
        assert_eq!(child_11_c_rows[0], 2);
    }

    #[test]
    fn get_group_rows_test() {
        let data = get_data();
        let intent = Vec::from(["value", "isActive"]);
        let group = group(&intent, &data, None);
        let result = get_group_rows(&group);
        assert_eq!(result.len(), 5);

        let group_10 = &group["root"]["children"]["10"];
        let result = get_group_rows(&group_10);
        assert_eq!(result.len(), 2);
    }

    #[test]
    fn aggregate_group_test() {
        let data = get_data();
        let group_intent = Vec::from(["value", "isActive"]);
        let mut group = group(&group_intent, &data, None);
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
        let group_intent = Vec::from(["value", "isActive"]);
        let mut group = group(&group_intent, &data, None);
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

    #[test]
    fn aggregate_subset_test() {
        let data = get_data();
        let group_intent = Vec::from(["value"]);
        let mut group = group(&group_intent, &data, Some(vec![0, 1, 2]));

        assert_eq!(group["root"]["child_count"], 2);
        assert_eq!(group["root"]["children"]["10"]["child_count"], 2);
        assert_eq!(group["root"]["children"]["20"]["child_count"], 1);
    }
}
