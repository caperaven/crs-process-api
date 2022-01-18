use std::cmp::Ordering;
use std::collections::HashMap;
use serde_json::{json, Value};
use crate::duration::iso8601_placement;
use crate::enums::Placement;
use crate::evaluators::LessThan;
use crate::traits::Eval;

pub fn get_unique(fields: Vec<Value>, data: Vec<Value>) -> Value {
    let mut unique_sorted: UniqueSorted = UniqueSorted::new(fields, data);
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
        FieldData {
            field: field_obj["name"].as_str().unwrap().to_string(),
            data_type: field_obj["type"].as_str().unwrap().to_string(),
            value_count: Default::default()
        }
    }

    pub fn process_value(&mut self, value: &Value) {
        let value_str: String = match value {
            Value::Null => "null".to_string(),
            Value::String(_) => value.as_str().unwrap().to_string(),
            _ => value.to_string()
        };

        self.value_count.entry(value_str)
            .and_modify(|count| *count += 1)
            .or_insert(1);
    }

    pub fn get_values(&mut self) -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();

        for (value, count) in &self.value_count {
            let mut value_obj = Value::Object(Default::default());
            value_obj["count"] = Value::from(count.clone());

            let value_str = value.clone();
            match self.data_type.as_ref() {
                "string" => {
                    value_obj["value"] = Value::from(value_str);
                },
                "duration" => {
                    value_obj["value"] = Value::from(value_str);
                },
                "int" => {
                    let i_value = value_str.parse::<i64>().unwrap();
                    value_obj["value"] = Value::from(i_value);
                }
                "float" => {
                    let f_value = value_str.parse::<f64>().unwrap();
                    value_obj["value"] = Value::from(f_value);
                }
                "boolean" => {
                    let b_value = value_str.parse::<bool>().unwrap();
                    value_obj["value"] = Value::from(b_value);
                }
                _ => {}
            }

            result.push(value_obj);
        }

        result.sort_by(|a, b| sort_eval(&self.data_type, a, b));

        return result;
    }
}

fn sort_eval(data_type: &String, obj1: &Value, obj2: &Value) -> Ordering {
    let value1 = &obj1["value"];
    let value2 = &obj2["value"];

    if data_type.as_str() == "duration" {
        match iso8601_placement(&value1, &value2) {
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
    pub fn new(fields: Vec<Value>, data: Vec<Value>) -> UniqueSorted {
        let mut result = UniqueSorted {
            fields: UniqueSorted::process_fields(fields)
        };

        result.process_data(data);
        return result;
    }

    pub fn process_fields(fields_collection: Vec<Value>) -> HashMap<String, FieldData>{
        let mut fields: HashMap<String, FieldData> = HashMap::new();

        for field in fields_collection {
            let field = FieldData::new(field);
            fields.insert(field.field.clone(), field);
        }

        fields.insert("null".to_string(), FieldData::new(json!({"name": "null", "type": "string"})));

        fields
    }

    pub fn process_data(&mut self, data: Vec<Value>) {
        for record in data {
            for (field, field_data) in &mut self.fields {
                let value = record.get(field);

                match value {
                    None => {}
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
            let values: Vec<Value> = field_data.get_values();
            result[field] = Value::from(values);
        }

        return result;
    }
}

#[cfg(test)]
mod test {
    use serde_json::{json, Value};
    use crate::get_unique;

    fn get_data() -> Vec<Value> {
        let mut result: Vec<Value> = Vec::new();
        result.push(json!({"id": 0, "code": "A", "value": 10, "isActive": true}));
        result.push(json!({"id": 1, "code": "B", "value": 10, "isActive": false}));
        result.push(json!({"id": 2, "code": "C", "value": 20, "isActive": true}));
        result.push(json!({"id": 3, "code": "D", "value": 20, "isActive": true}));
        result.push(json!({"id": 4, "code": "E", "value": 5, "isActive": false}));
        result
    }

    #[test]
    fn structure_test_code() {
        let data = get_data();
        let mut fields: Vec<Value> = Vec::new();
        fields.push(json!({"name": "code", "type": "string"}));

        let result = get_unique(fields, data);

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
        fields.push(json!({"name": "value", "type": "int"}));

        let result = get_unique(fields, data);

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

        let result = get_unique(fields, data);

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

        let result = get_unique(fields, data);

        assert_eq!(result.pointer("/duration/0/value").unwrap(), &Value::from("P0DT1H2M30S"));
        assert_eq!(result.pointer("/duration/0/count").unwrap(), &Value::from(1));
        assert_eq!(result.pointer("/duration/1/value").unwrap(), &Value::from("P1DT1H2M10S"));
        assert_eq!(result.pointer("/duration/1/count").unwrap(), &Value::from(2));
        assert_eq!(result.pointer("/duration/2/value").unwrap(), &Value::from("P10DT1H2M3S"));
        assert_eq!(result.pointer("/duration/2/count").unwrap(), &Value::from(1));
    }
}