use std::cmp::Ordering;
use std::collections::HashMap;
use serde_json::{Value};
use crate::duration::iso8601_placement;
use crate::enums::Placement;
use crate::evaluators::LessThan;
use crate::iso8601_to_duration_str;
use crate::traits::Eval;
use crate::utils::flood_indexes;

pub fn get_unique(fields: Vec<Value>, data: &Vec<Value>, rows: Option<Vec<usize>>) -> Value {
    let rows = match rows {
        Some(array) => array,
        None => flood_indexes(&data)
    };

    let mut unique_sorted: UniqueSorted = UniqueSorted::new(fields, data, &rows);
    unique_sorted.get_value()
}

/// This represents a field, the data type and the data
struct FieldData {
    field: String,
    data_type: String,
    value_count: HashMap<String, i64>
}

impl FieldData {
    pub fn new(field_obj: Value) -> FieldData {
        let mut field = field_obj["name"].as_str().unwrap().to_string();
        field = format!("/{}", field.replace(".", "/"));

        let data_type = match field_obj["type"].as_str() {
            None => "string".to_string(),
            Some(dt) => dt.to_string()
        };

        FieldData {
            field,
            data_type,
            value_count: Default::default()
        }
    }

    pub fn process_value(&mut self, value: &Value) {
        let value_str: String = match value {
            Value::Null => "null".to_string(),
            Value::String(str_value) => {
                if str_value.len() == 0 {
                    "null".to_string()
                }
                else {
                    value.as_str().unwrap().to_string()
                }
            },
            _ => value.to_string()
        };

        self.value_count.entry(value_str)
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    pub fn get_values(&mut self) -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();

        let mut null_obj: Option<Value> = None;

        for (value, count) in &self.value_count {
            let mut value_obj = Value::Object(Default::default());
            value_obj["count"] = Value::from(count.clone());

            if value == "null" {
                value_obj["value"] = Value::Null;
                null_obj = Some(value_obj);
            }
            else {
                let value_str = value.clone();
                match self.data_type.as_ref() {
                    "duration" => {
                        let mut result_obj = Value::Object(Default::default());
                        let value = Value::from(value_str);
                        result_obj["duration"] = Value::from(iso8601_to_duration_str(&value));
                        result_obj["iso"] = value;
                        value_obj["value"] = result_obj;
                    },
                    "long" => {
                        let i_value = value_str.parse::<i64>().unwrap();
                        value_obj["value"] = Value::from(i_value);
                    }
                    "number" => {
                        let f_value = value_str.parse::<f64>().unwrap();
                        value_obj["value"] = Value::from(f_value);
                    }
                    "boolean" => {
                        let b_value = value_str.parse::<bool>().unwrap();
                        value_obj["value"] = Value::from(b_value);
                    }
                    _ => {
                        // defaults as string
                        value_obj["value"] = Value::from(value_str);
                    }
                }

                result.push(value_obj);
            }
        }

        result.sort_by(|a, b| sort_eval(&self.data_type, a, b));

        match null_obj {
            None => {}
            Some(the_obj) => {
                result.push(the_obj);
            }
        }

        return result;
    }
}

fn sort_eval(data_type: &String, obj1: &Value, obj2: &Value) -> Ordering {
    let value1 = &obj1["value"];
    let value2 = &obj2["value"];

    if data_type.as_str() == "duration" {
        match iso8601_placement(&value1["iso"], &value2["iso"]) {
            Placement::Before => Ordering::Less,
            Placement::After => Ordering::Greater
        }
    }
    else {
        match LessThan::evaluate(&value1, &value2) {
            true => Ordering::Less,
            false => Ordering::Greater
        }
    }
}

/// main class that you interface with to get and set data
struct UniqueSorted {
    fields: HashMap<String, FieldData>
}

impl UniqueSorted {
    pub fn new(fields: Vec<Value>, data: &Vec<Value>, rows: &Vec<usize>) -> UniqueSorted {
        let mut result = UniqueSorted {
            fields: UniqueSorted::process_fields(fields)
        };

        result.process_data(data, rows);
        return result;
    }

    pub fn process_fields(fields_collection: Vec<Value>) -> HashMap<String, FieldData>{
        let mut fields: HashMap<String, FieldData> = HashMap::new();

        for field in fields_collection {
            let field = FieldData::new(field);
            fields.insert(field.field.clone(), field);
        }

        fields
    }

    pub fn process_data(&mut self, data: &Vec<Value>, rows: &Vec<usize>) {
        for row in rows {
            let record = &data[*row];

            for (field, field_data) in &mut self.fields {
                let value = record.pointer(field);

                match value {
                    None => {
                        field_data.process_value(&Value::Null);
                    }
                    Some(value_obj) => {
                        field_data.process_value(value_obj);
                    }
                }
            }
        }
    }

    pub fn get_value(&mut self) -> Value {
        let mut result: Value = Value::Object(Default::default());

        for (field, field_data) in &mut self.fields {
            let mut field_name = field.replace("/", ".");
            field_name.remove(0);

            let values: Vec<Value> = field_data.get_values();
            result[field_name] = Value::from(values);
        }

        return result;
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use serde_json::Value::Null;
    use crate::get_unique;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "value_f": 10.1, "isActive": true, "person": null}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "value_f": 10.2, "isActive": false, "person": null}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "value_f": 10.1, "isActive": true, "person": {"name": "John"}}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "value_f": 10.2, "isActive": true, "person": {"name": "John"}}));
        result.push(json!({"id": 4, "code": "E", "value": 5,  "value_f": 10.1, "isActive": false, "person": {"name": "Jane"}}));

        result
    }


    #[test]
    fn records_test() {
        let data = get_data();
        let records = vec![0usize, 1, 2];

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value", "type": "long"}));

        let result = get_unique(fields, &data, Some(records));

        assert_eq!(result.pointer("/value/0/value").unwrap(), &Value::from(10));
        assert_eq!(result.pointer("/value/0/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/value/1/value").unwrap(), &Value::from(20));
        assert_eq!(result.pointer("/value/1/count").unwrap(), &Value::from(1));

        let values = result.pointer("/value").unwrap().as_array().unwrap();
        assert_eq!(values.len(), 2);
    }


    #[test]
    fn on_path_test() {
        let data = get_data();

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "person.name", "type": "string"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/person.name/0/value").unwrap(), &Value::from("Jane"));
        assert_eq!(result.pointer("/person.name/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/person.name/1/value").unwrap(), &Value::from("John"));
        assert_eq!(result.pointer("/person.name/1/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/person.name/2/value").unwrap(), &Value::Null);
        assert_eq!(result.pointer("/person.name/2/count").unwrap(), &Value::from(2));
    }

    #[test]
    fn structure_test_code() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "code", "type": "string"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/code/0/value").unwrap(), &Value::from("A"));
        assert_eq!(result.pointer("/code/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/code/1/value").unwrap(), &Value::from("B"));
        assert_eq!(result.pointer("/code/1/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/code/2/value").unwrap(), &Value::from("C"));
        assert_eq!(result.pointer("/code/2/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/code/3/value").unwrap(), &Value::from("D"));
        assert_eq!(result.pointer("/code/3/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/code/4/value").unwrap(), &Value::from("E"));
        assert_eq!(result.pointer("/code/4/count").unwrap(), &Value::from(1));
    }

    #[test]
    fn structure_test_value() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value", "type": "long"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/value/0/value").unwrap(), &Value::from(5));
        assert_eq!(result.pointer("/value/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/value/1/value").unwrap(), &Value::from(10));
        assert_eq!(result.pointer("/value/1/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/value/2/value").unwrap(), &Value::from(20));
        assert_eq!(result.pointer("/value/2/count").unwrap(), &Value::from(2));
    }

    #[test]
    fn structure_test_boolean() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "isActive", "type": "boolean"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/isActive/0/value").unwrap(), &Value::from(false));
        assert_eq!(result.pointer("/isActive/0/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/isActive/1/value").unwrap(), &Value::from(true));
        assert_eq!(result.pointer("/isActive/1/count").unwrap(), &Value::from(3));
    }

    #[test]
    fn structure_test_duration() {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"id": 0, "duration": "P10DT1H2M3S"}));
        data.push(json!({"id": 1, "duration": "P1DT1H2M10S"}));
        data.push(json!({"id": 2, "duration": "P0DT1H2M30S"}));
        data.push(json!({"id": 3, "duration": "P1DT1H2M10S"}));

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "duration", "type": "duration"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/duration/0/value/iso").unwrap(), &Value::from("P0DT1H2M30S"));
        assert_eq!(result.pointer("/duration/0/value/duration").unwrap(), &Value::from("0:1:2:30"));
        assert_eq!(result.pointer("/duration/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/duration/1/value/iso").unwrap(), &Value::from("P1DT1H2M10S"));
        assert_eq!(result.pointer("/duration/1/value/duration").unwrap(), &Value::from("1:1:2:10"));
        assert_eq!(result.pointer("/duration/1/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/duration/2/value/iso").unwrap(), &Value::from("P10DT1H2M3S"));
        assert_eq!(result.pointer("/duration/2/value/duration").unwrap(), &Value::from("10:1:2:3"));
        assert_eq!(result.pointer("/duration/2/count").unwrap(), &Value::from(1));
    }

    #[test]
    fn structure_test_null_duration() {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"id": 3, "duration": Value::Null}));

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "duration", "type": "duration"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/duration/0/value").unwrap(), &Value::Null);
        assert_eq!(result.pointer("/duration/0/count").unwrap(), &Value::from(1));
    }

    #[test]
    fn null_float_test() {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"value": Null}));
        data.push(json!({"value": 10}));
        data.push(json!({"value": 20}));

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value", "type": "number"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/value/0/value").unwrap(), &Value::from(10.));
        assert_eq!(result.pointer("/value/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/value/1/value").unwrap(), &Value::from(20.));
        assert_eq!(result.pointer("/value/1/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/value/2/value").unwrap(), &Value::Null);
        assert_eq!(result.pointer("/value/2/count").unwrap(), &Value::from(1));
    }

    #[test]
    fn null_and_empty_test() {
        let mut data: Vec<Value> = Vec::new();
        data.push(json!({"value": "test"}));
        data.push(json!({"value": ""}));
        data.push(json!({"value": Null}));

        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "value", "type": "string"}));

        let result = get_unique(fields, &data, None);

        assert_eq!(result.pointer("/value/0/value").unwrap(), &Value::from("test"));
        assert_eq!(result.pointer("/value/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/value/1/value").unwrap(), &Value::Null);
        assert_eq!(result.pointer("/value/1/count").unwrap(), &Value::from(2));
    }

}